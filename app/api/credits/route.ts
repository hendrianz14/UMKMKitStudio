import { NextResponse } from "next/server";
import { supaServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const sb = supaServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let balance = 0;

  // Coba view credit_balance dulu
  try {
    const { data: bal, error } = await sb
      .from("credit_balance")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!error && bal) {
      balance = bal.balance ?? 0;
      return NextResponse.json({ balance });
    }
  } catch {}

  // Fallback: jumlahkan ledger
  try {
    const { data: rows } = await sb
      .from("credit_ledger")
      .select("delta")
      .eq("user_id", user.id);

    if (Array.isArray(rows)) {
      balance = rows.reduce((acc, r) => acc + (r?.delta ?? 0), 0);
    }
  } catch {}

  return NextResponse.json({ balance });
}
