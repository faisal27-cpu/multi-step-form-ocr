"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/app/actions/auth";

// ---------------------------------------------------------------------------
// Password strength
// ---------------------------------------------------------------------------
type Strength = "weak" | "fair" | "strong";

function getStrength(pwd: string): Strength {
  if (pwd.length < 8) return "weak";
  let score = 0;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  return "strong";
}

const STRENGTH_CONFIG: Record<Strength, { label: string; bars: number; color: string }> = {
  weak:   { label: "Weak",   bars: 1, color: "bg-red-500" },
  fair:   { label: "Fair",   bars: 2, color: "bg-yellow-500" },
  strong: { label: "Strong", bars: 3, color: "bg-green-500" },
};

function StrengthIndicator({ password }: { password: string }) {
  if (!password) return null;
  const { label, bars, color } = STRENGTH_CONFIG[getStrength(password)];
  return (
    <div className="space-y-1.5 mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i <= bars ? color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        label === "Weak" ? "text-red-600 dark:text-red-400" :
        label === "Fair" ? "text-yellow-600 dark:text-yellow-400" :
        "text-green-600 dark:text-green-400"
      }`}>
        {label} password
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Show/hide toggle button
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMatch = !confirmPassword || password === confirmPassword;

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

    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await signUp(fd);
      } catch {
        // signUp redirects on success; any thrown error is a real failure
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <AuthShell
      title="Create your account"
      description="Start submitting intake forms in minutes."
    >
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            disabled={isPending}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
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
          <StrengthIndicator password={password} />
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
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
          {isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary underline underline-offset-2 font-medium">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
