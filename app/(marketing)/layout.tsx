import Nav from "@/components/marketing/Nav";
import { AuthProvider } from "@/components/AuthProvider";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import "@/app/marketing.css"; // Import marketing-specific CSS

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: object) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Action or Route Handler.
            // This error is safe to ignore if you're only reading cookies in a Server Component.
          }
        },
        remove(name: string, options: object) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Action or Route Handler.
            // This error is safe to ignore if you're only reading cookies in a Server Component.
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <AuthProvider initialSession={session}>
      <Nav />
      <main className="landing-container pt-16 pb-12">{children}</main>
    </AuthProvider>
  );
}
