"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, FileDown } from "lucide-react";
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
  financial:  "Financial",
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
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A2A] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[14px] font-semibold text-[#0A0A0A] dark:text-white">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-[13px] font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          Edit →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );
}

function ReviewField({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA] dark:text-[#666] mb-0.5">
        {label}
      </p>
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
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-[18px] font-bold text-[#0A0A0A] dark:text-white">Review your submission</h2>
        <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA] mt-1">
          Check all details before submitting. Click Edit to make changes.
        </p>
      </div>

      {/* Personal information */}
      <ReviewSection title="Personal information" onEdit={() => setStep("personal")}>
        <ReviewField label="Full name"           value={state.fullName}            />
        <ReviewField label="Date of birth"       value={formatDate(state.dateOfBirth)} />
        <ReviewField label="ID / document no."   value={state.idNumber}            />
        <ReviewField label="Email"               value={state.email}               />
        <ReviewField label="Phone"               value={state.phone}               />
        <ReviewField label="Address"             value={state.address} fullWidth   />
      </ReviewSection>

      {/* Additional details */}
      <ReviewSection title="Additional details" onEdit={() => setStep("details")}>
        <ReviewField label="Category"         value={CATEGORY_LABELS[state.submissionCategory] ?? state.submissionCategory} />
        <ReviewField label="Reference number" value={state.referenceNumber} />
        <ReviewField label="Notes"            value={state.notes} fullWidth />
      </ReviewSection>

      {/* Submit */}
      <div className="pt-2 space-y-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Submit &amp; Generate PDF
            </>
          )}
        </button>
        <p className="text-center text-[12px] text-[#A1A1AA]">
          A PDF will be generated and saved to your account
        </p>
      </div>

      {/* Back */}
      <div className="flex justify-start pt-1">
        <button
          type="button"
          onClick={() => setStep("details")}
          disabled={submitting}
          className="h-9 px-4 border border-[#E4E4E7] dark:border-[#2A2A2A] text-[#3F3F46] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#1A1A1A] text-[13px] font-medium rounded-md transition-colors flex items-center gap-2 disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>
    </div>
  );
}
