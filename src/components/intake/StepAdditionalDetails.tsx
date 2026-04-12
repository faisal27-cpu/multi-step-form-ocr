"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  DollarSign,
  HeartPulse,
  Scale,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StepNav, type SaveState } from "./StepNav";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { step3Schema, type Step3Values } from "@/lib/validations/intake";

const CATEGORIES = [
  { value: "employment", label: "Employment", Icon: Briefcase      },
  { value: "financial",  label: "Finance",    Icon: DollarSign     },
  { value: "medical",    label: "Medical",    Icon: HeartPulse     },
  { value: "legal",      label: "Legal",      Icon: Scale          },
  { value: "other",      label: "Other",      Icon: MoreHorizontal },
] as const;

const inputBase =
  "w-full rounded-lg px-4 text-[14px] text-[#0A0A0A] dark:text-white bg-white dark:bg-[#111] border border-[#E4E4E7] dark:border-[#2A2A2A] placeholder:text-[#A1A1AA] outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-150";

export function StepAdditionalDetails() {
  const { state, updateFields, setStep } = useIntakeForm();
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      submissionCategory: state.submissionCategory as Step3Values["submissionCategory"] || undefined,
      referenceNumber: state.referenceNumber,
      notes: state.notes,
    },
  });

  const notesValue = watch("notes") ?? "";

  /** Border-left state for plain inputs (not OcrFieldInput) */
  const inputFieldClass = (name: keyof Pick<Step3Values, "referenceNumber" | "notes">, hasValue: boolean) => {
    if (!touchedFields[name]) return "";
    if (errors[name]) return "border-l-[3px] border-l-red-500";
    if (hasValue) return "border-l-[3px] border-l-green-500 bg-green-50/30 dark:bg-green-950/10";
    return "";
  };

  const onSubmit = async (values: Step3Values) => {
    setSaveState("saving");
    updateFields(values);
    await new Promise<void>((r) => setTimeout(r, 80));
    setSaveState("saved");
    await new Promise<void>((r) => setTimeout(r, 500));
    setStep("review");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-hero text-[24px] font-bold text-[#0A0A0A] dark:text-white tracking-tight">
          Additional details
        </h2>
        <p className="text-[15px] text-[#71717A] dark:text-[#A1A1AA] mt-1.5">
          A few more details to complete your submission.
        </p>
      </div>

      <div className="space-y-6">
        {/* Category cards */}
        <div>
          <label className="block text-[13px] font-medium text-[#3F3F46] dark:text-[#A1A1AA] mb-3">
            Submission category *
          </label>
          <Controller
            name="submissionCategory"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map(({ value, label, Icon }) => {
                  const selected = field.value === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={cn(
                        "flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-150 min-h-[44px]",
                        selected
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                          : "border-[#E4E4E7] dark:border-[#2A2A2A] hover:border-[#D4D4D8] dark:hover:border-[#3A3A3A] bg-white dark:bg-[#111]"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                        selected ? "bg-orange-500" : "bg-[#F4F4F5] dark:bg-[#1A1A1A]"
                      )}>
                        <Icon className={cn(
                          "w-4 h-4",
                          selected ? "text-white" : "text-[#71717A] dark:text-[#A1A1AA]"
                        )} />
                      </div>
                      <span className={cn(
                        "text-[13px] font-medium",
                        selected ? "text-orange-600 dark:text-orange-400" : "text-[#3F3F46] dark:text-[#A1A1AA]"
                      )}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.submissionCategory && (
            <p className="text-[12px] text-red-500 mt-2">{errors.submissionCategory.message}</p>
          )}
        </div>

        {/* Reference number */}
        <div>
          <label
            htmlFor="referenceNumber"
            className="block text-[13px] font-medium text-[#3F3F46] dark:text-[#A1A1AA] mb-1.5"
          >
            Reference number{" "}
            <span className="font-normal text-[#A1A1AA]">(optional)</span>
          </label>
          <input
            id="referenceNumber"
            placeholder="REF-001"
            className={cn(`${inputBase} h-11`, inputFieldClass("referenceNumber", !!watch("referenceNumber")))}
            {...register("referenceNumber")}
          />
          {errors.referenceNumber && (
            <p className="text-[12px] text-red-500 mt-1">{errors.referenceNumber.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-[13px] font-medium text-[#3F3F46] dark:text-[#A1A1AA] mb-1.5"
          >
            Notes{" "}
            <span className="font-normal text-[#A1A1AA]">(optional)</span>
          </label>
          <textarea
            id="notes"
            placeholder="Any additional information…"
            rows={4}
            className={cn(`${inputBase} py-3 resize-none`, inputFieldClass("notes", !!notesValue))}
            {...register("notes")}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.notes ? (
              <p className="text-[12px] text-red-500">{errors.notes.message}</p>
            ) : (
              <span />
            )}
            <p className={`text-[12px] tabular-nums ${notesValue.length > 950 ? "text-red-500" : "text-[#A1A1AA]"}`}>
              {notesValue.length}/1000
            </p>
          </div>
        </div>
      </div>

      <StepNav
        onBack={() => setStep("personal")}
        continueLabel="Continue to Review →"
        continueType="submit"
        saveState={saveState}
      />
    </form>
  );
}
