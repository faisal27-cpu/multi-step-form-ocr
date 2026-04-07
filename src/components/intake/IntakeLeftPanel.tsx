"use client";

import { ScanText, Check, Upload, User, FileText, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormStep } from "@/types/intake";

const STEPS = [
  { key: "upload"   as FormStep, label: "Upload document",    description: "Drop or browse your file",  Icon: Upload         },
  { key: "personal" as FormStep, label: "Your information",   description: "Review extracted details",  Icon: User           },
  { key: "details"  as FormStep, label: "Additional details", description: "Category and notes",        Icon: FileText       },
  { key: "review"   as FormStep, label: "Review & submit",    description: "Confirm and generate PDF",  Icon: ClipboardCheck },
];

const STEP_ORDER: FormStep[] = ["upload", "personal", "details", "review", "success"];

const STEP_INFO: Partial<Record<FormStep, { title: string; desc: string }>> = {
  upload:   { title: "Upload your document",  desc: "We'll scan it and auto-fill your form" },
  personal: { title: "Your information",      desc: "Review and confirm the extracted details" },
  details:  { title: "Additional details",    desc: "A few more details to complete your submission" },
  review:   { title: "Review & submit",       desc: "Everything look right? Submit to generate your PDF" },
  success:  { title: "Submission complete",   desc: "Your form has been submitted successfully" },
};

export function IntakeLeftPanel({ currentStep }: { currentStep: FormStep }) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const info = STEP_INFO[currentStep] ?? STEP_INFO.upload!;
  const stepNum = Math.min(currentIndex + 1, 4);

  return (
    <div className="flex flex-col h-full bg-[#0F0F0F] px-10 pt-10 pb-8 justify-between overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-8 h-8 rounded-[8px] bg-orange-500 flex items-center justify-center">
            <ScanText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[16px] tracking-tight text-white">AUSH Relay</span>
        </div>

        {/* Current step info */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-500 mb-2">
            Step {stepNum} of 4
          </p>
          <h2 className="text-[22px] font-bold text-white leading-tight mb-2">{info.title}</h2>
          <p className="text-[14px] text-[#666] leading-relaxed">{info.desc}</p>
        </div>

        {/* Step list */}
        <div className="space-y-0.5">
          {STEPS.map((step) => {
            const stepIndex = STEP_ORDER.indexOf(step.key);
            const isCompleted = stepIndex < currentIndex;
            const isCurrent = stepIndex === currentIndex;

            return (
              <div
                key={step.key}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  isCurrent && "bg-white/[0.05]"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  (isCompleted || isCurrent) ? "bg-orange-500" : "bg-white/[0.08]"
                )}>
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  ) : (
                    <step.Icon className={cn(
                      "w-3.5 h-3.5",
                      isCurrent ? "text-white" : "text-white/30"
                    )} />
                  )}
                </div>
                <div>
                  <p className={cn(
                    "text-[13px] font-medium leading-none",
                    isCurrent && "text-white",
                    isCompleted && "text-white/50",
                    !isCompleted && !isCurrent && "text-white/25"
                  )}>
                    {step.label}
                  </p>
                  <p className={cn(
                    "text-[11px] mt-0.5",
                    isCurrent ? "text-white/40" : "text-white/15"
                  )}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom badges */}
      <div className="space-y-1.5 mt-8">
        <p className="text-[12px] text-[#555] flex items-center gap-1.5">
          <span>🔒</span>
          Your document never leaves your browser
        </p>
        <p className="text-[11px] text-[#3A3A3A]">Powered by Tesseract.js</p>
      </div>
    </div>
  );
}
