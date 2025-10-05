"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import GoogleButton from "@/components/GoogleButton";
import { signUpAction } from "./actions";

export default function SignUpPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;
    const agreement = formData.get("agreement");

    if (password !== confirmPassword) {
      setErrorMessage("Kata sandi tidak cocok.");
      setIsLoading(false);
      return;
    }

    if (!agreement) {
      setErrorMessage("Anda harus menyetujui syarat dan ketentuan.");
      setIsLoading(false);
      return;
    }

    const result = await signUpAction(formData);
    if (result?.error) {
      setErrorMessage(result.error);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-md space-y-6 bg-slate-800 p-8 rounded-lg shadow-soft">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Daftar</h1>
          <p className="mt-2 text-slate-400">
            Buat akun baru untuk mulai mengubah foto produk menjadi materi iklan profesional.
          </p>
        </div>
        {errorMessage && (
          <p className="rounded-md bg-rose-500/20 px-3 py-2 text-sm text-rose-400">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="sr-only">Nama lengkap</label>
            <input
              id="full_name"
              name="full_name"
              required
              placeholder="Nama lengkap"
              className="w-full rounded-md border-slate-700 bg-slate-900 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-md border-slate-700 bg-slate-900 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-md border-slate-700 bg-slate-900 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className="sr-only">Konfirmasi Password</label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              placeholder="Konfirmasi Password"
              className="w-full rounded-md border-slate-700 bg-slate-900 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="agreement"
              name="agreement"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 border-slate-700 rounded focus:ring-blue-500"
            />
            <label htmlFor="agreement" className="text-sm text-slate-400">
              Saya menyetujui <Link href="/terms" className="text-blue-500 hover:underline">Syarat & Ketentuan</Link>
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Membuat akun..." : "Buat akun"}
          </button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-slate-800 px-2 text-slate-400">atau</span>
          </div>
        </div>
        <GoogleButton redirectTo="/dashboard" />
      </div>
    </main>
  );
}
