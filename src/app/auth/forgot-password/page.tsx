"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { forgotPassword } from "@/app/actions/auth";

const INPUT =
  "w-full bg-[#F4F4F5] rounded-[8px] px-4 py-3 text-[15px] text-[#0A0A0A] placeholder:text-[#A1A1AA] border-[1.5px] border-transparent outline-none transition-[background-color,border-color] duration-150 focus:border-orange-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed";

const BTN =
  "w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[15px] rounded-[8px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    startTransition(async () => {
      const result = await forgotPassword(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setSentEmail(email);
      }
    });
  };

  if (sentEmail) {
    return (
      <AuthCard title="Check your email">
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          {/* Animated checkmark */}
          <div className="relative w-16 h-16 animate-scale-in">
            <div className="absolute inset-0 rounded-full bg-green-50 border-2 border-green-100" />
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 64 64"
              fill="none"
            >
              <polyline
                points="16,34 27,45 48,22"
                stroke="#16a34a"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-check-draw"
              />
            </svg>
          </div>

          <div className="space-y-1.5">
            <p className="text-[14px] text-[#3F3F46] leading-relaxed">
              We&apos;ve sent a reset link to{" "}
              <span className="font-semibold text-[#0A0A0A]">{sentEmail}</span>
            </p>
            <p className="text-[13px] text-[#A1A1AA]">
              Check your spam folder if you don&apos;t see it within a minute.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSentEmail(null)}
            className="text-[13px] text-[#A1A1AA] hover:text-orange-500 transition-colors"
          >
            Try a different email
          </button>
        </div>

        <Link
          href="/auth/login"
          className="mt-2 block text-center text-[14px] font-semibold text-orange-500 hover:text-orange-600 transition-colors"
        >
          ← Back to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
    >
      {error && (
        <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-[#71717A] mb-1.5">
            Email address
          </label>
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

        <button type="submit" disabled={isPending} className={BTN}>
          {isPending ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <Link
        href="/auth/login"
        className="mt-5 block text-center text-[13px] text-[#A1A1AA] hover:text-orange-500 transition-colors"
      >
        ← Back to sign in
      </Link>
    </AuthCard>
  );
}
