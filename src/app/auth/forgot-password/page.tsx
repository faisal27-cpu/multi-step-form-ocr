"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { forgotPassword } from "@/app/actions/auth";
import { XCircle } from "lucide-react";

const inputBase =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed";

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
      if (result?.error) { setError(result.error); } else { setSentEmail(email); }
    });
  };

  if (sentEmail) {
    return (
      <AuthCard title="Check your email">
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          {/* Animated checkmark */}
          <div className="relative w-16 h-16 animate-scale-in">
            <div className="absolute inset-0 rounded-full bg-green-100" />
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 64 64"
              fill="none"
            >
              <polyline
                points="16,34 27,45 48,22"
                stroke="#16a34a"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-check-draw"
              />
            </svg>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm text-zinc-600 leading-relaxed">
              We&apos;ve sent a reset link to{" "}
              <span className="font-semibold text-zinc-900">{sentEmail}</span>.
            </p>
            <p className="text-xs text-zinc-400">
              Check your spam folder if you don&apos;t see it within a minute.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSentEmail(null)}
            className="text-xs text-zinc-400 hover:text-orange-500 underline underline-offset-2 transition-colors"
          >
            Try a different email
          </button>
        </div>
        <Link
          href="/auth/login"
          className="block mt-2 text-center text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          ← Back to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your work email and we'll send you a reset link."
    >
      {error && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600">
          <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">
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
            className={inputBase}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Sending…
            </>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <Link
        href="/auth/login"
        className="block text-center text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors"
      >
        ← Back to sign in
      </Link>
    </AuthCard>
  );
}
