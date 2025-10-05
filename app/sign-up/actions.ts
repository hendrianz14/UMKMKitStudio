"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";

import { supaServer } from "@/lib/supabase-server";

export async function signUpAction(fd: FormData): Promise<{ error: string } | void> {
  const full_name = (fd.get("full_name") as string) || "";
  const email = (fd.get("email") as string) || "";
  const password = (fd.get("password") as string) || "";
  const dest = (fd.get("redirect") as string) || "/sign-in";

  const sb = supaServer();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });
  if (error) {
    return { error: error.message };
  }

  // Update profiles table dengan full_name
  if (data?.user?.id) {
    await sb.from("profiles").update({ full_name }).eq("user_id", data.user.id);
  }

  redirect(dest as Route);
}
