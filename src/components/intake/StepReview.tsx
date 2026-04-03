"use client";

import { useState } from "react";
import { ArrowLeft, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { toast } from "sonner";

function formatDate(raw: string): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

const CATEGORY_LABELS: Record<string, string> = {
  employment: "Employment",
  financial: "Financial",
  medical: "Medical",
  legal: "Legal",
  other: "Other",
};

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 py-1.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{value || "—"}</dd>
    </div>
  );
}

export function StepReview() {
  const { state, draftId, storagePath, ocrResult, setStep, setSubmissionId } = useIntakeForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    // Duplicate submission guard
    const guardKey = `submitted_${draftId}`;
    if (sessionStorage.getItem(guardKey)) {
      toast.error("This form has already been submitted.");
      setSubmitting(false);
      return;
    }

    try {
      const ocrRaw = Object.values(ocrResult)
        .map((f) => f.value)
        .join(" ");
      const ocrConfidence = Object.fromEntries(
        Object.entries(ocrResult).map(([k, v]) => [k, v.confidence])
      );

      const res = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId,
          documentType: "document",
          storagePath: storagePath ?? "",
          ocrRaw,
          ocrConfidence,
          formData: state,
        }),
      });

      if (res.status === 401) {
        window.location.href = `/auth/login?next=/dashboard/intake/new`;
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Submission failed");
      }

      const data = await res.json();
      sessionStorage.setItem(guardKey, "1");
      setSubmissionId(data.submissionId);

      // Trigger PDF download immediately
      if (data.pdfSignedUrl) {
        const a = document.createElement("a");
        a.href = data.pdfSignedUrl;
        a.download = `intake-${data.submissionId}.pdf`;
        a.click();
      }

      setStep("success");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review your submission</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Check all details before submitting. Click a section to edit.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Personal information</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep("personal")}
            className="h-7 px-2 text-xs"
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl>
            <ReviewRow label="Full name" value={state.fullName} />
            <Separator className="my-0.5" />
            <ReviewRow label="Date of birth" value={formatDate(state.dateOfBirth)} />
            <Separator className="my-0.5" />
            <ReviewRow label="ID / document number" value={state.idNumber} />
            <Separator className="my-0.5" />
            <ReviewRow label="Email" value={state.email} />
            <Separator className="my-0.5" />
            <ReviewRow label="Phone" value={state.phone} />
            <Separator className="my-0.5" />
            <ReviewRow label="Address" value={state.address} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Additional details</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep("details")}
            className="h-7 px-2 text-xs"
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl>
            <ReviewRow
              label="Category"
              value={CATEGORY_LABELS[state.submissionCategory] ?? state.submissionCategory}
            />
            <Separator className="my-0.5" />
            <ReviewRow label="Reference number" value={state.referenceNumber} />
            <Separator className="my-0.5" />
            <ReviewRow label="Notes" value={state.notes} />
          </dl>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={() => setStep("details")} disabled={submitting}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
