import { NextResponse } from "next/server";
import { waitlistSchema } from "@/lib/validators/waitlist";
import { supaServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = waitlistSchema.parse(body);

    const supa = supaServer();
    const { data, error } = await supa.from('emails_waitlist').insert([{ email: parsed.email, created_at: new Date().toISOString() }]);
    if (error) {
      console.error('Supabase insert error', error);
      return NextResponse.json({ error: 'db_error' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('waitlist error', err);
    return NextResponse.json({ error: err.message || 'invalid' }, { status: 400 });
  }
}
