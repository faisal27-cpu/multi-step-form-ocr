"use client";

import { forwardRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type FieldValidState = "default" | "valid" | "invalid";

interface OcrFieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ocrFilled?: boolean;
  fieldState?: FieldValidState;
}

const OcrFieldInput = forwardRef<HTMLInputElement, OcrFieldInputProps>(
  ({ ocrFilled = false, fieldState = "default", className, onChange, ...props }, ref) => {
    const [userEdited, setUserEdited] = useState(false);
    const showOcrHighlight = ocrFilled && !userEdited;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserEdited(true);
      onChange?.(e);
    };

    const isValid   = fieldState === "valid";
    const isInvalid = fieldState === "invalid";

    return (
      <div className="relative">
        <input
          ref={ref}
          onChange={handleChange}
          className={cn(
            "w-full h-11 rounded-lg px-4 text-[14px] text-[#0A0A0A] dark:text-white",
            "bg-white dark:bg-[#111]",
            "border border-[#E4E4E7] dark:border-[#2A2A2A]",
            "placeholder:text-[#A1A1AA]",
            "outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500",
            "transition-all duration-150",
            // OCR pre-fill highlight
            showOcrHighlight && "border-orange-300 bg-orange-50/60 dark:border-orange-800 dark:bg-orange-950/20",
            // Valid state: green left border + subtle green tint + right padding for icon
            isValid && "border-l-[3px] border-l-green-500 bg-green-50/30 dark:bg-green-950/10 pr-10",
            // Invalid state: red left border
            isInvalid && "border-l-[3px] border-l-red-500",
            className
          )}
          {...props}
        />
        {isValid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Check className="w-4 h-4 text-green-500" strokeWidth={2.5} />
          </span>
        )}
      </div>
    );
  }
);

OcrFieldInput.displayName = "OcrFieldInput";

export { OcrFieldInput };
