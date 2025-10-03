import { NextResponse } from "next/server";

import { supaServer } from "@/lib/supabase-server";

type Payload = {
  business_name: string;
  role: string;
  business_goal: string;
};

export async function POST(request: Request) {
  const sb = supaServer();
  const {
    data: { user },
    error: userError,
  } = await sb.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch (error) {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }

  if (!body.business_name || !body.role || !body.business_goal) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  const { error } = await sb
    .from("profiles")
    .update({
      business_name: body.business_name,
      role: body.role,
      business_goal: body.business_goal,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
