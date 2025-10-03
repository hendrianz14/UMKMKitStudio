"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";

import { supaServer } from "@/lib/supabase-server";

export async function signUpAction(fd: FormData) {
  const full_name = (fd.get("full_name") as string) || "";
  const email = (fd.get("email") as string) || "";
  const password = (fd.get("password") as string) || "";
  const dest = (fd.get("redirect") as string) || "/dashboard";

  const sb = supaServer();
  const { error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });
  if (error) {
    redirect((`/sign-up?error=${encodeURIComponent(error.message)}`) as Route);
  }

  redirect(dest as Route);
}
