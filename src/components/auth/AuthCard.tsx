import Link from "next/link";
import { ScanText } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

/**
 * Centered card layout used by forgot-password and reset-password pages.
 */
export function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top bar */}
      <header className="h-14 flex items-center px-6 border-b border-zinc-200 bg-white">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-900">
          <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center">
            <ScanText className="w-3.5 h-3.5 text-white" />
          </div>
          IntakeOCR
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-8 space-y-6">
            <div className="space-y-1.5">
              <h1 className="font-display text-xl font-bold tracking-tight text-zinc-900">{title}</h1>
              {description && (
                <p className="text-sm text-zinc-500">{description}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </main>

      <footer className="h-10 flex items-center justify-center text-xs text-zinc-400 border-t border-zinc-200 bg-white">
        &copy; {new Date().getFullYear()} IntakeOCR
      </footer>
    </div>
  );
}
