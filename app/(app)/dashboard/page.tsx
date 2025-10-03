import { redirect } from "next/navigation";
import { supaServer } from "@/lib/supabase-server";
import OnboardingModal from "@/components/onboarding-modal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function saveOnboarding(formData: FormData) {
	"use server";
	const sb = supaServer();
	const { data: { user } } = await sb.auth.getUser();
	if (!user) return { error: "Not authenticated" };

	const user_type = String(formData.get("user_type") ?? "personal");
	const main_goal = String(formData.get("main_goal") ?? "");
	const business_type = String(formData.get("business_type") ?? "");
	const info_source = String(formData.get("info_source") ?? "");

	const { error } = await sb
		.from("profiles")
		.update({ user_type, main_goal, business_type, info_source, onboarding_completed_at: new Date().toISOString() })
		.eq("user_id", user.id);

	if (error) return { error: error.message };
}

export default async function DashboardPage() {
	const sb = supaServer();
	const { data: { user } } = await sb.auth.getUser();
	if (!user) redirect("/(auth)/login");

	const { data: profile } = await sb
		.from("profiles")
		.select("*")
		.eq("user_id", user.id)
		.maybeSingle();

	const needsOnboarding = !profile || !profile.onboarding_completed_at;

	return (
		<section className="py-10">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<form action={async () => {
					"use server";
					const sb = supaServer();
					await sb.auth.signOut();
					redirect("/sign-in");
				}}>
					<button type="submit" className="text-sm text-red-600 underline underline-offset-4">Sign out</button>
				</form>
			</div>

					<div className="mt-6 space-y-2">
						<p><span className="font-semibold">User ID:</span> {user.id}</p>
						<p><span className="font-semibold">Tipe Pengguna:</span> {profile?.user_type ?? "(belum diisi)"}</p>
						<p><span className="font-semibold">Tujuan Utama:</span> {profile?.main_goal ?? "(belum diisi)"}</p>
						<p><span className="font-semibold">Jenis Usaha:</span> {profile?.business_type ?? "(belum diisi)"}</p>
						<p><span className="font-semibold">Sumber Info:</span> {profile?.info_source ?? "(belum diisi)"}</p>
						<div className="flex gap-3 mt-4">
							<a href="/generate" className="rounded-xl bg-brand text-white px-4 py-2">Generate</a>
							<a href="/history" className="rounded-xl bg-gray-700 text-white px-4 py-2">History</a>
						</div>
					</div>

					<OnboardingModal
						needsOnboarding={needsOnboarding}
						initialName={profile?.full_name ?? ""}
						initialRole={profile?.user_type ?? ""}
						action={saveOnboarding}
					/>
		</section>
	);
}
