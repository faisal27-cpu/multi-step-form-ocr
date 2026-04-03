"use client";

import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OcrFieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ocrFilled?: boolean;
}

const OcrFieldInput = forwardRef<HTMLInputElement, OcrFieldInputProps>(
  ({ ocrFilled = false, className, onChange, ...props }, ref) => {
    const [userEdited, setUserEdited] = useState(false);
    const showOcrBadge = ocrFilled && !userEdited;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserEdited(true);
      onChange?.(e);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          onChange={handleChange}
          className={cn(
            showOcrBadge && "border-l-4 border-l-blue-400 pl-3",
            className
          )}
          {...props}
        />
        {showOcrBadge && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 pointer-events-none select-none">
            OCR
          </span>
        )}
      </div>
    );
  }
);

OcrFieldInput.displayName = "OcrFieldInput";

export { OcrFieldInput };
