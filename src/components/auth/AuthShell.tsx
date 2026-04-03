import Link from "next/link";
import { ScanText } from "lucide-react";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthShell({ children, title, description }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top bar */}
      <header className="h-14 flex items-center px-6 border-b border-border bg-background">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <ScanText className="w-4 h-4 text-primary-foreground" />
          </div>
          IntakeOCR
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-background border border-border rounded-xl shadow-sm p-8 space-y-6">
            <div className="space-y-1.5 text-center">
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 flex items-center justify-center text-xs text-muted-foreground border-t border-border bg-background">
        &copy; {new Date().getFullYear()} IntakeOCR. All rights reserved.
      </footer>
    </div>
  );
}
