"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { signUp } from "@/app/actions/auth";

// ── Shared design tokens ─────────────────────────────────────────────────────

const INPUT =
  "w-full bg-[#F4F4F5] rounded-[8px] px-4 py-3 text-[15px] text-[#0A0A0A] placeholder:text-[#A1A1AA] border-[1.5px] border-transparent outline-none transition-[background-color,border-color] duration-150 focus:border-orange-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed";

const INPUT_ERR = "border-red-400 bg-red-50/40";
const INPUT_OK  = "border-green-400";

const BTN =
  "w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[15px] rounded-[8px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed";

const LABEL = "block text-[13px] font-medium text-[#71717A] mb-1.5";

// ── Password strength ────────────────────────────────────────────────────────

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

function getStrength(pwd: string): { level: StrengthLevel; label: string } {
  if (!pwd) return { level: 0, label: "" };
  if (pwd.length < 8) return { level: 1, label: "Too short" };
  let score = 0;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 1) return { level: 1, label: "Weak" };
  if (score === 2) return { level: 2, label: "Fair" };
  if (score === 3) return { level: 3, label: "Good" };
  return { level: 4, label: "Strong" };
}

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { level, label } = getStrength(password);
  const filled =
    level === 1 ? "bg-red-500" :
    level === 2 ? "bg-orange-400" :
    "bg-green-500";
  const labelColor =
    level === 1 ? "text-red-500" :
    level === 2 ? "text-orange-500" :
    "text-green-600";

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
              i <= level ? filled : "bg-[#E4E4E7]"
            }`}
          />
        ))}
      </div>
      <p className={`text-[12px] font-medium ${labelColor}`}>{label}</p>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#71717A] transition-colors"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

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
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await signUp(fd);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <AuthShell>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0A0A0A] tracking-tight leading-tight">
          Create your account
        </h1>
        <p className="mt-1.5 text-[14px] text-[#71717A]">
          Start your free IntakeOCR account
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className={LABEL}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            disabled={isPending}
            className={INPUT}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={LABEL}>Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className={`${INPUT} pr-10`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
            <EyeToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
          <StrengthBar password={password} />
          {!password && (
            <p className="mt-1.5 text-[12px] text-[#A1A1AA]">Must be at least 8 characters</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirmPassword" className={LABEL}>Confirm password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`${INPUT} pr-10 ${
                confirmTouched && !passwordsMatch ? INPUT_ERR :
                confirmTouched && passwordsMatch  ? INPUT_OK  : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
            />
            <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
          </div>
          {confirmTouched && passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1 text-[12px] text-green-600">
              <Check className="w-3.5 h-3.5" /> Passwords match
            </p>
          )}
          {confirmTouched && !passwordsMatch && (
            <p className="mt-1.5 text-[12px] text-red-500">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || (confirmTouched && !passwordsMatch)}
          className={`${BTN} mt-2`}
        >
          {isPending ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[#71717A]">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
