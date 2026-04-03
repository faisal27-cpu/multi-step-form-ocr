"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { ScanText, CheckCircle2, ArrowLeft, ChevronRight, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveBusinessProfile } from "@/app/actions/auth";

// ── Constants ────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  { value: "healthcare", label: "Healthcare" },
  { value: "legal",      label: "Legal" },
  { value: "finance",    label: "Finance" },
  { value: "hr",         label: "HR & People Ops" },
  { value: "government", label: "Government" },
  { value: "other",      label: "Other" },
] as const;

const COMPANY_SIZES = [
  { value: "1-10",   label: "1–10 employees" },
  { value: "11-50",  label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "200+",   label: "200+ employees" },
] as const;

// ── Shared styles ────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed";

const labelCls = "block text-sm font-medium text-zinc-700 mb-1.5";

// ── Types ────────────────────────────────────────────────────────────────────

type StepNum = 1 | 2 | 3;
type Direction = "forward" | "back";

// ── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: StepNum }) {
  const pct = step === 1 ? 33 : step === 2 ? 66 : 100;
  return (
    <div className="h-[3px] w-full bg-zinc-100">
      <div
        className="h-full bg-orange-500 transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Error banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-5 flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600">
      <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
      {message}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function OnboardingForm() {
  // Navigation state
  const [step, setStep] = useState<StepNum>(1);
  const [direction, setDirection] = useState<Direction>("forward");

  // Form data
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [website, setWebsite] = useState("");

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Clear error when step changes
  useEffect(() => { setError(null); }, [step]);

  function goTo(target: StepNum, dir: Direction) {
    setDirection(dir);
    setStep(target);
  }

  // ── Step handlers ──────────────────────────────────────────────────────────

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) { setError("Company name is required."); return; }
    if (!industry)           { setError("Please select an industry."); return; }
    if (!companySize)        { setError("Please select a company size."); return; }
    goTo(2, "forward");
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) { setError("Job title is required."); return; }
    goTo(3, "forward");
  };

  const handleFinalSubmit = () => {
    const fd = new FormData();
    fd.set("companyName",    companyName);
    fd.set("industry",       industry);
    fd.set("companySize",    companySize);
    fd.set("jobTitle",       jobTitle);
    fd.set("companyWebsite", website);
    startTransition(async () => {
      try {
        await saveBusinessProfile(fd);
      } catch {
        setError("Something went wrong saving your profile. Please try again.");
        goTo(2, "back");
      }
    });
  };

  // ── Animation class ────────────────────────────────────────────────────────
  // key={step} on the step wrapper forces remount → CSS entrance animation fires.
  const enterClass = direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="h-14 shrink-0 flex items-center px-6 border-b border-zinc-100">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-900"
        >
          <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center">
            <ScanText className="w-4 h-4 text-white" />
          </div>
          IntakeOCR
        </Link>
      </header>

      {/* Progress bar */}
      <ProgressBar step={step} />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div key={step} className={enterClass}>

            {/* ── Step 1: Business info ──────────────────────────────── */}
            {step === 1 && (
              <>
                <p className="text-xs font-semibold text-zinc-400 mb-6 uppercase tracking-widest">
                  Step 1 of 2
                </p>
                <h1 className="font-display text-2xl font-bold text-zinc-900 mb-1.5">
                  Tell us about your business
                </h1>
                <p className="text-sm text-zinc-500 mb-8">
                  This helps us tailor IntakeOCR to your workflow.
                </p>

                {error && <ErrorBanner message={error} />}

                <form onSubmit={handleStep1} className="space-y-5">
                  <div>
                    <label htmlFor="companyName" className={labelCls}>
                      Company name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      placeholder="Acme Corporation"
                      maxLength={200}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className={labelCls}>
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger
                        id="industry"
                        className="rounded-md border-zinc-300 h-auto py-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <SelectValue placeholder="Select industry…" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="companySize" className={labelCls}>
                      Company size <span className="text-red-500">*</span>
                    </label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger
                        id="companySize"
                        className="rounded-md border-zinc-300 h-auto py-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      >
                        <SelectValue placeholder="Select size…" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPANY_SIZES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {/* ── Step 2: Role ───────────────────────────────────────── */}
            {step === 2 && (
              <>
                <p className="text-xs font-semibold text-zinc-400 mb-6 uppercase tracking-widest">
                  Step 2 of 2
                </p>
                <h1 className="font-display text-2xl font-bold text-zinc-900 mb-1.5">
                  Your role
                </h1>
                <p className="text-sm text-zinc-500 mb-8">
                  A few more details to complete your profile.
                </p>

                {error && <ErrorBanner message={error} />}

                <form onSubmit={handleStep2} className="space-y-5">
                  <div>
                    <label htmlFor="jobTitle" className={labelCls}>
                      Job title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      required
                      placeholder="Operations Manager"
                      maxLength={100}
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className={labelCls}>
                      Company website{" "}
                      <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://acme.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => goTo(1, "back")}
                      className="flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ── Step 3: Welcome ────────────────────────────────────── */}
            {step === 3 && (
              <div className="flex flex-col items-center text-center py-4">
                {/* Animated checkmark */}
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mb-6 animate-scale-in">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>

                <h1 className="font-display text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">
                  Welcome,{" "}
                  <span className="text-orange-500">{companyName}</span>!
                </h1>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-xs">
                  Your profile is set up. You&apos;re ready to start submitting intake forms with auto-fill.
                </p>

                {error && (
                  <div className="w-full mb-5 flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600 text-left">
                    <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  onClick={handleFinalSubmit}
                  disabled={isPending}
                  className="w-full max-w-xs rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Setting up…
                    </>
                  ) : (
                    "Go to dashboard →"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => goTo(2, "back")}
                  disabled={isPending}
                  className="mt-4 text-sm text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50"
                >
                  ← Go back
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      <footer className="h-10 shrink-0 flex items-center justify-center text-xs text-zinc-400 border-t border-zinc-100">
        &copy; {new Date().getFullYear()} IntakeOCR. All rights reserved.
      </footer>
    </div>
  );
}
