"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

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
        setSent(true);
      }
    });
  };

  if (sent) {
    return (
      <AuthShell title="Check your email" description="">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
            <MailCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{sentEmail}</span>. Check your inbox and follow
            the instructions.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-primary underline underline-offset-2"
            >
              try again
            </button>
            .
          </p>
        </div>
        <Link
          href="/auth/login"
          className="block text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
    >
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Remembered it?{" "}
        <Link href="/auth/login" className="text-primary underline underline-offset-2 font-medium">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
