"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import GoogleButton from "@/components/GoogleButton";
import { signInAction } from "./actions";

export default function SignInPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await signInAction(formData);
    if (result?.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-md space-y-6 bg-slate-800 p-8 rounded-lg shadow-soft">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Masuk</h1>
          <p className="mt-2 text-slate-400">
            Gunakan email dan kata sandi Anda untuk mengakses dashboard UMKM KitStudio.
          </p>
        </div>
        {errorMessage && (
          <p className="rounded-md bg-rose-500/20 px-3 py-2 text-sm text-rose-400">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="text-right">
            <Link href="/forgot-password" passHref>
              <span className="text-sm text-blue-500 hover:underline">Lupa kata sandi?</span>
            </Link>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Masuk
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
