"use client";

import type { FormStep } from "@/types/intake";

const STEP_ORDER: FormStep[] = ["upload", "personal", "details", "review"];

const STEP_LABELS: Record<string, string> = {
  upload:   "Upload your document",
  personal: "Your information",
  details:  "Additional details",
  review:   "Review & submit",
};

export function StepIndicator({ currentStep }: { currentStep: FormStep }) {
  if (currentStep === "success") return null;

  const idx = STEP_ORDER.indexOf(currentStep);
  const stepNum = Math.max(idx + 1, 1);
  const progress = stepNum * 25; // 25% → 50% → 75% → 100%

  return (
    <div className="space-y-2">
      <div className="h-1 w-full bg-[#F4F4F5] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[12px] text-[#A1A1AA]">
        Step {stepNum} of 4 — {STEP_LABELS[currentStep] ?? currentStep}
      </p>
    </div>
  );
}
