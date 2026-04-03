"use client";

import { CheckCircle2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PdfDownloadButton } from "./PdfDownloadButton";
import { useIntakeForm } from "@/hooks/useIntakeForm";

export function StepSuccess() {
  const { submissionId, resetForm } = useIntakeForm();
  const router = useRouter();

  const handleNewSubmission = () => {
    resetForm();
    router.push("/dashboard/intake/new?step=upload");
  };

  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Submission complete</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your intake form has been submitted successfully. Your PDF summary has started downloading.
        </p>
        {submissionId && (
          <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded inline-block">
            ID: {submissionId}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {submissionId && (
          <PdfDownloadButton submissionId={submissionId} label="Download again" />
        )}
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
        <Button onClick={handleNewSubmission}>
          <PlusCircle className="w-4 h-4 mr-1.5" />
          New submission
        </Button>
      </div>
    </div>
  );
}
