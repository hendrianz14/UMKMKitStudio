import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types"; // Import your Database type

export function supaServer(): SupabaseClient<Database> {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("Supabase URL in supaServer:", supabaseUrl ? "Set" : "Not Set");
  console.log("Supabase Anon Key in supaServer:", supabaseAnonKey ? "Set" : "Not Set");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Key are required for supaServer. Check your .env.local file."
    );
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: object) => {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Action or Route Handler.
            // This error is safe to ignore if you're only reading cookies in a Server Component.
          }
        },
        remove: (name: string, options: object) => {
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
}
