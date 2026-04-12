"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
  financial:  "Finance",
  medical:    "Medical",
  legal:      "Legal",
  other:      "Other",
};

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#A1A1AA]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-[13px] font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          Edit →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pb-6 border-b border-[#F4F4F5] dark:border-[#1A1A1A]">
        {children}
      </div>
    </div>
  );
}

function ReviewField({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-medium text-[#A1A1AA] dark:text-[#666] mb-0.5">{label}</p>
      <p className="text-[14px] font-semibold text-[#0A0A0A] dark:text-white break-words">
        {value || "—"}
      </p>
    </div>
  );
}

export function StepReview() {
  const { state, draftId, storagePath, ocrResult, setStep, setSubmissionId } = useIntakeForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    const guardKey = `submitted_${draftId}`;
    if (sessionStorage.getItem(guardKey)) {
      toast.error("This form has already been submitted.");
      setSubmitting(false);
      return;
    }

    try {
      const ocrRaw = Object.values(ocrResult).map((f) => f.value).join(" ");
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
      {/* Header */}
      <div>
        <h2 className="font-hero text-[24px] font-bold text-[#0A0A0A] dark:text-white tracking-tight">
          Review your submission
        </h2>
        <p className="text-[15px] text-[#71717A] dark:text-[#A1A1AA] mt-1.5">
          Everything look right? Submit to generate your PDF.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <ReviewSection title="Personal information" onEdit={() => setStep("personal")}>
          <ReviewField label="Full name"          value={state.fullName}                />
          <ReviewField label="Date of birth"      value={formatDate(state.dateOfBirth)} />
          <ReviewField label="ID / document no."  value={state.idNumber}                />
          <ReviewField label="Email"              value={state.email}                   />
          <ReviewField label="Phone"              value={state.phone}                   />
          <ReviewField label="Address"            value={state.address}  fullWidth      />
        </ReviewSection>

        <ReviewSection title="Additional details" onEdit={() => setStep("details")}>
          <ReviewField label="Category"         value={CATEGORY_LABELS[state.submissionCategory] ?? state.submissionCategory} />
          <ReviewField label="Reference number" value={state.referenceNumber} />
          <ReviewField label="Notes"            value={state.notes} fullWidth />
        </ReviewSection>
      </div>

      {/* Submit */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full min-h-[44px] bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 px-6 py-3"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit My Intake Form"
          )}
        </button>
        <p className="text-center text-[12px] text-[#A1A1AA]">
          📄 A PDF will be saved to your account
        </p>
      </div>

      {/* Back */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => setStep("details")}
          disabled={submitting}
          className="flex items-center gap-1.5 text-[14px] font-medium text-[#71717A] hover:text-[#0A0A0A] dark:hover:text-white transition-colors disabled:opacity-40 min-h-[44px] min-w-[44px] px-2 -ml-2"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
