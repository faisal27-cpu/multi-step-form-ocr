"use client";

import { Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IntakeFormProvider } from "@/context/IntakeFormContext";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { IntakeLeftPanel } from "./IntakeLeftPanel";
import { StepUpload } from "./StepUpload";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepAdditionalDetails } from "./StepAdditionalDetails";
import { StepReview } from "./StepReview";
import { StepSuccess } from "./StepSuccess";
import { Skeleton } from "@/components/ui/skeleton";

function IntakeFormInner() {
  const { step } = useIntakeForm();

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
      {/* Left panel — sticky sidebar (flex child must carry sticky + self-start) */}
      <div className="hidden lg:flex flex-col w-[38%] shrink-0 sticky top-0 self-start h-screen">
        <IntakeLeftPanel currentStep={step} />
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-white dark:bg-[#0A0A0A]">
        <div className="w-full max-w-[560px] mx-auto px-6 lg:px-10 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
      <div className="hidden lg:block w-[38%] bg-[#0F0F0F] shrink-0" />
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
