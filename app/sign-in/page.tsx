export const dynamic = "force-static";

import { redirect } from "next/navigation";

import GoogleButton from "@/components/GoogleButton";
import { supaServer } from "@/lib/supabase-server";

import { signInAction } from "./actions";

type SignInPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
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
          <h1 className="text-2xl font-semibold">Masuk</h1>
          <p className="text-sm text-gray-500">
            Gunakan email dan kata sandi Anda untuk mengakses dashboard UMKM KitStudio.
          </p>
        </div>
        {errorMessage && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{errorMessage}</p>
        )}
        <form action={signInAction} className="space-y-3">
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
            Masuk
          </button>
        </form>
        <GoogleButton redirectTo="/dashboard" />
      </div>
    </main>
  );
}
