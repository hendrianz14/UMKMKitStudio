import { NextResponse } from "next/server";
import { supaServer } from "@/lib/supabase-server";
import { getFirebaseUploadAndPublicUrls } from "@/lib/firebase-admin";

export const runtime = "nodejs"; // memastikan FormData stream aman

export async function POST(req: Request) {
  const sb = supaServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Cek Credits (jika view belum ada, izinkan sementara)
    let credits = 1;
    try {
      const { data: bal } = await sb
        .from("credits_wallet")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      if (bal) credits = bal.balance ?? 0;
    } catch {}
    if (credits <= 0) {
      return NextResponse.json({ error: "Credits habis" }, { status: 402 });
    }

    // Ambil form
    const formData = await req.formData();
    const file = formData.get("image");
    const type = String(formData.get("type") ?? "product");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File image wajib" }, { status: 400 });
    }

    // Buat job queued
    const { data: job, error: insertErr } = await sb
      .from("jobs")
      .insert({
        user_id: user.id,
        project_id: "placeholder-project-id", // TODO: Determine how to get actual project_id
        type: type,
        status: "queued",
        input_url: (file as File).name ?? "image",
      })
      .select("id")
      .single();

    if (insertErr || !job) {
      return NextResponse.json({ error: insertErr?.message || "Gagal membuat job" }, { status: 500 });
    }

    // Siapkan target object untuk OUTPUT (hasil akhir) di Firebase
    function extFromName(name?: string | null) {
      const m = String(name ?? "").toLowerCase().match(/\.(png|jpe?g|webp|gif|bmp|tiff|heic|heif)$/i);
      return m ? m[0] : ".png";
    }
    const contentType = (file as File).type || "image/png";
    const objectPath = `results/${user.id}/${job.id}${extFromName((file as File).name)}`;
    const { uploadUrl, publicUrl } = await getFirebaseUploadAndPublicUrls(objectPath, contentType);

    // Kirim ke n8n webhook
    const webhook = process.env.N8N_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json({ error: "N8N_WEBHOOK_URL belum di-set" }, { status: 500 });
    }
    const payload = new FormData();
    payload.append("user_id", user.id);
    payload.append("job_id", job.id);
    payload.append("image", file, (file as File).name);
    payload.append("type", type);
    // instruksi Firebase untuk n8n:
    payload.append("firebase_upload_url", uploadUrl);
    payload.append("firebase_public_url", publicUrl);
    payload.append("firebase_content_type", contentType);

    const r = await fetch(webhook, { method: "POST", body: payload });
    if (!r.ok) {
      // Tandai gagal
      await sb.from("jobs").update({ status: "error" }).eq("id", job.id);
      const t = await r.text().catch(() => "");
      return NextResponse.json({ error: `Webhook gagal: ${r.status} ${t}` }, { status: 502 });
    }

    // Debit credits dipindah ke callback (hanya jika sukses)
    // try {
    //   await sb.from("credit_ledger").insert({ user_id: user.id, delta: -1, reason: "generate" });
    // } catch {}

    return NextResponse.json({ ok: true, job_id: job.id });
}
