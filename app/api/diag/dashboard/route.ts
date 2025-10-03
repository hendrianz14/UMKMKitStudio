import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supaServer } from "@/lib/supabase-server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    const h = headers();
    if (h.get("x-diag-key") !== process.env.DIAG_KEY) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }
  }
  const sb = supaServer();
  const { data: { user }, error: userError } = await sb.auth.getUser();
    if (userError || !user) {
    return NextResponse.json({ user: false, profile: null }, { status: 401 });
  }

  const { data: profile, error } = await sb
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)   // ⬅️ WAJIB user_id
    .maybeSingle();

  if (error) {
    return NextResponse.json({ user: true, profile: null, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ user: true, profile });
}
