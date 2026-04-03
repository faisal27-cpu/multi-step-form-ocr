import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/onboarding");

  // If user already has a profile, skip onboarding
  const { data: profile } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile) redirect("/dashboard/intake/new");

  return <OnboardingForm />;
}
