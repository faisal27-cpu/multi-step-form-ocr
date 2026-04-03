"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { step3Schema, type Step3Values } from "@/lib/validations/intake";

const CATEGORIES = [
  { value: "employment", label: "Employment" },
  { value: "financial", label: "Financial" },
  { value: "medical", label: "Medical" },
  { value: "legal", label: "Legal" },
  { value: "other", label: "Other" },
] as const;

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Additional details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          A few more details to complete your submission.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="submissionCategory">Submission category *</Label>
          <Controller
            name="submissionCategory"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="submissionCategory" aria-invalid={!!errors.submissionCategory}>
                  <SelectValue placeholder="Select a category…" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.submissionCategory && (
            <p className="text-xs text-destructive">{errors.submissionCategory.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="referenceNumber">
            Reference number{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="referenceNumber"
            placeholder="REF-001"
            {...register("referenceNumber")}
          />
          {errors.referenceNumber && (
            <p className="text-xs text-destructive">{errors.referenceNumber.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">
            Notes{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="notes"
            placeholder="Any additional information…"
            rows={4}
            {...register("notes")}
          />
          <div className="flex justify-between items-center">
            {errors.notes ? (
              <p className="text-xs text-destructive">{errors.notes.message}</p>
            ) : (
              <span />
            )}
            <p className={`text-xs tabular-nums ${notesValue.length > 950 ? "text-destructive" : "text-muted-foreground"}`}>
              {notesValue.length}/1000
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={() => setStep("personal")}>
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
