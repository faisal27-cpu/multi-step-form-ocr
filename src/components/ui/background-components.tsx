"use client";

import { cn } from "@/lib/utils";

// ── YellowGlowBackground ──────────────────────────────────────────────────────
// Soft radial yellow glow centered on the page. Use as a wrapper; place your
// content inside it as children (rendered above the glow layer via z-10).

interface BackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function YellowGlowBackground({ children, className }: BackgroundProps) {
  return (
    <div className={cn("min-h-screen w-full relative bg-white", className)}>
      {/* Soft Yellow Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #FFF991 0%, transparent 70%)`,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ── GridDotsBackground ────────────────────────────────────────────────────────
// White background with a subtle 20px grid (thin lines) and dot intersections.
// Use as a wrapper; place your content inside it as children.

export function GridDotsBackground({ children, className }: BackgroundProps) {
  return (
    <div className={cn("min-h-screen w-full bg-white relative", className)}>
      {/* Grid + Dots */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(51,65,85,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
