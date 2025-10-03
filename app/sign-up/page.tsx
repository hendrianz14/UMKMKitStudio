export const dynamic = "force-static";

import { redirect } from "next/navigation";

import { supaServer } from "@/lib/supabase-server";

import { signUpAction } from "./actions";

type SignUpPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  let isAuthenticated = false;
  try {
    const result = await supaServer().auth.getUser();
    if (!result.error) {
      isAuthenticated = Boolean(result.data.user);
    }
  } catch (error) {
    console.error("Failed to retrieve session", error);
  }
  if (isAuthenticated) redirect("/dashboard");

  const errorMessage = (() => {
    const value = searchParams?.error;
    if (!value) return null;
    if (Array.isArray(value)) return value[0];
    return value;
  })();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <div className="space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Daftar</h1>
          <p className="text-sm text-gray-500">
            Buat akun baru untuk mengakses seluruh fitur UMKM KitStudio.
          </p>
        </div>
        {errorMessage && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{errorMessage}</p>
        )}
        <form action={signUpAction} className="space-y-3">
          <input
            name="full_name"
            required
            placeholder="Nama lengkap"
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
          />
          <button className="w-full rounded bg-black py-2 text-sm font-medium text-white transition hover:bg-gray-900">
            Buat akun
          </button>
        </form>
      </div>
    </main>
  );
}
