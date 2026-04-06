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
    <div className="flex items-start w-full">
      {STEPS.map((step, i) => {
        const stepIndex = getIndex(step.key);
        const isCompleted = stepIndex < currentIndex;
        const isCurrent   = stepIndex === currentIndex;

        return (
          <div key={step.key} className="flex items-start flex-1">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-200",
                  isCompleted && "bg-orange-500 text-white",
                  isCurrent   && "bg-orange-500 text-white ring-4 ring-orange-500/15",
                  !isCompleted && !isCurrent && "bg-[#F4F4F5] dark:bg-[#1A1A1A] text-[#A1A1AA]"
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[11px] whitespace-nowrap",
                  isCurrent   && "font-semibold text-orange-500",
                  isCompleted && "font-medium text-orange-400",
                  !isCompleted && !isCurrent && "font-medium text-[#A1A1AA]"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line — centered on the circle (16px offset = half of 32px circle) */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mt-4 mx-2 rounded-full transition-all duration-300",
                  stepIndex < currentIndex ? "bg-orange-400" : "bg-[#E4E4E7] dark:bg-[#2A2A2A]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
