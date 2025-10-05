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
		.eq("id", user.id); // 'id' is the primary key, which is also the user_id

	if (error) return { error: error.message };
}

export default async function DashboardPage() {
	const supabase = supaServer();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) redirect("/sign-in"); // Redirect to /sign-in

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id) // 'id' is the primary key, which is also the user_id
		.maybeSingle<Database['public']['Tables']['profiles']['Row']>();

	if (profileError) {
		console.error("Error fetching profile:", profileError);
		// Depending on desired behavior, you might redirect or show a generic error
		// For now, we'll proceed with a null profile if there's an error
		// This might mean needsOnboarding will be true, which is a safe fallback
	}

	const needsOnboarding = !profile || !profile.onboarding_completed_at;

	return (
		<DashboardClient
			user={user}
			profile={profile}
			needsOnboarding={needsOnboarding}
			saveOnboarding={saveOnboarding}
		/>
	);
}
