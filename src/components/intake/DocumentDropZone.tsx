"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileImage, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WEBP images are accepted. PDFs are not supported.";
  }
  if (file.size > MAX_SIZE) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 10 MB.`;
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
    // Reset input so the same file can be re-selected after removal
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
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !isLoading && !preview && inputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200",
          !preview && !isLoading && "cursor-pointer hover:border-primary/60 hover:bg-primary/5",
          dragging && "border-primary bg-primary/10 scale-[1.01]",
          !dragging && !displayError && "border-border",
          displayError && "border-destructive/60 bg-destructive/5",
          isLoading && "opacity-60 pointer-events-none"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={onInputChange}
          disabled={isLoading}
        />

        {preview ? (
          <div className="flex items-start gap-4 w-full">
            <img
              src={preview.url}
              alt="Document preview"
              className="w-16 h-16 object-cover rounded-lg border border-border shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{preview.name}</p>
              <p className="text-xs text-muted-foreground">{preview.size}</p>
            </div>
            {!isLoading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearPreview(); }}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <FileImage className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop your document here, or{" "}
                <span className="text-primary underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, or WEBP · Max 10 MB
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Images only — PDFs not supported</span>
            </div>
          </>
        )}
      </div>

      {displayError && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 rounded-full bg-destructive shrink-0" />
          {displayError}
        </p>
      )}

      {!preview && !displayError && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
        >
          Select file
        </Button>
      )}
    </div>
  );
}
