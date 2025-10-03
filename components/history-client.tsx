"use client";
import { useEffect, useState } from "react";

type Row = { id: string; created_at: string; status: string | null; output_url?: string | null };

export default function HistoryClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        const r = await fetch("/api/results", { cache: "no-store" });
        if (r.ok) {
          const j = await r.json();
          if (!stop && Array.isArray(j.items)) setRows(j.items);
        }
      } catch {}
      if (!stop) setTimeout(tick, 3000);
    };
    const id = setTimeout(tick, 3000);
    return () => { stop = true; clearTimeout(id); };
  }, []);

  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.id} className="rounded-xl border p-3">
          <div className="text-sm">#{r.id} — {r.status ?? "unknown"}</div>
          {r.output_url ? <a className="text-blue-600 underline" href={r.output_url} target="_blank">Lihat hasil</a> : null}
          <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</div>
        </li>
      ))}
    </ul>
  );
}
