"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/";

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/auth/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  redirect(next);
}

export async function signUp(
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // ── 1. Create the account ────────────────────────────────────────────────
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

  if (signUpError) {
    console.error("[signUp] signUp call failed:", {
      message: signUpError.message,
      status:  signUpError.status,
      code:    (signUpError as { code?: string }).code,
    });
    return { error: signUpError.message };
  }

  // Supabase anti-enumeration: when email confirmation is ON and the address is
  // already registered, it returns a user with an empty identities array instead
  // of an error, to avoid leaking whether an account exists.
  if ((data.user?.identities ?? []).length === 0) {
    console.error("[signUp] duplicate email (empty identities):", email);
    return { error: "An account with this email already exists. Sign in instead." };
  }

  // ── 2. Establish session ─────────────────────────────────────────────────
  // When email confirmation is enabled Supabase returns a user but no session,
  // so auth cookies are never written and the next page would see no user.
  // Sign in explicitly so the session is persisted before redirecting.
  if (!data.session) {
    console.log("[signUp] no session returned — attempting signInWithPassword");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      console.error("[signUp] signInWithPassword failed:", {
        message: signInError.message,
        status:  signInError.status,
        code:    (signInError as { code?: string }).code,
      });
      return {
        error: `Account created but automatic sign-in failed: ${signInError.message}`,
      };
    }
  }

  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function forgotPassword(
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/reset-password`,
  });

  if (error) return { error: error.message };
}

export async function saveBusinessProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const service = createServiceClient();

  const { error } = await service.from("business_profiles").insert({
    user_id:         user.id,
    company_name:    formData.get("companyName") as string,
    industry:        formData.get("industry") as "healthcare" | "legal" | "finance" | "hr" | "government" | "other",
    company_size:    formData.get("companySize") as "1-10" | "11-50" | "51-200" | "200+",
    job_title:       formData.get("jobTitle") as string,
    company_website: (formData.get("companyWebsite") as string) || null,
  });

  if (error) {
    // Unique constraint means profile already exists — proceed to dashboard
    if (!error.code?.includes("23505")) {
      throw new Error(error.message);
    }
  }

  redirect("/");
}
