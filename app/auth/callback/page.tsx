"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supaBrowser } from "@/lib/supabase-browser";

export default function OAuthCallback() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Menyambungkan akun…</div>}>
      <OAuthCallbackInner />
    </Suspense>
  );
}

function OAuthCallbackInner() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        await supaBrowser().auth.exchangeCodeForSession(window.location.href);
      } catch (error) {
        console.error("OAuth exchange failed", error);
      }
      const redirectTo = sp.get("redirect") || "/dashboard";
      router.replace(redirectTo);
      router.refresh();
    })();
  }, [router, sp]);

  return <div className="p-6 text-sm text-gray-500">Menyambungkan akun…</div>;
}
