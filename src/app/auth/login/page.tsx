"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { signIn } from "@/app/actions/auth";

// ── Shared design tokens ─────────────────────────────────────────────────────

const INPUT =
  "w-full bg-[#F4F4F5] rounded-[8px] px-4 py-3 text-[15px] text-[#0A0A0A] placeholder:text-[#A1A1AA] border-[1.5px] border-transparent outline-none transition-[background-color,border-color] duration-150 focus:border-orange-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed";

const INPUT_ERR = "border-red-400 bg-red-50/40";

const BTN =
  "w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[15px] rounded-[8px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed";

const LABEL = "block text-[13px] font-medium text-[#71717A] mb-1.5";

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

// ── Form ─────────────────────────────────────────────────────────────────────

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const nextParam = searchParams.get("next") ?? "/";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(errorParam);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await signIn(fd);
      } catch {
        setError("Invalid email or password.");
      }
    });
  };

  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0A0A0A] tracking-tight leading-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 text-[14px] text-[#71717A]">
          Sign in to your IntakeOCR account
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="next" value={nextParam} />

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
            className={`${INPUT} ${error ? INPUT_ERR : ""}`}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="text-[13px] font-medium text-[#71717A]">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[13px] font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isPending}
              className={`${INPUT} pr-10 ${error ? INPUT_ERR : ""}`}
            />
            <EyeToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
        </div>

        <button type="submit" disabled={isPending} className={`${BTN} mt-2`}>
          {isPending ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-[#71717A]">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">
          Get started free
        </Link>
      </p>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
