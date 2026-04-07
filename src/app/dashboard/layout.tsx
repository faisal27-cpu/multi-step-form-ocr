import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FloatingNavMenu } from "@/components/dashboard/FloatingNavMenu";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/dashboard/intake/new");

  // Require onboarding before any dashboard page is accessible
  const { data: profile } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding");

  return (
    <>
      <DashboardNav email={user.email!} />
      {children}
      <FloatingNavMenu />
    </>
  );
}
