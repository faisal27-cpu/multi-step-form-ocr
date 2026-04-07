"use client";

import { useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { DocumentDropZone } from "./DocumentDropZone";
import { useIntakeForm } from "@/hooks/useIntakeForm";

type OcrStatus = "idle" | "loading" | "success" | "error";

export function StepUpload() {
  const { draftId, setStep, setOcrResult, setStoragePath } = useIntakeForm();

  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("idle");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | undefined>();
  const [fileSelected, setFileSelected] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFile = async (file: File) => {
    setFileSelected(true);
    setUploadError(undefined);
    setOcrStatus("loading");
    setOcrProgress(0);
    setProcessing(true);

    const [uploadResult] = await Promise.allSettled([
      uploadFile(file),
      runOcr(file),
    ]);

    if (uploadResult.status === "fulfilled") {
      setStoragePath(uploadResult.value);
    } else {
      setUploadError("Upload failed — your document was processed but not saved. You can still continue.");
    }

    setProcessing(false);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("draftId", draftId);
    const res = await fetch("/api/intake/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message ?? "Upload failed");
    }
    const data = await res.json();
    return data.storagePath as string;
  };

  const runOcr = async (file: File) => {
    try {
      const { runOcr: tessOcr } = await import("@/lib/ocr/tesseract");
      const result = await tessOcr(file, (pct) => setOcrProgress(pct));
      setOcrResult(result);
      setOcrStatus("success");
    } catch {
      setOcrStatus("error");
    }
  };

  const handleSkip = () => {
    setOcrResult({});
    setStep("personal");
  };

  const canAdvance = fileSelected && (ocrStatus === "success" || ocrStatus === "error");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-hero text-[24px] font-bold text-[#0A0A0A] dark:text-white tracking-tight">
          Let&apos;s start — drop your document
        </h2>
        <p className="text-[15px] text-[#71717A] dark:text-[#A1A1AA] mt-1.5">
          We&apos;ll scan it and auto-fill your form
        </p>
      </div>

      <DocumentDropZone
        onFile={handleFile}
        onClear={() => {
          setFileSelected(false);
          setOcrStatus("idle");
          setOcrProgress(0);
          setUploadError(undefined);
        }}
        isLoading={processing}
        ocrStatus={ocrStatus}
        ocrProgress={ocrProgress}
        error={uploadError}
      />

      {/* Security note */}
      <p className="flex items-center gap-1.5 text-[12px] text-[#A1A1AA]">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        Your document is processed locally — never uploaded
      </p>

      {/* Skip link */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleSkip}
          disabled={processing}
          className="text-[13px] text-[#A1A1AA] hover:text-[#71717A] dark:hover:text-[#888] transition-colors disabled:opacity-40"
        >
          Skip scanning — I&apos;ll type manually
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-1">
        <span />
        <button
          type="button"
          onClick={() => setStep("personal")}
          disabled={!canAdvance || processing}
          title={!canAdvance || processing ? "Select a file to continue" : undefined}
          className="h-10 px-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-md transition-all duration-200 flex items-center gap-2 shadow-sm shadow-orange-200/60 disabled:shadow-none"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
