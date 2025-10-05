import { NextResponse } from "next/server";
import { supaServer } from "@/lib/supabase-server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const sb = supaServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await sb
    .from("results")
    .select("id, user_id, status, output_url, created_at, meta")
    .eq("id", params.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (data.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Sertakan meta.error di response jika ada
  const errorMsg = data?.meta?.error ?? null;
  return NextResponse.json({ item: { ...data, error: errorMsg } });
}
