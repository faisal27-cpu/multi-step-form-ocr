"use client";

import { Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IntakeFormProvider } from "@/context/IntakeFormContext";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { StepIndicator } from "./StepIndicator";
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
    <div className="w-full max-w-[680px] mx-auto space-y-8">
      {step !== "success" && <StepIndicator currentStep={step} />}
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
  );
}

function ShellFallback() {
  return (
    <div className="w-full max-w-[680px] mx-auto space-y-8">
      <Skeleton className="h-14 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
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
