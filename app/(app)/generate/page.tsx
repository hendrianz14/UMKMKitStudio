import { redirect } from "next/navigation";
import { supaServer } from "@/lib/supabase-server";
import GenerateWorkbench from "@/components/generate-workbench";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GeneratePage() {
  const sb = supaServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/(auth)/login");
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Generate</h1>
      <GenerateWorkbench />
    </section>
  );
}
