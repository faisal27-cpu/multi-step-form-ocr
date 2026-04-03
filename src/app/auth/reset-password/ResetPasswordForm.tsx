"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ToggleVisibility({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label={show ? "Hide password" : "Show password"}
      tabIndex={-1}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

type PageState = "loading" | "ready" | "success" | "invalid";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const [pageState, setPageState] = useState<PageState>("loading");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Exchange the code or token_hash for a session on mount
  useEffect(() => {
    const supabase = createClient();

    async function exchange() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        setPageState(error ? "invalid" : "ready");
      } else if (tokenHash && type === "recovery") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        setPageState(error ? "invalid" : "ready");
      } else {
        setPageState("invalid");
      }
    }

    exchange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setPageState("success");
        setTimeout(() => router.push("/auth/login"), 2500);
      }
    });
  };

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  if (pageState === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Verifying reset link…</p>
      </div>
    );
  }

  if (pageState === "invalid") {
    return (
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/auth/forgot-password" className="text-sm text-primary underline underline-offset-2 font-medium">
          Request new link
        </Link>
      </div>
    );
  }

  if (pageState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-sm text-muted-foreground">
          Password updated successfully. Redirecting to sign in…
        </p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
            <ToggleVisibility show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`pr-10 ${!passwordsMatch ? "border-destructive focus-visible:ring-destructive" : ""}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
            />
            <ToggleVisibility show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
          </div>
          {!passwordsMatch && (
            <p className="text-xs text-destructive">Passwords do not match.</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending || !passwordsMatch}>
          {isPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </>
  );
}
