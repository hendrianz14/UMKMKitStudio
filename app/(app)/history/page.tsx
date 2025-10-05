import { supaServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import HistoryClient from "@/components/history-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HistoryPage() {
  const sb = supaServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/(auth)/login");

  const { data: rows, error } = await sb
    .from("jobs")
    .select("id, created_at, status, output_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">History</h1>
      {error ? <p className="text-sm text-red-600">Belum ada tabel results. Jalankan SQL skema.</p> : null}
      <HistoryClient initial={rows ?? []} />
    </section>
  );
}
