import { ScanText } from "lucide-react";
import Link from "next/link";
import { LeftPanel } from "./LeftPanel";

interface AuthShellProps {
  children: React.ReactNode;
}

/**
 * Split-screen layout: dark branded panel (desktop) + floating white form.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      {/* Right — white form panel */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile logo (hidden on md+) */}
        <div className="md:hidden flex items-center gap-2 px-6 pt-6 pb-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-orange-500 flex items-center justify-center">
              <ScanText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[#0A0A0A]">IntakeOCR</span>
          </Link>
        </div>

        {/* Centered form — no card, floating on white */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[380px] animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
