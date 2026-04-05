import type { Metadata } from "next";
import Link from "next/link";
import { ScanText, ArrowLeft } from "lucide-react";
import { IntakeFormShell } from "@/components/intake/IntakeFormShell";

export const metadata: Metadata = {
  title: "New Intake | Document OCR",
};

export default function NewIntakePage() {
  return (
    <>
      <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-6 bg-white dark:bg-[#0A0A0A] border-b border-[#E4E4E7] dark:border-[#1A1A1A]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[7px] bg-orange-500 flex items-center justify-center">
            <ScanText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-[#0A0A0A] dark:text-white">
            AUSH Relay
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#71717A] dark:text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
      </header>

      <main className="min-h-screen bg-[#F8F8F8] dark:bg-[#0A0A0A] py-10 px-4">
        <IntakeFormShell />
      </main>
    </>
  );
}
