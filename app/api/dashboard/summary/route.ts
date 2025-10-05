import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createServerClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch credits wallet summary
    const { data: wallet, error: walletError } = await supabase
      .from("credits_wallet")
      .select("balance, plan, expires_at")
      .eq("user_id", user.id)
      .single<Database['public']['Tables']['credits_wallet']['Row']>();

    if (walletError) {
      console.error("Error fetching wallet:", walletError);
      return NextResponse.json({ error: walletError.message }, { status: 500 });
    }

    // Fetch jobs this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count: jobsThisWeek, error: jobsError } = await supabase
      .from("jobs")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .gte("created_at", oneWeekAgo.toISOString());

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
      return NextResponse.json({ error: jobsError.message }, { status: 500 });
    }

    // Fetch credits used this week
    const { data: creditsUsed, error: ledgerError } = await supabase
      .from("credits_ledger")
      .select("change")
      .eq("user_id", user.id)
      .lt("change", 0) // Only negative changes (credits used)
      .gte("created_at", oneWeekAgo.toISOString());

    if (ledgerError) {
      console.error("Error fetching ledger:", ledgerError);
      return NextResponse.json({ error: ledgerError.message }, { status: 500 });
    }

    const creditsUsedThisWeek = creditsUsed?.reduce((sum: number, entry: { change: number }) => sum + entry.change, 0) || 0;

    // Free pack info (dummy for now)
    const freePack = { credits: 25, days_left: 7 }; // Placeholder values

    return NextResponse.json({
      wallet: {
        balance: wallet.balance,
        plan: wallet.plan,
        expires_at: wallet.expires_at,
      },
      jobs_this_week: jobsThisWeek,
      credits_used_this_week: Math.abs(creditsUsedThisWeek),
      free_pack: freePack,
    });
  } catch (error) {
    console.error("Unhandled error in summary API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
