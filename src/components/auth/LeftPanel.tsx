import { ScanText, Upload, Sparkles, FileCheck2 } from "lucide-react";

const bullets = [
  { icon: Upload,      text: "Upload any document — ID, invoice, or custom form" },
  { icon: Sparkles,    text: "OCR extracts text instantly, entirely in your browser" },
  { icon: FileCheck2,  text: "Fields auto-fill and a PDF is generated on submit" },
];

function DocumentMockup() {
  return (
    <div className="relative w-[200px]">
      {/* Soft glow */}
      <div
        className="absolute -inset-4 rounded-2xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, rgba(249,115,22,0.08), transparent 70%)" }}
      />
      <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4 shadow-xl">
        {/* Fake window chrome */}
        <div className="flex items-center gap-1.5 mb-3.5">
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
          <div className="ml-auto flex items-center gap-1 text-[9px] text-zinc-600 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            OCR running
          </div>
        </div>

        {/* Auto-filled field 1 */}
        <div className="space-y-1 mb-2.5">
          <div className="h-1.5 w-12 rounded-full bg-zinc-700" />
          <div className="h-6 rounded border border-orange-500/30 bg-orange-500/8 px-2 flex items-center justify-between">
            <div className="h-1.5 w-16 rounded-full bg-orange-400/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
          </div>
        </div>

        {/* Auto-filled field 2 */}
        <div className="space-y-1 mb-2.5">
          <div className="h-1.5 w-16 rounded-full bg-zinc-700" />
          <div className="h-6 rounded border border-orange-500/30 bg-orange-500/8 px-2 flex items-center justify-between">
            <div className="h-1.5 w-20 rounded-full bg-orange-400/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
          </div>
        </div>

        {/* Empty field */}
        <div className="space-y-1 mb-3">
          <div className="h-1.5 w-10 rounded-full bg-zinc-700" />
          <div className="h-6 rounded border border-zinc-700/60 bg-zinc-800/40 px-2 flex items-center">
            <div className="h-1.5 w-8 rounded-full bg-zinc-700/50" />
          </div>
        </div>

        {/* Submit button */}
        <div className="h-6 rounded bg-orange-500 flex items-center justify-center gap-1">
          <div className="h-1.5 w-12 rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );
}

export function LeftPanel() {
  return (
    <div
      className="hidden md:flex md:w-[45%] shrink-0 flex-col justify-between px-12 py-14 min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: "#0C0C0C",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Vignette to soften dot grid at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, #0C0C0C 90%)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-12">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center shrink-0">
            <ScanText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-base tracking-tight">IntakeOCR</span>
        </div>

        {/* Hero section */}
        <div className="space-y-12 flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <h2 className="font-display text-[2.75rem] font-extrabold leading-[1.08] text-white tracking-tight">
              Intake forms that<br />
              <span className="text-orange-500">fill themselves.</span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[260px]">
              Upload a document, let OCR do the work, and submit — all in under two minutes.
            </p>
          </div>

          <DocumentMockup />

          {/* Animated feature bullets */}
          <ul className="space-y-5">
            {bullets.map(({ icon: Icon, text }, i) => (
              <li
                key={i}
                className={`flex items-start gap-3.5 ${
                  i === 0 ? "animate-bullet-1" : i === 1 ? "animate-bullet-2" : "animate-bullet-3"
                }`}
              >
                <div className="mt-0.5 w-7 h-7 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <span className="text-zinc-400 text-sm leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-zinc-700 text-xs">
          &copy; {new Date().getFullYear()} IntakeOCR. All rights reserved.
        </p>
      </div>
    </div>
  );
}
