"use client";

import { User } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import OnboardingModal from "@/components/onboarding-modal";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Wallet = Database['public']['Tables']['credits_wallet']['Row'];
type LedgerEntry = Database['public']['Tables']['credits_ledger']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

interface DashboardSummary {
  wallet: Wallet;
  jobs_this_week: number;
  credits_used_this_week: number;
  free_pack: { credits: number; days_left: number };
}

interface OnboardingModalProps {
  needsOnboarding: boolean;
  initialName: string;
  initialRole: string;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
  onClose: () => void;
}

interface DashboardClientProps {
  user: User;
  profile: Profile | null;
  needsOnboarding: boolean;
  saveOnboarding: (formData: FormData) => Promise<{ error: string } | undefined>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardClient({
  user,
  profile,
  needsOnboarding,
  saveOnboarding,
}: DashboardClientProps) {
  const { data: summary, error: summaryError } = useSWR<DashboardSummary>("/api/dashboard/summary", fetcher);
  const { data: projectsData, error: projectsError } = useSWR<{ projects: Project[]; nextCursor: string | null }>("/api/projects", fetcher);
  const { data: historyData, error: historyError } = useSWR<{ history: LedgerEntry[] }>("/api/credits/history", fetcher);

  const [isModalOpen, setIsModalOpen] = useState(needsOnboarding);

  useEffect(() => {
    setIsModalOpen(needsOnboarding);
  }, [needsOnboarding]);

  if (summaryError || projectsError || historyError) {
    console.error("Dashboard data fetch error:", summaryError || projectsError || historyError);
    return <div className="text-red-500">Error loading dashboard data.</div>;
  }

  const projects = projectsData?.projects || [];
  const history = historyData?.history || [];

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard AI Anda</h1>
        {/* Placeholder for i18n and Feedback buttons */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-md bg-slate-700 text-white text-sm">ID</button>
          <button className="px-3 py-1 rounded-md bg-slate-800 text-slate-400 text-sm">EN</button>
          <button className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm">Feedback</button>
          {/* Avatar will be handled by Nav component */}
        </div>
      </div>
      <p className="mt-2 text-slate-400">
        Pantau penggunaan kredit, kelola project dan pekerjaan AI anda.
      </p>

      {/* Statistic Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kredit aktif */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-soft border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-300">Kredit aktif</h3>
          {summary ? (
            <>
              <p className="text-5xl font-bold text-white mt-2">{summary.wallet.balance}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{summary.wallet.plan}</span>
                <span className="text-sm text-slate-400">Kedaluarsa pada {new Date(summary.wallet.expires_at || "").toLocaleDateString()}</span>
              </div>
              {summary.wallet.balance <= 0 && (
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Isi Ulang</button>
              )}
            </>
          ) : (
            <div className="h-32 bg-slate-700 animate-pulse rounded-md" />
          )}
        </div>

        {/* Pekerjaan minggu ini */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-soft border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-300">Pekerjaan minggu ini :</h3>
          {summary ? (
            <>
              <p className="text-5xl font-bold text-white mt-2">{summary.jobs_this_week}</p>
              <p className="mt-2 text-slate-400 text-sm">Ringkasan otomatis dari pekerjaan AI anda.</p>
            </>
          ) : (
            <div className="h-32 bg-slate-700 animate-pulse rounded-md" />
          )}
        </div>

        {/* Total kredit terpakai (minggu ini) */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-soft border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-300">Total kredit terpakai :</h3>
          {summary ? (
            <>
              <p className="text-5xl font-bold text-white mt-2">{summary.credits_used_this_week}</p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">TOPUP</button>
            </>
          ) : (
            <div className="h-32 bg-slate-700 animate-pulse rounded-md" />
          )}
        </div>
      </div>

      {/* Project anda */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Project anda</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project: Project) => (
              <div key={project.id} className="bg-slate-800 p-4 rounded-lg shadow-soft border border-slate-700">
                <img src={project.cover_url || "/placeholder.png"} alt={project.title || "Project cover"} className="w-full h-48 object-cover rounded-md" />
                <h4 className="text-lg font-semibold text-white mt-3">{project.title}</h4>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Bagikan</button>
                  <button className="flex-1 bg-slate-700 text-white py-2 rounded-md hover:bg-slate-600">Buka Editor</button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-400">No projects found.</div>
          )}
        </div>
        {projectsData?.nextCursor && (
          <div className="mt-6 text-center">
            <button className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600">Lihat lebih banyak</button>
          </div>
        )}
      </div>

      {/* Riwayat Credits */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Riwayat Credits</h2>
        <div className="mt-6 bg-slate-800 p-6 rounded-lg shadow-soft border border-slate-700">
          {history.length > 0 ? (
            history.map((entry: LedgerEntry) => (
              <div key={entry.id} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <div>
                  <p className="text-white">{entry.reason}</p>
                  <p className="text-sm text-slate-400">{new Date(entry.created_at).toLocaleString()}</p>
                </div>
                <span className={`font-semibold ${entry.change < 0 ? "text-red-500" : "text-green-500"}`}>
                  {entry.change > 0 ? "+" : ""}{entry.change}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-400">No credit history found.</div>
          )}
          <div className="mt-4 text-center">
            <Link href="/credits" className="text-blue-500 hover:underline">Lihat semua</Link>
          </div>
        </div>
      </div>

      {/* Alat */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Alat</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <button className="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700">Caption AI</button>
          <button className="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700">Gambar AI</button>
          <button className="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700">Editor</button>
          <button className="bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700">Galeri</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} UMKM KitStudio. Seluruh hak cipta dilindungi.</p>
        <p className="mt-2">Dapatkan tips konten <Link href="/subscribe" className="text-blue-500 hover:underline">Langganan</Link></p>
      </footer>

      <OnboardingModal
        needsOnboarding={isModalOpen}
        initialName={profile?.name ?? ""}
        initialRole={profile?.user_type ?? ""}
        action={saveOnboarding}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
