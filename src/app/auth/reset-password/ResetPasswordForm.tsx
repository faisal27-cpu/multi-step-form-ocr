"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const INPUT =
  "w-full bg-[#F4F4F5] rounded-[8px] px-4 py-3 text-[15px] text-[#0A0A0A] placeholder:text-[#A1A1AA] border-[1.5px] border-transparent outline-none transition-[background-color,border-color] duration-150 focus:border-orange-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed";

const INPUT_ERR = "border-red-400 bg-red-50/40";

const BTN =
  "w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[15px] rounded-[8px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed";

const LABEL = "block text-[13px] font-medium text-[#71717A] mb-1.5";

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

type PageState = "loading" | "ready" | "success" | "invalid";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code      = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type      = searchParams.get("type");

  const [pageState, setPageState] = useState<PageState>("loading");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function exchange() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        setPageState(error ? "invalid" : "ready");
      } else if (tokenHash && type === "recovery") {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
        setPageState(error ? "invalid" : "ready");
      } else {
        setPageState("invalid");
      }
    }
    exchange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
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

  if (pageState === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <span className="w-8 h-8 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
        <p className="text-[14px] text-[#71717A]">Verifying reset link…</p>
      </div>
    );
  }

  if (pageState === "invalid") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center animate-scale-in">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-[14px] text-[#71717A] leading-relaxed">
          This reset link is invalid or has expired.
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-[14px] font-semibold text-orange-500 hover:text-orange-600 transition-colors"
        >
          Request a new link →
        </Link>
      </div>
    );
  }

  if (pageState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center animate-scale-in">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-[14px] text-[#71717A]">
          Password updated. Redirecting to sign in…
        </p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className={LABEL}>New password</label>
          <div className="relative">
            <input
              id="password"
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
        </div>

        <div>
          <label htmlFor="confirmPassword" className={LABEL}>Confirm new password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`${INPUT} pr-10 ${!passwordsMatch ? INPUT_ERR : ""}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
            />
            <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
          </div>
          {!passwordsMatch && (
            <p className="mt-1.5 text-[12px] text-red-500">Passwords do not match</p>
          )}
        </div>

        <button type="submit" disabled={isPending || !passwordsMatch} className={`${BTN} mt-2`}>
          {isPending ? (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </>
  );
}
