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
          "w-full h-11 rounded-md px-4 text-[14px] text-[#0A0A0A] dark:text-white",
          "bg-[#F4F4F5] dark:bg-[#1A1A1A]",
          "border border-transparent",
          "placeholder:text-[#A1A1AA]",
          "outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60",
          "transition-all duration-150",
          showOcrHighlight && "border-l-2 border-l-orange-400 pl-3.5",
          className
        )}
        {...props}
      />
    );
  }
);

OcrFieldInput.displayName = "OcrFieldInput";

export { OcrFieldInput };
