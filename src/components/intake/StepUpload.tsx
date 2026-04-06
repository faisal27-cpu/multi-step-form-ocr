"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { DocumentDropZone } from "./DocumentDropZone";
import { OcrStatusBanner } from "./OcrStatusBanner";
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
      const result = await tessOcr(file, (pct) => {
        setOcrProgress(pct);
      });
      setOcrResult(result);
      setOcrStatus("success");
    } catch {
      setOcrStatus("error");
    }
  };

  const handleSkipOcr = () => {
    setOcrResult({});
    setStep("personal");
  };

  const canAdvance = fileSelected && (ocrStatus === "success" || ocrStatus === "error");

  return (
    <div className="space-y-6">
      {/* Step header */}
      <div>
        <h2 className="font-hero text-[24px] font-bold text-[#0A0A0A] dark:text-white tracking-tight">
          Upload document
        </h2>
        <p className="text-[14px] text-[#71717A] dark:text-[#A1A1AA] mt-1">
          Upload a clear image of your ID, invoice, or form. We&apos;ll extract the text automatically.
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
        error={uploadError}
      />

      {ocrStatus !== "idle" && (
        <OcrStatusBanner status={ocrStatus} progress={ocrProgress} />
      )}

      {/* Skip link */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleSkipOcr}
          disabled={processing}
          className="text-[13px] text-[#A1A1AA] hover:text-[#71717A] dark:hover:text-[#888] transition-colors disabled:opacity-40"
        >
          Skip and enter details manually
        </button>
      </div>

      {/* Next button */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={() => setStep("personal")}
          disabled={!canAdvance || processing}
          className="h-10 px-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-md transition-all duration-200 flex items-center gap-2 shadow-sm shadow-orange-200/60 disabled:shadow-none"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
