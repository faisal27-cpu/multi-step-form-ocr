import type { Metadata } from "next";
import { IntakeFormShell } from "@/components/intake/IntakeFormShell";

export const metadata: Metadata = {
  title: "New Intake | Document OCR",
};

export default function NewIntakePage() {
  return (
    <main className="min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0A] py-10 px-4">
      <IntakeFormShell />
    </main>
  );
}
