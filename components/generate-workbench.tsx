"use client";
// Status badge helper
const STATUS_BADGE: Record<string, {label: string; className: string}> = {
  queued:     { label: "Queued",     className: "inline-block rounded-full bg-yellow-100 text-yellow-800 text-xs px-2 py-1" },
  processing: { label: "Processing", className: "inline-block rounded-full bg-blue-100 text-blue-800 text-xs px-2 py-1" },
  done:       { label: "Done",       className: "inline-block rounded-full bg-green-100 text-green-800 text-xs px-2 py-1" },
  error:      { label: "Error",      className: "inline-block rounded-full bg-red-100 text-red-800 text-xs px-2 py-1" },
};

import { useEffect, useMemo, useRef, useState } from "react";
// ...existing code...
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CATEGORIES = [
  { id: "food", label: "Food Photography" },
  { id: "product", label: "Product Photography" },
  { id: "model", label: "Foto Produk dengan Model" },
] as const;
type CatId = typeof CATEGORIES[number]["id"];
type JobItem = { id: string; status: string | null; output_url?: string | null };

export default function GenerateWorkbench() {
  const [cat, setCat] = useState<CatId>("product");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<JobItem | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const pollRef = useRef<number | null>(null);

  async function loadCredits() {
    try {
      const r = await fetch("/api/credits", { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        setCredits(typeof j.balance === "number" ? j.balance : 0);
      }
    } catch {}
  }
  useEffect(() => { loadCredits(); }, []);

  // generate preview
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // polling status job
  useEffect(() => {
    if (!jobId) return;
    let stopped = false;
    const tick = async () => {
      try {
        const r = await fetch(`/api/results/${jobId}`, { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          setJob(j.item);
          const s = j.item?.status;
          if (s === "done") { await loadCredits(); return; }
          if (s === "error") { return; }
        }
      } catch {}
      if (!stopped) pollRef.current = window.setTimeout(tick, 2500);
    };
    tick();
    return () => { stopped = true; if (pollRef.current) window.clearTimeout(pollRef.current); };
  }, [jobId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!file) { setMsg("Pilih gambar terlebih dahulu."); return; }
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("type", cat);
      const r = await fetch("/api/generate", { method: "POST", body: form });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Gagal memulai job");
      setJobId(j.job_id as string);
      setJob(null);
      setMsg(`Job #${j.job_id} dikirim (${cat}). Hasil akan muncul di panel kanan.`);
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const canDownload = useMemo(() => job?.status === "done" && job?.output_url, [job]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
      {/* Sidebar Kategori */}
      <aside className="h-max">
        <div className="rounded-lg border p-3 mb-3">
          <div className="text-xs text-muted-foreground">Credits</div>
          <div className="text-lg font-semibold">{credits ?? "…"}</div>
          <button
            type="button"
            onClick={loadCredits}
            className="mt-2 text-xs underline text-muted-foreground"
          >
            Refresh
          </button>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Jenis Generate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {CATEGORIES.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setCat(x.id)}
                className={`w-full text-left rounded-lg px-3 py-2 text-sm border transition
                  ${cat === x.id ? "bg-muted border-foreground/30" : "hover:bg-muted/60 border-transparent"}`}
              >
                {x.label}
              </button>
            ))}
          </CardContent>
        </Card>
      </aside>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload + Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upload Gambar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Dropzone sederhana */}
              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center hover:bg-muted/40"
              >
                <div className="text-sm font-medium">Klik untuk memilih file</div>
                <div className="text-xs text-muted-foreground">Format gambar (JPG, PNG, WEBP)</div>
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />

              {preview ? (
                <div className="rounded-lg overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-auto object-contain" />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Belum ada preview.</p>
              )}

              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground">Kategori: <span className="font-medium">{CATEGORIES.find(c=>c.id===cat)?.label}</span></div>
                <Separator orientation="vertical" className="h-5" />
                {file ? <div className="text-xs">{file.name}</div> : null}
              </div>

              <Button type="submit" disabled={submitting || !file}>
                {submitting ? "Mengirim..." : "Kirim ke Pipeline"}
              </Button>
              {msg ? <p className="text-sm">{msg}</p> : null}
              {jobId ? <p className="text-xs text-muted-foreground">Job ID: {jobId}</p> : null}
            </form>
          </CardContent>
        </Card>

        {/* Panel Hasil */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hasil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!jobId && <p className="text-sm text-muted-foreground">Kirim gambar dulu. Hasil akan tampil di sini.</p>}

            {jobId && (
              <>

                <div className="text-sm flex items-center gap-2">
                  <span>Status:</span>
                  <span className={STATUS_BADGE[(job?.status ?? "queued")]?.className ?? STATUS_BADGE["processing"].className}>
                    {STATUS_BADGE[(job?.status ?? "queued")]?.label ?? "Processing"}
                  </span>
                </div>

                {job?.status === "error" && (job as any)?.meta?.error ? (
                  <p className="text-sm text-red-600">{(job as any).meta.error}</p>
                ) : null}

                {job?.output_url ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={job.output_url} alt="Output" className="w-full h-auto rounded-lg border" />
                    <div className="flex gap-2">
                      <a
                        href={job.output_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                      >
                        <Button variant="default">Buka</Button>
                      </a>
                      <a href={job.output_url} download className="inline-flex">
                        <Button variant="outline">Download</Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Menunggu hasil dari pipeline…</div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
