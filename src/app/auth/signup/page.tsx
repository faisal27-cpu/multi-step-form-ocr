"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { signUp } from "@/app/actions/auth";

// ── Password strength ────────────────────────────────────────────────────────
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

const STRENGTH_META: Record<Strength, { label: string; bars: number; barColor: string; textColor: string }> = {
  weak:   { label: "Weak",   bars: 1, barColor: "bg-red-500",    textColor: "text-red-500" },
  fair:   { label: "Fair",   bars: 2, barColor: "bg-orange-400", textColor: "text-orange-500" },
  strong: { label: "Strong", bars: 3, barColor: "bg-green-500",  textColor: "text-green-600" },
};

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { label, bars, barColor, textColor } = STRENGTH_META[getStrength(password)];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-sm transition-colors duration-300 ${
              i <= bars ? barColor : "bg-zinc-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColor}`}>{label} password</p>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────
function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-700 mb-1.5">
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed";

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!passwordsMatch) { setError("Passwords do not match."); return; }
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try { await signUp(fd); } catch { setError("Something went wrong. Please try again."); }
    });
  };

  return (
    <AuthShell>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Start submitting intake forms in minutes.</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600">
          <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <FieldLabel htmlFor="email">Work email</FieldLabel>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            disabled={isPending}
            className={inputBase}
          />
        </div>

        {/* Password */}
        <div>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className={`${inputBase} pr-10`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
            <EyeToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
          <StrengthBar password={password} />
        </div>

        {/* Confirm password */}
        <div>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`${inputBase} pr-10 ${
                confirmTouched && !passwordsMatch
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : confirmTouched && passwordsMatch
                  ? "border-green-400 focus:border-green-500 focus:ring-green-500/20"
                  : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
            />
            <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
          </div>
          {confirmTouched && !passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
              <XCircle className="w-3.5 h-3.5" /> Passwords do not match
            </p>
          )}
          {confirmTouched && passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || (confirmTouched && !passwordsMatch)}
          className="mt-2 w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
