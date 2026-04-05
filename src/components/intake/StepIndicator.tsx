"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormStep } from "@/types/intake";

const STEPS: { key: FormStep; label: string }[] = [
  { key: "upload",   label: "Upload"  },
  { key: "personal", label: "Info"    },
  { key: "details",  label: "Details" },
  { key: "review",   label: "Review"  },
];

const STEP_ORDER: FormStep[] = ["upload", "personal", "details", "review", "success"];

function getIndex(step: FormStep) {
  return STEP_ORDER.indexOf(step);
}

export function StepIndicator({ currentStep }: { currentStep: FormStep }) {
  const currentIndex = getIndex(currentStep);

  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, i) => {
        const stepIndex = getIndex(step.key);
        const isCompleted = stepIndex < currentIndex;
        const isCurrent   = stepIndex === currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all duration-200",
                  isCompleted && "bg-orange-500 border-orange-500 text-white",
                  isCurrent   && "bg-orange-500 border-orange-500 text-white ring-4 ring-orange-500/15",
                  !isCompleted && !isCurrent && "bg-white dark:bg-[#111] border-[#E4E4E7] dark:border-[#2A2A2A] text-[#A1A1AA]"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[12px] font-medium whitespace-nowrap",
                  (isCompleted || isCurrent) ? "text-orange-500" : "text-[#A1A1AA]"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mb-5 mx-2 rounded-full transition-all duration-300",
                  stepIndex < currentIndex ? "bg-orange-500" : "bg-[#E4E4E7] dark:bg-[#2A2A2A]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
