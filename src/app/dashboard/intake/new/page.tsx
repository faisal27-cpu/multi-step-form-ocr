import type { Metadata } from "next";
import { IntakeFormShell } from "@/components/intake/IntakeFormShell";

export const metadata: Metadata = {
  title: "New Intake | Document OCR",
};

export default function NewIntakePage() {
  return (
    <div className="bg-[#0F0F0F]">
      {/* Orange gradient accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-400" />
      <IntakeFormShell />
    </div>
  );
}
