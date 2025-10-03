
"use client";
import React, { useState } from "react";

interface OnboardingModalProps {
  needsOnboarding: boolean;
  initialName: string;
  initialRole: string;
  action: (formData: FormData) => Promise<any>;
}

export default function OnboardingModal({
  needsOnboarding,
  initialName,
  initialRole,
  action,
}: OnboardingModalProps) {
  const [open, setOpen] = useState(needsOnboarding);
  const [userType, setUserType] = useState("personal");
  const [mainGoal, setMainGoal] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [infoSource, setInfoSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("user_type", userType);
    formData.append("main_goal", mainGoal);
    formData.append("business_type", businessType);
    formData.append("info_source", infoSource);
    formData.append("onboarding_completed", "true");
    formData.append("onboarding_completed_at", new Date().toISOString());
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOpen(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("onboarding_completed", "false");
    const result = await action(formData);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Kenalan dulu yuk!</h2>
        <p className="mb-6 text-gray-500 dark:text-gray-300 text-sm">Jawaban kamu membantu kami menyesuaikan rekomendasi template dan otomasi konten.</p>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Tipe pengguna</label>
          <div className="flex gap-2">
            <button type="button" className={`flex-1 py-2 rounded ${userType === 'personal' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setUserType('personal')}>Personal</button>
            <button type="button" className={`flex-1 py-2 rounded ${userType === 'team' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`} onClick={() => setUserType('team')}>Tim</button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Tujuan utama pakai UMKM Kits</label>
          <select
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white"
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
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white"
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
            value={infoSource}
            onChange={(e) => setInfoSource(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-800 dark:text-white"
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
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded"
            onClick={handleSkip}
            disabled={loading}
          >
            Lewati
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan jawaban"}
          </button>
        </div>
      </form>
    </div>
  );
}
