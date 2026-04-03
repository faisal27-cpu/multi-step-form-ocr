"use client";

import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type OcrStatus = "idle" | "loading" | "success" | "error";

interface Props {
  status: OcrStatus;
  progress?: number;
}

export function OcrStatusBanner({ status, progress = 0 }: Props) {
  if (status === "idle") return null;

  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm transition-all duration-300",
        status === "loading" && "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
        status === "success" && "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
        status === "error" && "border-destructive/30 bg-destructive/10 text-destructive"
      )}
    >
      {status === "loading" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span className="font-medium">Reading document…</span>
            <span className="ml-auto tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">Fields pre-filled from document</span>
          <span className="ml-1 text-green-700 dark:text-green-300">— please verify the values below.</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">Could not read document.</span>
          <span className="ml-1">Please enter your details manually.</span>
        </div>
      )}
    </div>
  );
}
