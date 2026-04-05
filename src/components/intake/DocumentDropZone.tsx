"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileImage, X, CheckCircle2 } from "lucide-react";
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

interface Props {
  onFile: (file: File) => void;
  onClear?: () => void;
  isLoading: boolean;
  error?: string;
}

export function DocumentDropZone({ onFile, onClear, isLoading, error }: Props) {
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

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative rounded-2xl border transition-all duration-200 overflow-hidden",
          !preview && !isLoading && "cursor-pointer",
          dragging
            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
            : displayError
              ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10"
              : "border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#111]",
          isLoading && "opacity-60 pointer-events-none"
        )}
        onClick={() => !isLoading && !preview && inputRef.current?.click()}
      >
        {preview ? (
          /* File selected state */
          <div className="p-6 flex items-start gap-4">
            <img
              src={preview.url}
              alt="Document preview"
              className="w-16 h-16 object-cover rounded-xl border border-[#E4E4E7] dark:border-[#2A2A2A] shrink-0"
            />
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <p className="text-[13px] font-semibold text-[#0A0A0A] dark:text-white truncate">
                  {preview.name}
                </p>
              </div>
              <p className="text-[12px] text-[#71717A]">{preview.size}</p>
            </div>
            {!isLoading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearPreview(); }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#1A1A1A] transition-colors shrink-0"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center text-center py-14 px-8 gap-4">
            {/* Icon */}
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
              dragging
                ? "bg-orange-100 dark:bg-orange-950/40"
                : "bg-[#FFF7ED] dark:bg-orange-950/20"
            )}>
              <Upload className="w-8 h-8 text-orange-500" />
            </div>

            {/* Text */}
            <div className="space-y-1.5">
              <p className="text-[15px] font-semibold text-[#0A0A0A] dark:text-white">
                {dragging ? "Release to upload" : "Drop your document here"}
              </p>
              <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA]">
                JPEG, PNG or WEBP · Max 10 MB · Images only
              </p>
            </div>

            {/* Select file button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="mt-1 w-full max-w-[200px] h-10 bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-semibold rounded-md transition-colors"
            >
              Select file
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {displayError && (
        <p className="text-[13px] text-red-600 dark:text-red-400 flex items-start gap-1.5">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0 mt-1.5" />
          {displayError}
        </p>
      )}
    </div>
  );
}
