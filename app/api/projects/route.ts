import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "12");
  const cursor = searchParams.get("cursor");

  const supabase = createServerClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let query = supabase
      .from("projects")
      .select("id, title, cover_url, updated_at, status")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (cursor) {
      // For cursor-based pagination, we need to fetch items "after" the cursor
      // Assuming cursor is the 'updated_at' timestamp of the last item from the previous page
      query = query.lt("updated_at", cursor);
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const nextCursor = projects && projects.length === limit ? projects[projects.length - 1]?.updated_at : null;

    return NextResponse.json({ projects, nextCursor });
  } catch (error) {
    console.error("Unhandled error in projects API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
