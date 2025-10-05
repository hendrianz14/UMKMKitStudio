import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log("Debug Env API - Supabase URL:", supabaseUrl ? "Set" : "Not Set", supabaseUrl);
  console.log("Debug Env API - Supabase Anon Key:", supabaseAnonKey ? "Set" : "Not Set", supabaseAnonKey);

  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
    message: "Environment variables check"
  });
}
