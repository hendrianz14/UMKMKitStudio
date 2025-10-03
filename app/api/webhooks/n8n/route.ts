import { NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabase-admin";

  const secret = req.headers.get("x-n8n-secret");
  if (!secret || secret !== process.env.N8N_CALLBACK_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const admin = supaAdmin();

  let body: any;
  try { body = await req.json(); } catch { body = {}; }

  const { job_id, status, output_url, meta } = body || {};
  if (!job_id) return NextResponse.json({ ok: false, error: "job_id required" }, { status: 400 });

  // Ambil user_id dari tabel results (server role, bypass RLS)
  const { data: r, error: readErr } = await admin
    .from("results")
    .select("user_id")
    .eq("id", job_id)
    .maybeSingle();
  if (readErr || !r) return NextResponse.json({ ok: false, error: readErr?.message || "job not found" }, { status: 404 });

  // Update hasil
  const { error: upErr } = await admin
    .from("results")
    .update({
      status: status ?? "done",
      output_url: output_url ?? null,
      meta: meta ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", job_id);
  if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });

  // Potong credits HANYA bila sukses
  if ((status ?? "done") === "done") {
    try {
      await admin.from("credit_ledger").insert({
        user_id: r.user_id,
        delta: -1,
        reason: "generate_success",
      });
    } catch { /* biarkan diam jika tabel belum ada */ }
  }

  return NextResponse.json({ ok: true });
}
