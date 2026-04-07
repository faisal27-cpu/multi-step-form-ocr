"use client";

import { useRouter, usePathname } from "next/navigation";
import { Menu as MenuIcon, Home, FileText, History, Settings, LogOut } from "lucide-react";
import { MenuContainer } from "@/components/ui/fluid-menu";
import { createClient } from "@/lib/supabase/client";

// The MenuContainer animates items downward by default.
// We flip the outer wrapper scaleY(-1) so items expand upward (correct for a
// bottom-right FAB), then counter-flip each child's content to keep icons upright.
const FLIP = { transform: "scaleY(-1)" } as const;

const ITEM_CLS =
  "w-full h-full flex items-center justify-center bg-[#1A1A1A] cursor-pointer transition-colors hover:bg-[#2A2A2A]";

export function FloatingNavMenu() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard/intake")) return null;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" style={FLIP}>
      <MenuContainer>
        {/* Trigger — orange circle */}
        <div
          style={FLIP}
          className="w-full h-full flex items-center justify-center bg-[#F97316] rounded-full"
        >
          <MenuIcon className="w-5 h-5 text-white" />
        </div>

        {/* Home */}
        <div style={FLIP} className={ITEM_CLS} onClick={() => router.push("/")}>
          <Home className="w-5 h-5 text-white" />
        </div>

        {/* New Intake */}
        <div style={FLIP} className={ITEM_CLS} onClick={() => router.push("/dashboard/intake/new")}>
          <FileText className="w-5 h-5 text-white" />
        </div>

        {/* My Submissions */}
        <div style={FLIP} className={ITEM_CLS} onClick={() => router.push("/dashboard")}>
          <History className="w-5 h-5 text-white" />
        </div>

        {/* Settings */}
        <div style={FLIP} className={ITEM_CLS} onClick={() => router.push("/dashboard/settings")}>
          <Settings className="w-5 h-5 text-white" />
        </div>

        {/* Sign Out */}
        <div style={FLIP} className={ITEM_CLS} onClick={handleSignOut}>
          <LogOut className="w-5 h-5 text-white" />
        </div>
      </MenuContainer>
    </div>
  );
}
