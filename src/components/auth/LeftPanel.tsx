import { ScanText, Check } from "lucide-react";

const features = [
  "OCR that reads documents instantly",
  "Auto-fills forms in seconds",
  "PDF generation built in",
];

export function LeftPanel() {
  return (
    <div
      className="hidden md:flex md:w-[45%] shrink-0 flex-col justify-between px-12 py-14 min-h-screen relative overflow-hidden"
      style={{
        backgroundColor: "#0A0A0A",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, #0A0A0A 90%)",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-orange-500 flex items-center justify-center shrink-0">
            <ScanText className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-[15px] tracking-tight">IntakeOCR</span>
        </div>

        {/* Hero copy */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-[2.6rem] font-bold leading-[1.1] text-white tracking-tight">
              Intake forms that<br />
              <span className="text-orange-500">fill themselves.</span>
            </h2>
            <p className="text-[#52525B] text-sm leading-relaxed max-w-[270px]">
              Upload a document, let OCR do the work, and submit — all in under two minutes.
            </p>
          </div>

          {/* Feature list with orange checkmarks */}
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 ${
                  i === 0 ? "animate-bullet-1" : i === 1 ? "animate-bullet-2" : "animate-bullet-3"
                }`}
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-[#A1A1AA] text-[14px] leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-[#3F3F46] text-xs">
          &copy; {new Date().getFullYear()} IntakeOCR. All rights reserved.
        </p>
      </div>
    </div>
  );
}
