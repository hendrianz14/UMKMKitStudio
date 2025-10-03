"use client";

import { type FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ProfileRow = {
  id: string;
  user_id: string;
  full_name: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
  user_type?: string | null;
  main_goal?: string | null;
  business_type?: string | null;
  info_source?: string | null;
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
  const [payload, setPayload] = useState({
    user_type: profile?.user_type ?? "personal",
    main_goal: profile?.main_goal ?? "",
    business_type: profile?.business_type ?? "",
    info_source: profile?.info_source ?? ""
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
              {profile?.full_name || "UMKM KitStudio"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Info usaha dihapus, gunakan info lain jika perlu */}
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
        {/* ...section lain tetap, hapus semua penggunaan field lama di UI... */}
      </main>

      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <form
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg"
            onSubmit={e => {
              e.preventDefault();
              setError(null);
              startTransition(async () => {
                const formData = new FormData();
                formData.append("user_type", payload.user_type);
                formData.append("main_goal", payload.main_goal);
                formData.append("business_type", payload.business_type);
                formData.append("info_source", payload.info_source);
                formData.append("onboarding_completed", "true");
                formData.append("onboarding_completed_at", new Date().toISOString());
                const response = await fetch("/api/profile/onboarding/save", {
                  method: "POST",
                  body: formData,
                });
                if (!response.ok) {
                  const { error: message } = await response.json().catch(() => ({ error: "Terjadi kesalahan" }));
                  setError(message ?? "Terjadi kesalahan");
                  return;
                }
                setShowOnboarding(false);
                router.refresh();
              });
            }}
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Kenalan dulu yuk!</h2>
            <p className="mb-6 text-gray-500 text-sm">Jawaban kamu membantu kami menyesuaikan rekomendasi template dan otomasi konten.</p>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Tipe pengguna</label>
              <div className="flex gap-2">
                <button type="button" className={`flex-1 py-2 rounded ${payload.user_type === 'personal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setPayload(prev => ({ ...prev, user_type: 'personal' }))}>Personal</button>
                <button type="button" className={`flex-1 py-2 rounded ${payload.user_type === 'team' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setPayload(prev => ({ ...prev, user_type: 'team' }))}>Tim</button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Tujuan utama pakai UMKM Kits</label>
              <select
                value={payload.main_goal}
                onChange={e => setPayload(prev => ({ ...prev, main_goal: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="" disabled>Pilih tujuan utama</option>
                <option value="promosi">Promosi</option>
                <option value="otomasi">Otomasi Konten</option>
                <option value="manajemen">Manajemen Bisnis</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Jenis usaha</label>
              <select
                value={payload.business_type}
                onChange={e => setPayload(prev => ({ ...prev, business_type: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="" disabled>Pilih jenis usaha</option>
                <option value="kuliner">Kuliner</option>
                <option value="fashion">Fashion</option>
                <option value="jasa">Jasa</option>
                <option value="kerajinan">Kerajinan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Dari mana tahu UMKM Kits Studio?</label>
              <select
                value={payload.info_source}
                onChange={e => setPayload(prev => ({ ...prev, info_source: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="" disabled>Pilih sumber</option>
                <option value="media_sosial">Media Sosial</option>
                <option value="teman">Teman</option>
                <option value="event">Event/Pameran</option>
                <option value="internet">Internet</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowOnboarding(false)}
                className="rounded-md border px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Lewati
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Menyimpan…" : "Simpan jawaban"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
