"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";

import { supaServer } from "@/lib/supabase-server";

export async function signInAction(fd: FormData): Promise<{ error: string } | void> {
  const email = (fd.get("email") as string) || "";
  const password = (fd.get("password") as string) || "";
  const dest = (fd.get("redirect") as string) || "/dashboard";

  const sb = supaServer();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  redirect((dest.startsWith("/") ? dest : "/dashboard") as Route);
}
