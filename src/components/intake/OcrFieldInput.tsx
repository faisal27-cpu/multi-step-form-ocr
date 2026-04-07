"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

interface OcrFieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ocrFilled?: boolean;
}

const OcrFieldInput = forwardRef<HTMLInputElement, OcrFieldInputProps>(
  ({ ocrFilled = false, className, onChange, ...props }, ref) => {
    const [userEdited, setUserEdited] = useState(false);
    const showOcrHighlight = ocrFilled && !userEdited;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserEdited(true);
      onChange?.(e);
    };

    return (
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
          showOcrHighlight && "border-orange-300 bg-orange-50/60 dark:border-orange-800 dark:bg-orange-950/20",
          className
        )}
        {...props}
      />
    );
  }
);

OcrFieldInput.displayName = "OcrFieldInput";

export { OcrFieldInput };
