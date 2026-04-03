"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { ScanText, ArrowLeft, ChevronRight } from "lucide-react";
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

// ── Design tokens ─────────────────────────────────────────────────────────────

const INPUT =
  "w-full bg-[#F4F4F5] rounded-[8px] px-4 py-3 text-[15px] text-[#0A0A0A] placeholder:text-[#A1A1AA] border-[1.5px] border-transparent outline-none transition-[background-color,border-color] duration-150 focus:border-orange-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed";

const BTN =
  "w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[15px] rounded-[8px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed";

const LABEL = "block text-[13px] font-medium text-[#71717A] mb-1.5";

const SELECT_TRIGGER =
  "w-full bg-[#F4F4F5] rounded-[8px] px-4 py-3 h-auto text-[15px] text-[#0A0A0A] border-[1.5px] border-transparent data-[placeholder]:text-[#A1A1AA] focus:ring-0 focus:ring-offset-0 focus:border-orange-500 focus:bg-white transition-[background-color,border-color] duration-150 disabled:opacity-50 data-[state=open]:border-orange-500 data-[state=open]:bg-white";

// ── Types ────────────────────────────────────────────────────────────────────

type StepNum  = 1 | 2 | 3;
type Direction = "forward" | "back";

// ── Main component ────────────────────────────────────────────────────────────

export function OnboardingForm() {
  // Navigation
  const [step, setStep] = useState<StepNum>(1);
  const [direction, setDirection] = useState<Direction>("forward");
  const [isExiting, setIsExiting] = useState(false);
  const [pendingStep, setPendingStep] = useState<StepNum | null>(null);

  // Form data
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [website, setWebsite] = useState("");

  // UI
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Clear error on step change
  useEffect(() => { setError(null); }, [step]);

  // Transition engine: exit animation fires, then after duration step switches
  function goTo(target: StepNum, dir: Direction) {
    if (isExiting) return;
    setDirection(dir);
    setIsExiting(true);
    setPendingStep(target);
  }

  useEffect(() => {
    if (!isExiting || pendingStep === null) return;
    const id = setTimeout(() => {
      setStep(pendingStep);
      setPendingStep(null);
      setIsExiting(false);
    }, 230);
    return () => clearTimeout(id);
  }, [isExiting, pendingStep]);

  // Animation class for the step content wrapper
  const animClass = isExiting
    ? direction === "forward" ? "animate-slide-out-left" : "animate-slide-out-right"
    : direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left";

  // ── Handlers ──────────────────────────────────────────────────────────────

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
        setError("Something went wrong. Please try again.");
        goTo(2, "back");
      }
    });
  };

  // Progress bar width
  const progress = step === 1 ? "33.33%" : step === 2 ? "66.66%" : "100%";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar — very top of page */}
      <div className="h-[3px] bg-[#F4F4F5] shrink-0">
        <div
          className="h-full bg-orange-500 transition-[width] duration-500 ease-out"
          style={{ width: progress }}
        />
      </div>

      {/* Header */}
      <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-[#E4E4E7]">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[#0A0A0A]">
          <div className="w-7 h-7 rounded-[8px] bg-orange-500 flex items-center justify-center">
            <ScanText className="w-3.5 h-3.5 text-white" />
          </div>
          IntakeOCR
        </Link>

        {/* Step indicator — hidden on success screen */}
        {step < 3 && (
          <span className="text-[13px] font-medium text-[#71717A]">
            Step{" "}
            <span className="text-orange-500 transition-colors">{step}</span>
            {" "}of 3
          </span>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[520px]">

          {/* Animated step content */}
          <div className={animClass}>

            {/* ── Step 1: Set up your workspace ─────────────────────── */}
            {step === 1 && (
              <>
                <h1 className="text-[26px] font-bold text-[#0A0A0A] tracking-tight leading-tight mb-1.5">
                  Set up your workspace
                </h1>
                <p className="text-[14px] text-[#71717A] mb-8 leading-relaxed">
                  Tell us about your business so we can personalize your experience
                </p>

                {error && (
                  <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleStep1} className="space-y-4">
                  <div>
                    <label htmlFor="companyName" className={LABEL}>
                      Company name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      placeholder="Acme Corporation"
                      maxLength={200}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className={LABEL}>
                      Industry <span className="text-red-400">*</span>
                    </label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger id="industry" className={SELECT_TRIGGER}>
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
                    <label htmlFor="companySize" className={LABEL}>
                      Company size <span className="text-red-400">*</span>
                    </label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger id="companySize" className={SELECT_TRIGGER}>
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

                  <button type="submit" className={`${BTN} mt-2`}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {/* ── Step 2: Your role ─────────────────────────────────── */}
            {step === 2 && (
              <>
                <h1 className="text-[26px] font-bold text-[#0A0A0A] tracking-tight leading-tight mb-1.5">
                  Your role at{" "}
                  <span className="text-orange-500">{companyName}</span>
                </h1>
                <p className="text-[14px] text-[#71717A] mb-8 leading-relaxed">
                  A few more details to complete your profile
                </p>

                {error && (
                  <div className="mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleStep2} className="space-y-4">
                  <div>
                    <label htmlFor="jobTitle" className={LABEL}>
                      Job title <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      required
                      placeholder="Operations Manager"
                      maxLength={100}
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className={LABEL}>
                      Company website{" "}
                      <span className="font-normal text-[#A1A1AA]">(optional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://acme.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className={INPUT}
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => goTo(1, "back")}
                      className="flex items-center gap-1.5 h-11 px-5 text-[15px] font-medium text-[#71717A] hover:text-[#0A0A0A] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button type="submit" className={`${BTN} flex-1`}>
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ── Step 3: Success ───────────────────────────────────── */}
            {step === 3 && (
              <div className="flex flex-col items-center text-center py-8">
                {/* Animated orange checkmark SVG */}
                <div className="w-20 h-20 mb-7 animate-scale-in">
                  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="40" cy="40" r="36" stroke="#F97316" strokeWidth="2.5" />
                    <polyline
                      points="22,41 33,52 58,26"
                      stroke="#F97316"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-check-draw-lg"
                    />
                  </svg>
                </div>

                <h1 className="text-[30px] font-bold text-[#0A0A0A] tracking-tight leading-tight mb-2">
                  You&apos;re all set,{" "}
                  <span className="text-orange-500">{companyName}</span>!
                </h1>
                <p className="text-[14px] text-[#71717A] leading-relaxed mb-8 max-w-xs">
                  Your workspace is ready. Start submitting intake forms with OCR auto-fill.
                </p>

                {error && (
                  <div className="w-full mb-5 rounded-[8px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] text-red-600 text-left">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleFinalSubmit}
                  disabled={isPending}
                  className={`${BTN} max-w-xs`}
                >
                  {isPending ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    "Go to your dashboard →"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => goTo(2, "back")}
                  disabled={isPending}
                  className="mt-4 flex items-center gap-1 text-[13px] text-[#A1A1AA] hover:text-[#71717A] transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Go back
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      <footer className="h-10 shrink-0 flex items-center justify-center text-[12px] text-[#A1A1AA] border-t border-[#E4E4E7]">
        &copy; {new Date().getFullYear()} IntakeOCR. All rights reserved.
      </footer>
    </div>
  );
}
