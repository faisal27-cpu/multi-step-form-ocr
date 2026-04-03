"use client";

import { useContext } from "react";
import { IntakeFormContext } from "@/context/IntakeFormContext";

export function useIntakeForm() {
  const ctx = useContext(IntakeFormContext);
  if (!ctx) {
    throw new Error("useIntakeForm must be used inside <IntakeFormProvider>");
  }
  return ctx;
}
