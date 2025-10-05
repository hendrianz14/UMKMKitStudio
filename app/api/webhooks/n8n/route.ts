import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  // 1. Validate webhook secret
  const n8nSecret = process.env.N8N_CALLBACK_SECRET;
  const signature = req.headers.get("X-N8N-SIGNATURE");
  const body = await req.json(); // Read body once

  if (!n8nSecret || !signature) {
    console.error("Webhook secret or signature missing.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hmac = crypto.createHmac("sha256", n8nSecret);
  hmac.update(JSON.stringify(body));
  const digest = hmac.digest("hex");

  if (digest !== signature) {
    console.error("Invalid webhook signature.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { job_id, status, output_url, tokens_used, error_message } = body;

  if (!job_id || !status) {
    return NextResponse.json({ error: "Missing job_id or status" }, { status: 400 });
  }

  // Use service role key for n8n callback to bypass RLS
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Fetch the job to get user_id and project_id
    const { data: job, error: fetchJobError } = await supabaseAdmin
      .from("jobs")
      .select("user_id, project_id, type")
      .eq("id", job_id)
      .single();

    if (fetchJobError || !job) {
      console.error("Error fetching job or job not found:", fetchJobError);
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const { user_id, project_id, type } = job;

    // 2. Update jobs table
    const { error: updateJobError } = await supabaseAdmin
      .from("jobs")
      .update({
        status,
        output_url,
        tokens_used,
        error_message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job_id);

    if (updateJobError) {
      console.error("Error updating job:", updateJobError);
      return NextResponse.json({ error: updateJobError.message }, { status: 500 });
    }

    // 3. If job is 'done', update assets, ledger, and wallet
    if (status === "done") {
      // Create new asset
      const { error: insertAssetError } = await supabaseAdmin
        .from("assets")
        .insert({
          project_id,
          user_id,
          image_url: output_url,
          thumb_url: output_url, // Assuming output_url can also be used as thumbnail for now
          meta: { job_id, type },
        });

      if (insertAssetError) {
        console.error("Error inserting asset:", insertAssetError);
        return NextResponse.json({ error: insertAssetError.message }, { status: 500 });
      }

      // Determine credit cost (dummy for now, should come from config/DB)
      const creditCost = tokens_used || 1; // Example: 1 credit per token used

      // Create new ledger entry
      const { error: insertLedgerError } = await supabaseAdmin
        .from("credits_ledger")
        .insert({
          user_id,
          change: -creditCost,
          reason: type, // e.g., 'generate', 'remove_bg'
          job_id,
          meta: { tokens_used },
        });

      if (insertLedgerError) {
        console.error("Error inserting ledger entry:", insertLedgerError);
        return NextResponse.json({ error: insertLedgerError.message }, { status: 500 });
      }

      // Update credits wallet balance
      const { error: updateWalletError } = await supabaseAdmin
        .rpc('decrement_credits', { user_id_param: user_id, amount: creditCost });

      if (updateWalletError) {
        console.error("Error updating wallet balance:", updateWalletError);
        return NextResponse.json({ error: updateWalletError.message }, { status: 500 });
      }
    }

    // 4. Broadcast Realtime events (optional, requires setting up Supabase Realtime)
    // You would typically use a dedicated Supabase client for Realtime broadcasts
    // For example: supabase.channel(`user:${user_id}`).send({ type: 'broadcast', event: 'job_updated', payload: { job_id, status } });

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Unhandled error in n8n callback API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
