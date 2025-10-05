"use client";

import { supaBrowser } from "@/lib/supabase-browser";

export default function GoogleButton({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const sb = supaBrowser();
  return (
    <button
      type="button"
      className="w-full rounded-md border border-slate-700 bg-slate-900 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 flex items-center justify-center gap-2"
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
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0003 4.75C14.0253 4.75 15.8003 5.4375 17.1378 6.725L20.0503 3.8125C17.9503 1.775 15.1128 0.75 12.0003 0.75C7.86283 0.75 4.23783 3.1125 2.53783 6.5375L6.05033 9.2375C6.88783 7.0875 9.21283 4.75 12.0003 4.75Z" fill="#EA4335"/>
        <path d="M21.5503 12.2125C21.5503 11.4875 21.4878 10.775 21.3753 10.0875H12.0003V13.9125H17.4378C17.1878 15.2125 16.4503 16.275 15.4003 16.9875L18.9878 19.7125C21.0128 17.8125 22.2503 15.0125 22.2503 12.2125H21.5503Z" fill="#4285F4"/>
        <path d="M6.05033 9.2375L2.53783 6.5375C1.83783 8.2125 1.45033 10.1125 1.45033 12.0001C1.45033 13.8876 1.83783 15.7876 2.53783 17.4626L6.05033 14.7626C5.80033 14.0626 5.66283 13.3376 5.66283 12.6001C5.66283 11.8626 5.80033 11.1376 6.05033 10.4376V9.2375Z" fill="#FBBC05"/>
        <path d="M12.0003 22.2501C15.1128 22.2501 17.9503 21.2251 20.0503 19.1876L17.1378 16.2751C15.8003 17.5626 14.0253 18.2501 12.0003 18.2501C9.21283 18.2501 6.88783 15.9126 6.05033 13.7626L2.53783 16.4626C4.23783 19.8876 7.86283 22.2501 12.0003 22.2501Z" fill="#34A853"/>
      </svg>
      Masuk dengan Google
    </button>
  );
}
