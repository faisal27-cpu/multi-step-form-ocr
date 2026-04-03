import type { Metadata } from "next";
import { IntakeFormShell } from "@/components/intake/IntakeFormShell";

export const metadata: Metadata = {
  title: "New Intake | Document OCR",
};

export default function NewIntakePage() {
  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <IntakeFormShell />
    </main>
  );
}
