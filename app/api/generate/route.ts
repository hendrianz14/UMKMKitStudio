import { NextResponse } from "next/server";
import { supaServer } from "@/lib/supabase-server";

export const runtime = "nodejs"; // memastikan FormData stream aman

export async function POST(req: Request) {
  const sb = supaServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Cek Credits (jika view belum ada, izinkan sementara)
    let credits = 1;
    try {
      const { data: bal } = await sb
        .from("credit_balance")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      if (bal) credits = bal.balance ?? 0;
    } catch {}
    if (credits <= 0) {
      return NextResponse.json({ error: "Credits habis" }, { status: 402 });
    }

    // Ambil file gambar
    const formData = await req.formData();
    const file = formData.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File image wajib" }, { status: 400 });
    }

    // Buat row "results" status queued (id = uuid)
    const { data: job, error: insertErr } = await sb
      .from("results")
      .insert({
        user_id: user.id,
        status: "queued",
        input_name: (file as File).name ?? "image",
      })
      .select("id")
      .single();

    if (insertErr || !job) {
      return NextResponse.json({ error: insertErr?.message || "Gagal membuat job" }, { status: 500 });
    }

    // Kirim ke n8n webhook
    const webhook = process.env.N8N_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json({ error: "N8N_WEBHOOK_URL belum di-set" }, { status: 500 });
    }
    const payload = new FormData();
    payload.append("user_id", user.id);
    payload.append("job_id", job.id);
    payload.append("image", file, (file as File).name);

  // Opsional debug querystring:
  // const webhookWithQuery = `${webhook}?user_id=${encodeURIComponent(user.id)}&job_id=${encodeURIComponent(job.id)}`;
  // const r = await fetch(webhookWithQuery, { method: "POST", body: payload });
  const r = await fetch(webhook, { method: "POST", body: payload });
    if (!r.ok) {
      // Tandai gagal
      await sb.from("results").update({ status: "error" }).eq("id", job.id);
      const t = await r.text().catch(() => "");
      return NextResponse.json({ error: `Webhook gagal: ${r.status} ${t}` }, { status: 502 });
    }

    // Debit credits dipindah ke callback (hanya jika sukses)
    // try {
    //   await sb.from("credit_ledger").insert({ user_id: user.id, delta: -1, reason: "generate" });
    // } catch {}

    return NextResponse.json({ ok: true, job_id: job.id });
}
