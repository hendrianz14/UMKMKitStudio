"use client";
import { useState } from "react";

export default function GeneratePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setMsg("Pilih gambar terlebih dahulu."); return; }
    setLoading(true); setMsg(null);
    try {
      const form = new FormData();
      form.append("image", file);
      const r = await fetch("/api/generate", { method: "POST", body: form });
      const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Gagal memulai job");
  setMsg(j.job_id ? `Job #${j.job_id} dikirim. Buka halaman History untuk melihat status/hasil.` : "Job dikirim. Cek History.");
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Generate</h1>
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border p-4">
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
        <button disabled={loading} className="rounded-xl bg-black text-white px-4 py-2">
          {loading ? "Mengirim..." : "Kirim ke Pipeline"}
        </button>
        {msg ? <p className="text-sm text-gray-700">{msg}</p> : null}
      </form>
    </section>
  );
}
