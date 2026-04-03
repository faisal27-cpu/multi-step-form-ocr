"use client";

import { useState } from "react";
import { ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
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

    // Run upload and OCR in parallel
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
      // Dynamic import keeps Tesseract out of the server bundle
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
      <div>
        <h2 className="text-lg font-semibold">Upload your document</h2>
        <p className="text-sm text-muted-foreground mt-1">
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

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSkipOcr}
          disabled={processing}
          className="text-muted-foreground"
        >
          <SkipForward className="w-4 h-4 mr-1.5" />
          Skip OCR — enter manually
        </Button>

        <Button
          type="button"
          onClick={() => setStep("personal")}
          disabled={!canAdvance || processing}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
