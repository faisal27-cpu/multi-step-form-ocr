"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { OcrFieldInput, type FieldValidState } from "./OcrFieldInput";
import { StepNav, type SaveState } from "./StepNav";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { step2Schema, type Step2Values } from "@/lib/validations/intake";

function FieldLabel({ htmlFor, children, ocrFilled }: {
  htmlFor: string;
  children: React.ReactNode;
  ocrFilled?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-2 text-[13px] font-medium text-[#3F3F46] dark:text-[#A1A1AA] mb-1.5"
    >
      {children}
      {ocrFilled && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 leading-none">
          Auto-filled
        </span>
      )}
    </label>
  );
}

export function StepPersonalInfo() {
  const { state, ocrResult, updateFields, setStep } = useIntakeForm();
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName:    state.fullName,
      dateOfBirth: state.dateOfBirth,
      idNumber:    state.idNumber,
      email:       state.email,
      phone:       state.phone,
      address:     state.address,
    },
  });

  const isOcrFilled = (field: string) => (ocrResult[field]?.confidence ?? 0) > 0;
  const hasAnyOcrData = Object.values(ocrResult).some((f) => f.confidence > 0);

  /** Derive per-field valid/invalid/default state from RHF touchedFields + errors */
  const fieldState = (name: keyof Step2Values): FieldValidState => {
    if (!touchedFields[name]) return "default";
    if (errors[name]) return "invalid";
    return "valid";
  };

  const onSubmit = async (values: Step2Values) => {
    setSaveState("saving");
    updateFields(values);
    // Give React one tick to render "Saving…" before transitioning to "Saved ✓"
    await new Promise<void>((r) => setTimeout(r, 80));
    setSaveState("saved");
    await new Promise<void>((r) => setTimeout(r, 500));
    setStep("details");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-hero text-[24px] font-bold text-[#0A0A0A] dark:text-white tracking-tight">
          Your information
        </h2>
        <p className="text-[15px] text-[#71717A] dark:text-[#A1A1AA] mt-1.5">
          Review and confirm the details from your document.
        </p>
      </div>

      {/* OCR auto-fill banner */}
      {hasAnyOcrData && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50">
          <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-orange-700 dark:text-orange-300 leading-relaxed">
            We auto-filled some fields from your document — review and correct as needed.
          </p>
        </div>
      )}

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel htmlFor="fullName" ocrFilled={isOcrFilled("fullName")}>Full name *</FieldLabel>
          <OcrFieldInput
            id="fullName"
            placeholder="Jane Smith"
            ocrFilled={isOcrFilled("fullName")}
            fieldState={fieldState("fullName")}
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-[12px] text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="dateOfBirth" ocrFilled={isOcrFilled("dateOfBirth")}>Date of birth *</FieldLabel>
          <OcrFieldInput
            id="dateOfBirth"
            type="date"
            ocrFilled={isOcrFilled("dateOfBirth")}
            fieldState={fieldState("dateOfBirth")}
            aria-invalid={!!errors.dateOfBirth}
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && (
            <p className="text-[12px] text-red-500 mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="idNumber" ocrFilled={isOcrFilled("idNumber")}>ID / document number *</FieldLabel>
          <OcrFieldInput
            id="idNumber"
            placeholder="AB123456"
            ocrFilled={isOcrFilled("idNumber")}
            fieldState={fieldState("idNumber")}
            aria-invalid={!!errors.idNumber}
            {...register("idNumber")}
          />
          {errors.idNumber && (
            <p className="text-[12px] text-red-500 mt-1">{errors.idNumber.message}</p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="email" ocrFilled={isOcrFilled("email")}>Email address *</FieldLabel>
          <OcrFieldInput
            id="email"
            type="email"
            placeholder="jane@example.com"
            ocrFilled={isOcrFilled("email")}
            fieldState={fieldState("email")}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-[12px] text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="phone" ocrFilled={isOcrFilled("phone")}>Phone number *</FieldLabel>
          <OcrFieldInput
            id="phone"
            type="tel"
            placeholder="+1 555 0100"
            ocrFilled={isOcrFilled("phone")}
            fieldState={fieldState("phone")}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-[12px] text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <FieldLabel htmlFor="address" ocrFilled={isOcrFilled("address")}>Address *</FieldLabel>
          <OcrFieldInput
            id="address"
            placeholder="123 Main St, City, State 00000"
            ocrFilled={isOcrFilled("address")}
            fieldState={fieldState("address")}
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-[12px] text-red-500 mt-1">{errors.address.message}</p>
          )}
        </div>
      </div>

      <StepNav
        onBack={() => setStep("upload")}
        continueLabel="Continue to Details →"
        continueType="submit"
        saveState={saveState}
      />
    </form>
  );
}
