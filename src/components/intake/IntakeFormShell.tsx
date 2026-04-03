"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { IntakeFormProvider } from "@/context/IntakeFormContext";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { StepIndicator } from "./StepIndicator";
import { StepUpload } from "./StepUpload";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepAdditionalDetails } from "./StepAdditionalDetails";
import { StepReview } from "./StepReview";
import { StepSuccess } from "./StepSuccess";
import { Skeleton } from "@/components/ui/skeleton";

// Inner component — consumes context (must be inside the provider)
function IntakeFormInner() {
  const { step } = useIntakeForm();
  const router = useRouter();

  // Global 401 handler is embedded in StepReview's submit; per-fetch handlers cover other routes.
  // For future: wrap fetch calls here if needed.

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
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {step !== "success" && <StepIndicator currentStep={step} />}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {renderStep()}
      </div>
    </div>
  );
}

function ShellFallback() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

// Outer component — provides context. useSearchParams requires Suspense boundary.
export function IntakeFormShell() {
  return (
    <Suspense fallback={<ShellFallback />}>
      <IntakeFormProvider>
        <IntakeFormInner />
      </IntakeFormProvider>
    </Suspense>
  );
}
