"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WEBP images are accepted. PDFs are not supported.";
  }
  if (file.size > MAX_SIZE) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 10 MB.`;
  }
  return null;
}

type OcrStatus = "idle" | "loading" | "success" | "error";

interface Props {
  onFile: (file: File) => void;
  onClear?: () => void;
  isLoading: boolean;
  ocrStatus?: OcrStatus;
  ocrProgress?: number;
  error?: string;
}

export function DocumentDropZone({
  onFile,
  onClear,
  isLoading,
  ocrStatus = "idle",
  ocrProgress = 0,
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<{ name: string; size: string; url: string } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError ?? error ?? null;

  const handleFile = useCallback(
    (file: File) => {
      const err = validateFile(file);
      if (err) {
        setLocalError(err);
        setPreview(null);
        return;
      }
      setLocalError(null);
      const url = URL.createObjectURL(file);
      setPreview({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        url,
      });
      onFile(file);
    },
    [onFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setLocalError(null);
    onClear?.();
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onInputChange}
        disabled={isLoading}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); if (!isLoading) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative w-full rounded-2xl transition-all duration-200 overflow-hidden",
          !preview && !isLoading && "cursor-pointer",
          displayError && !dragging
            ? "border-2 border-red-300 dark:border-red-800 bg-red-50/50"
            : dragging
              ? "border-2 border-orange-500 bg-[#FFF7ED] scale-[1.01]"
              : "border-2 border-dashed border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D]"
        )}
        onClick={() => !isLoading && !preview && inputRef.current?.click()}
      >
        {/* Scanning state */}
        {isLoading && preview && (
          <div className="p-8 space-y-5">
            <div className="flex items-center gap-4">
              <img
                src={preview.url}
                alt=""
                className="w-14 h-14 object-cover rounded-lg border border-[#E4E4E7] dark:border-[#2A2A2A] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0A0A0A] dark:text-white mb-0.5">
                  Reading your document...
                </p>
                <p className="text-[12px] text-[#A1A1AA]">Extracting fields with Tesseract.js</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-1.5 bg-[#F4F4F5] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(ocrProgress, 4)}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-[12px] text-[#A1A1AA] tabular-nums">{Math.round(ocrProgress)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* File selected (not loading) */}
        {!isLoading && preview && (
          <div className="p-6 flex items-start gap-4">
            <img
              src={preview.url}
              alt="Document preview"
              className="w-[120px] h-[120px] object-cover rounded-lg border border-[#E4E4E7] dark:border-[#2A2A2A] shrink-0"
            />
            <div className="flex-1 min-w-0 pt-1 space-y-2">
              <div className={cn(
                "inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full",
                ocrStatus === "success"
                  ? "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400"
                  : ocrStatus === "error"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400"
                    : "bg-[#F4F4F5] text-[#71717A]"
              )}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {ocrStatus === "success"
                  ? "Scanned successfully"
                  : ocrStatus === "error"
                    ? "Ready — manual entry"
                    : "Ready to scan"}
              </div>
              <p className="text-[14px] font-semibold text-[#0A0A0A] dark:text-white truncate">
                {preview.name}
              </p>
              <p className="text-[12px] text-[#71717A]">{preview.size}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearPreview(); }}
                className="text-[12px] font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Change file
              </button>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearPreview(); }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#1A1A1A] transition-colors shrink-0"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Empty state */}
        {!preview && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-12 px-8 gap-5">
            <div className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
              dragging ? "bg-orange-500" : "bg-[#0F0F0F] dark:bg-[#1A1A1A]"
            )}>
              <Upload className="w-7 h-7 text-orange-400" />
            </div>

            <div className="space-y-1.5">
              <p className="text-[20px] font-bold text-[#0A0A0A] dark:text-white leading-tight">
                {dragging ? "Release to upload" : "Drop your document here"}
              </p>
              <p className="text-[14px] text-[#71717A] dark:text-[#A1A1AA]">
                JPEG, PNG or WEBP · Max 10 MB
              </p>
            </div>

            <div className="flex items-center gap-3 w-full max-w-[200px]">
              <div className="flex-1 h-px bg-[#E4E4E7] dark:bg-[#2A2A2A]" />
              <span className="text-[12px] font-medium text-[#A1A1AA]">or</span>
              <div className="flex-1 h-px bg-[#E4E4E7] dark:bg-[#2A2A2A]" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-semibold rounded-md transition-colors"
              >
                Browse files
              </button>
              <p className="text-[12px] text-[#A1A1AA]">Images only — PDFs not supported yet</p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-[13px] text-red-600 dark:text-red-400 flex items-start gap-1.5">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0 mt-1.5" />
          {displayError}
        </p>
      )}
    </div>
  );
}
