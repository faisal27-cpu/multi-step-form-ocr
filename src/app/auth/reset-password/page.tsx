import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set new password"
      description="Choose a new password for your account."
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
