import { redirect } from "next/navigation";
import { Database } from "@/lib/database.types";
import OnboardingModal from "@/components/onboarding-modal";
import DashboardClient from "./DashboardClient";
import { supaServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function saveOnboarding(formData: FormData) {
	"use server";
	const supabase = supaServer();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return { error: "Not authenticated" };

	const user_type = String(formData.get("user_type") ?? "personal");
	const main_goal = String(formData.get("main_goal") ?? "");
	const business_type = String(formData.get("business_type") ?? "");
	const info_source = String(formData.get("info_source") ?? "");

	const { error } = await supabase
		.from("profiles")
		.update({ user_type, main_goal, business_type, info_source, onboarding_completed_at: new Date().toISOString() })
		.eq("user_id", user.id); // 'user_id' is the primary key

	if (error) return { error: error.message };
}

export default async function DashboardPage() {
	const supabase = supaServer();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) redirect("/sign-in"); // Redirect to /sign-in

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("user_id", user.id) // 'user_id' is the primary key
		.maybeSingle<Database['public']['Tables']['profiles']['Row']>();

	if (profileError) {
		console.error("Error fetching profile:", profileError);
		// Depending on desired behavior, you might redirect or show a generic error
		// For now, we'll proceed with a null profile if there's an error
		// This might mean needsOnboarding will be true, which is a safe fallback
	}

	const needsOnboarding = !profile || !profile.onboarding_completed_at;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();

  // Fetch wallet data
  const { data: wallet, error: walletError } = await supabase
    .from('credits_wallet')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  // Fetch jobs this week
  const { count: jobsThisWeek, error: jobsError } = await supabase
    .from('jobs')
    .select('id', { count: 'exact' })
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgoISO);

  // Fetch credits used this week
  const { data: creditsLedger, error: ledgerError } = await supabase
    .from('credits_ledger')
    .select('change')
    .eq('user_id', user.id)
    .lt('change', 0) // Only count used credits (negative changes)
    .gte('created_at', sevenDaysAgoISO);

  const creditsUsedThisWeek = creditsLedger?.reduce((sum, entry) => sum + Math.abs(entry.change), 0) ?? 0;

  const summary = {
    wallet: wallet,
    jobs_this_week: jobsThisWeek ?? 0,
    credits_used_this_week: creditsUsedThisWeek,
    free_pack: { credits: 0, days_left: 0 }, // Placeholder for free_pack
  };

  // Fetch initial projects (first page)
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, user_id, title, cover_url, updated_at, status") // Added user_id
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(12); // Default limit for the first page

  // Fetch initial credit history
  const { data: history, error: historyError } = await supabase
    .from("credits_ledger")
    .select("id, user_id, change, reason, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20); // Default limit for history

  if (walletError || jobsError || ledgerError || projectsError || historyError) {
    console.error("Error fetching dashboard data:", walletError || jobsError || ledgerError || projectsError || historyError);
    // Handle error appropriately, e.g., return an error state or redirect
  }

	return (
		<DashboardClient
			user={user}
			profile={profile}
			needsOnboarding={needsOnboarding}
			saveOnboarding={saveOnboarding}
      initialSummary={summary}
      initialProjects={projects ?? []}
      initialHistory={history ?? []}
		/>
	);
}
