"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormStep } from "@/types/intake";

const STEPS: { key: FormStep; label: string }[] = [
  { key: "upload", label: "Upload" },
  { key: "personal", label: "Info" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
];

const STEP_ORDER: FormStep[] = ["upload", "personal", "details", "review", "success"];

function getIndex(step: FormStep) {
  return STEP_ORDER.indexOf(step);
}

export function StepIndicator({ currentStep }: { currentStep: FormStep }) {
  const currentIndex = getIndex(currentStep);

  return (
    <div className="flex items-center gap-0 w-full max-w-lg mx-auto">
      {STEPS.map((step, i) => {
        const stepIndex = getIndex(step.key);
        const isCompleted = stepIndex < currentIndex;
        const isCurrent = stepIndex === currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 shrink-0",
                  isCompleted &&
                    "bg-primary border-primary text-primary-foreground",
                  isCurrent &&
                    "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  (isCompleted || isCurrent) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mb-5 mx-1 transition-all duration-200",
                  stepIndex < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
