"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OcrFieldInput } from "./OcrFieldInput";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { step2Schema, type Step2Values } from "@/lib/validations/intake";

export function StepPersonalInfo() {
  const { state, ocrResult, updateFields, setStep } = useIntakeForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fullName: state.fullName,
      dateOfBirth: state.dateOfBirth,
      idNumber: state.idNumber,
      email: state.email,
      phone: state.phone,
      address: state.address,
    },
  });

  const isOcrFilled = (field: string) =>
    (ocrResult[field]?.confidence ?? 0) > 0;

  const onSubmit = (values: Step2Values) => {
    updateFields(values);
    setStep("details");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Personal information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review and confirm the details below. Fields marked{" "}
          <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            OCR
          </span>{" "}
          were extracted from your document.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name *</Label>
          <OcrFieldInput
            id="fullName"
            placeholder="Jane Smith"
            ocrFilled={isOcrFilled("fullName")}
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth">Date of birth *</Label>
          <OcrFieldInput
            id="dateOfBirth"
            type="date"
            ocrFilled={isOcrFilled("dateOfBirth")}
            aria-invalid={!!errors.dateOfBirth}
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="idNumber">ID / document number *</Label>
          <OcrFieldInput
            id="idNumber"
            placeholder="AB123456"
            ocrFilled={isOcrFilled("idNumber")}
            aria-invalid={!!errors.idNumber}
            {...register("idNumber")}
          />
          {errors.idNumber && (
            <p className="text-xs text-destructive">{errors.idNumber.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address *</Label>
          <OcrFieldInput
            id="email"
            type="email"
            placeholder="jane@example.com"
            ocrFilled={isOcrFilled("email")}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number *</Label>
          <OcrFieldInput
            id="phone"
            type="tel"
            placeholder="+1 555 0100"
            ocrFilled={isOcrFilled("phone")}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <OcrFieldInput
            id="address"
            placeholder="123 Main St, City, State 00000"
            ocrFilled={isOcrFilled("address")}
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={() => setStep("upload")}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
        <Button type="submit">
          Next
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </form>
  );
}
