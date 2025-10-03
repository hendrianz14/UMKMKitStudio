"use client";

import { supaBrowser } from "@/lib/supabase-browser";

export default function GoogleButton({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const sb = supaBrowser();
  return (
    <button
      type="button"
      className="w-full rounded border border-gray-200 bg-white py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
      onClick={() =>
        sb.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect=${encodeURIComponent(
              redirectTo
            )}`,
          },
        })
      }
    >
      Masuk dengan Google
    </button>
  );
}
