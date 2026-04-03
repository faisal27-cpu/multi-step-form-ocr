import { ScanText } from "lucide-react";
import { LeftPanel } from "./LeftPanel";

interface AuthShellProps {
  children: React.ReactNode;
}

/**
 * Split-screen layout used by login and signup pages.
 * Left: branded dark panel (desktop only).
 * Right: white form panel (full width on mobile).
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile logo (hidden on md+) */}
        <div className="md:hidden flex items-center gap-2.5 px-6 pt-6 pb-2">
          <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center">
            <ScanText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-base tracking-tight text-zinc-900">IntakeOCR</span>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm animate-fade-in-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
