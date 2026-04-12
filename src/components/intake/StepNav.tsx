"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SaveState = "idle" | "saving" | "saved";

interface StepNavProps {
  /** If provided, renders a Back button */
  onBack?: () => void;
  backDisabled?: boolean;

  /** Label for the primary continue/submit button */
  continueLabel: string;
  /** "submit" when inside a <form>; "button" when not */
  continueType?: "submit" | "button";
  onContinue?: () => void;
  continueDisabled?: boolean;

  /** Drives the loading/saved animation on the continue button */
  saveState?: SaveState;
}

export function StepNav({
  onBack,
  backDisabled = false,
  continueLabel,
  continueType = "button",
  onContinue,
  continueDisabled = false,
  saveState = "idle",
}: StepNavProps) {
  const isBusy = saveState === "saving" || saveState === "saved";
  const isDisabled = continueDisabled || isBusy;

  const continueContent = () => {
    if (saveState === "saving") {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving…
        </>
      );
    }
    if (saveState === "saved") {
      return <>Saved ✓</>;
    }
    return <>{continueLabel}</>;
  };

  const navContent = (
    <div className="flex items-center justify-between">
      {/* Back button — min 44×44px touch target via padding */}
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          className="flex items-center gap-1.5 text-[14px] font-medium text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-white transition-colors disabled:opacity-40 min-h-[44px] min-w-[44px] px-2 -ml-2"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}

      {/* Continue / Submit button — min 44×44px */}
      <button
        type={continueType}
        onClick={continueType === "button" ? onContinue : undefined}
        disabled={isDisabled}
        className={cn(
          "min-h-[44px] px-6 text-white text-[14px] font-semibold rounded-md",
          "flex items-center gap-2 transition-all duration-200",
          "shadow-sm shadow-orange-200/60",
          saveState === "saved"
            ? "bg-green-500 hover:bg-green-600 shadow-green-200/60"
            : "bg-orange-500 hover:bg-orange-600",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        )}
      >
        {continueContent()}
      </button>
    </div>
  );

  return (
    <>
      {/* ── Mobile: fixed sticky bar at bottom ─────────────────────────── */}
      <div className="sm:hidden">
        {/* Gradient fade so content doesn't hard-cut behind the bar */}
        <div className="fixed bottom-[68px] left-0 right-0 h-10 pointer-events-none z-40 bg-gradient-to-b from-white/0 to-white dark:from-[#0A0A0A]/0 dark:to-[#0A0A0A]" />
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0A0A0A] border-t border-[#F4F4F5] dark:border-[#1A1A1A] px-6 py-3">
          {navContent}
        </div>
      </div>

      {/* ── Desktop: normal flow ────────────────────────────────────────── */}
      <div className="hidden sm:block pt-2">
        {navContent}
      </div>
    </>
  );
}
