export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { supaServer } from "@/lib/supabase-server";

export async function POST() {
  await supaServer().auth.signOut();
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/sign-in`, { status: 303 });
}
