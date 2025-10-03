"use client";

import { type FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ProfileRow = {
  id: string;
  user_id: string;
  full_name: string | null;
  business_name: string | null;
  role: string | null;
  business_goal: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
};

type ProjectRow = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string | null;
};

type CreditTransactionRow = {
  id: string;
  amount: number;
  balance_after: number | null;
  description: string | null;
  created_at: string;
  direction: "in" | "out" | string;
};

type AIJobRow = {
  id: string;
  type: string;
  status: string;
  created_at: string;
  input_summary: string | null;
  output_summary: string | null;
};

type DashboardClientProps = {
  profile: ProfileRow | null;
  projects: ProjectRow[];
  creditTransactions: CreditTransactionRow[];
  jobs: AIJobRow[];
  currentBalance: number;
  needsOnboarding: boolean;
};

type OnboardingPayload = {
  business_name: string;
  role: string;
  business_goal: string;
};

const statusBadgeClasses: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-700",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function DashboardClient({
  profile,
  projects,
  creditTransactions,
  jobs,
  currentBalance,
  needsOnboarding,
}: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(needsOnboarding);
  const [payload, setPayload] = useState<OnboardingPayload>({
    business_name: profile?.business_name ?? "",
    role: profile?.role ?? "",
    business_goal: profile?.business_goal ?? "",
  });

  useEffect(() => {
    setShowOnboarding(needsOnboarding);
  }, [needsOnboarding]);

  const totalProjects = projects.length;
  const activeJobs = useMemo(() => jobs.filter((job) => job.status !== "completed"), [jobs]);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const body = JSON.stringify(payload);
    startTransition(async () => {
      const response = await fetch("/api/profile/onboarding/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        const { error: message } = await response.json().catch(() => ({ error: "Terjadi kesalahan" }));
        setError(message ?? "Terjadi kesalahan");
        return;
      }

      setShowOnboarding(false);
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-slate-500">Selamat datang kembali</p>
            <h1 className="text-xl font-semibold text-slate-900">
              {profile?.full_name || "UMKM Kits Studio"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{profile?.business_name || "Tanpa nama usaha"}</span>
            <button
              onClick={handleSignOut}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Saldo Kredit</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(currentBalance)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Proyek</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalProjects}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pekerjaan AI Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{activeJobs.length}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Proyek Terbaru</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {projects.length === 0 && (
                <p className="px-5 py-6 text-sm text-slate-500">Belum ada proyek. Mulai dengan membuat proyek pertama Anda.</p>
              )}
              {projects.map((project) => {
                const badgeClass = statusBadgeClasses[project.status] ?? "bg-slate-100 text-slate-700";
                return (
                  <div key={project.id} className="flex items-center justify-between px-5 py-4 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{project.name}</p>
                      <p className="text-xs text-slate-500">Diperbarui {formatDate(project.updated_at ?? project.created_at)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{project.status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Riwayat Kredit</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {creditTransactions.length === 0 && (
                <p className="px-5 py-6 text-sm text-slate-500">
                  Belum ada transaksi kredit. Transaksi akan muncul setelah Anda menggunakan layanan kami.
                </p>
              )}
              {creditTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-5 py-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{tx.description || "Transaksi"}</p>
                    <p className="text-xs text-slate-500">{formatDate(tx.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${tx.direction === "out" ? "text-rose-500" : "text-emerald-600"}`}
                    >
                      {tx.direction === "out" ? "-" : "+"}
                      {formatCurrency(Math.abs(tx.amount))}
                    </p>
                    {typeof tx.balance_after === "number" && (
                      <p className="text-xs text-slate-400">Saldo: {formatCurrency(tx.balance_after)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Aktivitas AI</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {jobs.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-500">Belum ada pekerjaan AI yang diproses.</p>
            )}
            {jobs.map((job) => {
              const badgeClass = statusBadgeClasses[job.status] ?? "bg-slate-100 text-slate-700";
              return (
                <div key={job.id} className="flex flex-col gap-1 px-5 py-4 text-sm md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{job.type}</p>
                    <p className="text-xs text-slate-500">{formatDate(job.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3 md:justify-end">
                    {job.input_summary && <p className="text-xs text-slate-500">{job.input_summary}</p>}
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{job.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Lengkapi Profil Bisnis Anda</h2>
            <p className="mt-1 text-sm text-slate-500">
              Kami menggunakan informasi ini untuk menyesuaikan rekomendasi konten dan layanan UMKM Kits.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="business_name">
                  Nama usaha
                </label>
                <input
                  id="business_name"
                  value={payload.business_name}
                  onChange={(event) => setPayload((prev) => ({ ...prev, business_name: event.target.value }))}
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
                  placeholder="Contoh: Kopi Nusantara"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="role">
                  Peran Anda
                </label>
                <input
                  id="role"
                  value={payload.role}
                  onChange={(event) => setPayload((prev) => ({ ...prev, role: event.target.value }))}
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
                  placeholder="Pemilik / Manajer / dll"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700" htmlFor="business_goal">
                  Fokus utama saat ini
                </label>
                <textarea
                  id="business_goal"
                  value={payload.business_goal}
                  onChange={(event) => setPayload((prev) => ({ ...prev, business_goal: event.target.value }))}
                  required
                  className="h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
                  placeholder="Ceritakan tujuan bisnis Anda dalam beberapa kalimat"
                />
              </div>

              {error && <p className="text-sm text-rose-500">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOnboarding(false)}
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Nanti saja
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Menyimpan…" : "Simpan dan lanjutkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
