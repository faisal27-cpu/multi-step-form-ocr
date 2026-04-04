import Link from "next/link";
import { ScanText } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

/**
 * Centered single-column layout for forgot-password and reset-password.
 * No card border — form floats on background.
 */
export function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex flex-col">
      {/* Top bar */}
      <header className="h-14 flex items-center px-6 border-b border-[#E4E4E7] dark:border-[#2A2A2A]">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[#0A0A0A] dark:text-white">
          <div className="w-7 h-7 rounded-[8px] bg-orange-500 flex items-center justify-center">
            <ScanText className="w-3.5 h-3.5 text-white" />
          </div>
          AUSH Relay
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px] animate-fade-in-up">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#0A0A0A] dark:text-white tracking-tight leading-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-[14px] text-[#71717A]">{description}</p>
            )}
          </div>
          {children}
        </div>
      </main>

      <footer className="h-10 flex items-center justify-center text-xs text-[#A1A1AA] border-t border-[#E4E4E7] dark:border-[#2A2A2A]">
        &copy; {new Date().getFullYear()} AUSH Relay
      </footer>
    </div>
  );
}
