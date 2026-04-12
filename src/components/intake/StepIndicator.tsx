"use client";

import { cn } from "@/lib/utils";
import type { FormStep } from "@/types/intake";

const STEP_ORDER: FormStep[] = ["upload", "personal", "details", "review"];

const STEP_LABELS: Record<string, string> = {
  upload:   "Upload",
  personal: "Your Info",
  details:  "Details",
  review:   "Review",
};

function AnimatedCheckmark() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="w-3.5 h-3.5"
      aria-hidden
    >
      <polyline
        points="3,8.5 6.5,12 13,4.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-check-draw"
      />
    </svg>
  );
}

export function StepIndicator({ currentStep }: { currentStep: FormStep }) {
  if (currentStep === "success") return null;

  const activeIdx = STEP_ORDER.indexOf(currentStep);
  const progress = ((activeIdx + 1) / STEP_ORDER.length) * 100;

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="h-1 w-full bg-[#F4F4F5] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 rounded-full"
          style={{
            width: `${progress}%`,
            transition: "width 300ms ease",
          }}
        />
      </div>

      {/* Step nodes */}
      <div className="flex items-start">
        {STEP_ORDER.map((stepKey, idx) => {
          const isCompleted = idx < activeIdx;
          const isActive    = idx === activeIdx;
          const isFuture    = idx > activeIdx;
          const isLast      = idx === STEP_ORDER.length - 1;

          return (
            <div key={stepKey} className="flex items-start flex-1 min-w-0">
              {/* Node + connector line */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                {/* Node + line row */}
                <div className="flex items-center w-full">
                  {/* Circle node */}
                  <div className="relative flex items-center justify-center shrink-0">
                    {/* Pulse ring on active node */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-full bg-orange-400 opacity-0 animate-step-pulse"
                        style={{ margin: "-4px" }}
                      />
                    )}
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors duration-300",
                        isCompleted && "bg-orange-500",
                        isActive    && "bg-orange-500 ring-2 ring-orange-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0A0A0A]",
                        isFuture    && "bg-[#F4F4F5] dark:bg-[#1A1A1A]"
                      )}
                    >
                      {isCompleted ? (
                        <AnimatedCheckmark key={`check-${stepKey}`} />
                      ) : (
                        <span className={cn(
                          isFuture ? "text-[#A1A1AA] dark:text-[#555]" : "text-white"
                        )}>
                          {idx + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Connecting line (not after last node) */}
                  {!isLast && (
                    <div className="flex-1 h-[2px] mx-1">
                      <div
                        className={cn(
                          "h-full rounded-full transition-colors duration-300",
                          isCompleted ? "bg-orange-500" : "bg-[#F4F4F5] dark:bg-[#1A1A1A]"
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    "text-[10px] mt-1.5 font-medium leading-none truncate",
                    // Mobile: only show active label
                    !isActive && "hidden sm:block",
                    isActive    && "text-orange-500",
                    isCompleted && "text-[#71717A] dark:text-[#666]",
                    isFuture    && "text-[#A1A1AA] dark:text-[#444]"
                  )}
                >
                  {STEP_LABELS[stepKey]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
