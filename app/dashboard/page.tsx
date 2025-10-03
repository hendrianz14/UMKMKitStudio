export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";

import DashboardClient from "./DashboardClient";
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

type ProjectRow = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string | null;
};

type CreditTransactionRow = {
  id: string;
  amount: number;
  balance_after: number | null;
  description: string | null;
  created_at: string;
  direction: "in" | "out" | string;
};

type AIJobRow = {
  id: string;
  type: string;
  status: string;
  created_at: string;
  input_summary: string | null;
  output_summary: string | null;
};

export default async function DashboardPage() {
  const sb = supaServer();
  let userId: string | null = null;
  try {
    const result = await sb.auth.getUser();
    if (!result.error) {
      userId = result.data.user?.id ?? null;
    }
  } catch (error) {
    console.error("Failed to retrieve dashboard session", error);
  }

  if (!userId) redirect("/sign-in");

  const [profileRes, projectsRes, creditsRes, jobsRes] = await Promise.all([
    sb.from("profiles").select("*").eq("user_id", userId).maybeSingle<ProfileRow>(),
    sb
      .from("projects")
      .select("id,name,status,created_at,updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(6),
    sb
      .from("credit_transactions")
      .select("id,amount,balance_after,description,created_at,direction")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6),
    sb
      .from("ai_jobs")
      .select("id,type,status,created_at,input_summary,output_summary")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  if (profileRes.error) {
    console.error("Failed to load profile", profileRes.error);
  }
  if (projectsRes.error) {
    console.error("Failed to load projects", projectsRes.error);
  }
  if (creditsRes.error) {
    console.error("Failed to load credits", creditsRes.error);
  }
  if (jobsRes.error) {
    console.error("Failed to load jobs", jobsRes.error);
  }

  const profile = profileRes.data ?? null;
  const projects = projectsRes.data ?? [];
  const creditTransactions = creditsRes.data ?? [];
  const jobs = jobsRes.data ?? [];

  const currentBalance = creditTransactions.length
    ? creditTransactions[0].balance_after ??
      creditTransactions.reduce((acc, tx) => acc + tx.amount * (tx.direction === "out" ? -1 : 1), 0)
    : 0;

  return (
    <DashboardClient
      profile={profile}
      projects={projects}
      creditTransactions={creditTransactions}
      jobs={jobs}
      currentBalance={currentBalance}
      needsOnboarding={!profile?.onboarding_completed_at}
    />
  );
}
