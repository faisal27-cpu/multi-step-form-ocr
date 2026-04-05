"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OcrFieldInput } from "./OcrFieldInput";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
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

  const onSubmit = (values: Step2Values) => {
    updateFields(values);
    setStep("details");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-[#111] rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A2A] p-8 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-[18px] font-bold text-[#0A0A0A] dark:text-white">Personal information</h2>
        <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA] mt-1">
          Review and confirm the details extracted from your document.
        </p>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel htmlFor="fullName" ocrFilled={isOcrFilled("fullName")}>Full name *</FieldLabel>
          <OcrFieldInput
            id="fullName"
            placeholder="Jane Smith"
            ocrFilled={isOcrFilled("fullName")}
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
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-[12px] text-red-500 mt-1">{errors.address.message}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep("upload")}
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
