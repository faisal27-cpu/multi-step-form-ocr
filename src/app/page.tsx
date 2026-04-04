import { createClient } from "@/lib/supabase/server";
import { LandingPage } from "./LandingPage";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <LandingPage isAuthenticated={!!user} />;
}
