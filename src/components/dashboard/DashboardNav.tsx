"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ScanText,
  Home,
  FilePlus,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Menu } from "@/components/ui/fluid-menu";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Dashboard",   Icon: Home,     href: "/dashboard"              },
  { label: "New Intake",  Icon: FilePlus, href: "/dashboard/intake/new"   },
  { label: "Submissions", Icon: FileText, href: "/dashboard/submissions"  },
  { label: "Settings",    Icon: Settings, href: "/dashboard/settings"     },
] as const;

interface Props {
  email: string;
}

export function DashboardNav({ email }: Props) {
  const pathname = usePathname();
  const router   = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const initial = email?.[0]?.toUpperCase() ?? "U";

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-white border-b border-[#E4E4E7] flex items-center px-6 gap-4">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0 mr-2">
        <div className="w-7 h-7 rounded-[7px] bg-orange-500 flex items-center justify-center">
          <ScanText className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-[15px] tracking-tight text-[#0A0A0A]">
          AUSH Relay
        </span>
      </Link>

      {/* Center pill nav */}
      <nav className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-0.5 bg-[#F4F4F5] rounded-full p-1">
          {NAV_LINKS.map(({ label, Icon, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
                isActive(href)
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-[#71717A] hover:text-orange-500 hover:bg-white/60"
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User avatar + dropdown */}
      <div className="shrink-0">
        <Menu
          align="right"
          showChevron={false}
          trigger={
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[13px] font-bold select-none">
              {initial}
            </div>
          }
        >
          {/* Email (non-clickable) */}
          <div className="px-4 py-2.5 border-b border-[#F4F4F5]">
            <p className="text-[12px] text-[#71717A] truncate max-w-[176px]">{email}</p>
          </div>

          {/* Back to home */}
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#3F3F46] hover:bg-[#F4F4F5] transition-colors text-left"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            Back to home
          </button>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            Sign out
          </button>
        </Menu>
      </div>
    </header>
  );
}
