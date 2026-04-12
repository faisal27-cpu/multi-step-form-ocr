"use client";

import { Suspense, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IntakeFormProvider } from "@/context/IntakeFormContext";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { IntakeLeftPanel } from "./IntakeLeftPanel";
import { StepIndicator } from "./StepIndicator";
import { StepUpload } from "./StepUpload";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepAdditionalDetails } from "./StepAdditionalDetails";
import { StepReview } from "./StepReview";
import { StepSuccess } from "./StepSuccess";
import { Skeleton } from "@/components/ui/skeleton";
import type { StepDirection } from "@/context/IntakeFormContext";

function buildVariants(prefersReduced: boolean | null) {
  return {
    enter: (dir: StepDirection) => ({
      opacity: 0,
      x: prefersReduced ? 0 : dir === "forward" ? 40 : -40,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: StepDirection) => ({
      opacity: 0,
      x: prefersReduced ? 0 : dir === "forward" ? -40 : 40,
    }),
  };
}

function IntakeFormInner() {
  const { step, direction } = useIntakeForm();
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top of the right panel (and window) on every step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [step]);

  const variants = buildVariants(prefersReducedMotion ?? false);

  const renderStep = () => {
    switch (step) {
      case "upload":   return <StepUpload />;
      case "personal": return <StepPersonalInfo />;
      case "details":  return <StepAdditionalDetails />;
      case "review":   return <StepReview />;
      case "success":  return <StepSuccess />;
      default:         return <StepUpload />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4px)]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[32%] shrink-0 sticky top-0 self-start h-screen">
        <IntakeLeftPanel currentStep={step} />
      </div>

      {/* Right panel */}
      <div
        ref={scrollRef}
        className="flex-1 bg-white dark:bg-[#0A0A0A] flex flex-col"
      >
        <div className="w-full max-w-[560px] mx-auto px-6 lg:px-10 py-10 pb-28 sm:pb-10">
          {/* Progress indicator — hidden on success */}
          {step !== "success" && (
            <div className="mb-8">
              <StepIndicator currentStep={step} />
            </div>
          )}

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ShellFallback() {
  return (
    <div className="flex min-h-[calc(100vh-4px)]">
      <div className="hidden lg:block w-[32%] bg-[#0F0F0F] shrink-0" />
      <div className="flex-1 bg-white dark:bg-[#0A0A0A] px-6 lg:px-10 py-10">
        <div className="max-w-[560px] space-y-6">
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-8 w-72 rounded" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function IntakeFormShell() {
  return (
    <Suspense fallback={<ShellFallback />}>
      <IntakeFormProvider>
        <IntakeFormInner />
      </IntakeFormProvider>
    </Suspense>
  );
}
