import type { Metadata } from "next";
import { IntakeFormShell } from "@/components/intake/IntakeFormShell";

export const metadata: Metadata = {
  title: "New Intake | Document OCR",
};

export default function NewIntakePage() {
  return (
    <div className="bg-[#0F0F0F]">
      <IntakeFormShell />
    </div>
  );
}
