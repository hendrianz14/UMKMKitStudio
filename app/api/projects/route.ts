import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type ProjectItem = {
  id: string;
  title: string;
  cover_url: string | null;
  updated_at: string;
  status: Database["public"]["Enums"]["project_status"];
};

export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function GET(req: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: object) => {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Action or Route Handler.
            // This error is safe to ignore if you're only reading cookies in a Server Component.
          }
        },
        remove: (name: string, options: object) => {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Action or Route Handler.
            // This error is safe to ignore if you're only reading cookies in a Server Component.
          }
        },
      },
    }
  );

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "12");
  const cursor = searchParams.get("cursor");

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

    const { data, error } = await query;
    const projects: ProjectItem[] = (data || []) as ProjectItem[]; // Ensure projects is always an array with correct type

    if (error) {
      console.error("Error fetching projects:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const nextCursor =
      projects.length > 0 && projects.length === limit
        ? projects[projects.length - 1]?.updated_at
        : null;

    return NextResponse.json({ projects, nextCursor });
  } catch (error) {
    console.error("Unhandled error in projects API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
