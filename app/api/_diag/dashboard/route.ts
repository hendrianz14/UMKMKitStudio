import { NextResponse } from "next/server";

import { supaServer } from "@/lib/supabase-server";

type ProfileRow = {
  id: string;
  user_id: string;
  full_name: string | null;
  business_name: string | null;
  role: string | null;
  business_goal: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
};

export async function GET() {
  const sb = supaServer();
  const {
    data: { user },
    error: userError,
  } = await sb.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ user: false, profile: null }, { status: 401 });
  }

  const { data: profile, error } = await sb
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<ProfileRow>();

  if (error) {
    return NextResponse.json({ user: true, profile: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: true, profile });
}
