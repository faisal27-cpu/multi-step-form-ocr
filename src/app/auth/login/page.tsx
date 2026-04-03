"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/app/actions/auth";

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

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const nextParam = searchParams.get("next") ?? "/dashboard/intake/new";

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
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="next" value={nextParam} />

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-10"
              disabled={isPending}
            />
            <ToggleVisibility show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-primary underline underline-offset-2 font-medium">
          Create one
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" description="Sign in to your IntakeOCR account.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
