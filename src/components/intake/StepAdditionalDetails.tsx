"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { step3Schema, type Step3Values } from "@/lib/validations/intake";

const CATEGORIES = [
  { value: "employment", label: "Employment" },
  { value: "financial",  label: "Financial"  },
  { value: "medical",    label: "Medical"    },
  { value: "legal",      label: "Legal"      },
  { value: "other",      label: "Other"      },
] as const;

const fieldBase =
  "w-full rounded-md px-4 text-[14px] text-[#0A0A0A] dark:text-white bg-[#F4F4F5] dark:bg-[#1A1A1A] border border-transparent placeholder:text-[#A1A1AA] outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/60 transition-all duration-150";

export function StepAdditionalDetails() {
  const { state, updateFields, setStep } = useIntakeForm();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      submissionCategory: state.submissionCategory as Step3Values["submissionCategory"] || undefined,
      referenceNumber: state.referenceNumber,
      notes: state.notes,
    },
  });

  const notesValue = watch("notes") ?? "";

  const onSubmit = (values: Step3Values) => {
    updateFields(values);
    setStep("review");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-[#111] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A2A] p-8 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-[18px] font-bold text-[#0A0A0A] dark:text-white">Additional details</h2>
        <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA] mt-1">
          A few more details to complete your submission.
        </p>
      </div>

      <div className="space-y-5">
        {/* Category */}
        <div>
          <label
            htmlFor="submissionCategory"
            className="block text-[13px] font-medium text-[#3F3F46] dark:text-[#A1A1AA] mb-1.5"
          >
            Submission category *
          </label>
          <Controller
            name="submissionCategory"
            control={control}
            render={({ field }) => (
              <select
                id="submissionCategory"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || undefined)}
                className={`${fieldBase} h-11 appearance-none cursor-pointer`}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: "36px" }}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            )}
          />
          {errors.submissionCategory && (
            <p className="text-[12px] text-red-500 mt-1">{errors.submissionCategory.message}</p>
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
            className={`${fieldBase} h-11`}
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
            className={`${fieldBase} py-3 resize-none`}
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

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep("personal")}
          className="h-10 px-5 border border-[#E4E4E7] dark:border-[#2A2A2A] text-[#3F3F46] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#1A1A1A] text-[14px] font-medium rounded-md transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="submit"
          className="h-10 px-6 bg-orange-500 hover:bg-orange-600 text-white text-[14px] font-semibold rounded-md transition-colors flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
