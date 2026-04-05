"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ScanText, Upload, Sparkles, FileCheck2, ShieldCheck,
  FileText, Lock, LayoutList, Building2,
  ChevronDown, ArrowRight, Check, Moon, Sun, Download,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Props { isAuthenticated: boolean }

// ── FadeIn scroll-trigger component ─────────────────────────────────────────

function FadeIn({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(18px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

// ── Terminal product mockup ───────────────────────────────────────────────────

const TERMINAL_LINES = [
  { text: "$ document.scan --input invoice.pdf", color: "text-green-400",  delay: 0    },
  { text: "► Analyzing document structure...",   color: "text-[#666]",     delay: 700  },
  { text: "► Extracting 14 fields...",           color: "text-[#666]",     delay: 1500 },
  { text: "► OCR confidence: 98.4%",             color: "text-orange-400", delay: 2300 },
  { text: "✓ Form auto-filled successfully",     color: "text-white",      delay: 3100 },
];

function ProductMockup() {
  return (
    <div className="relative w-full max-w-[420px]">
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 bg-white dark:bg-[#1A1A1A] border border-[#E4E4E7] dark:border-[#2A2A2A] text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[#0A0A0A] dark:text-white">Live OCR Processing</span>
      </div>
      <div
        className="w-full rounded-2xl pt-7 pb-6 px-7 font-mono"
        style={{
          backgroundColor: "#0F0F0F",
          border: "1px solid rgba(249,115,22,0.3)",
          boxShadow: "0 0 0 1px rgba(249,115,22,0.05), 0 8px 48px rgba(249,115,22,0.18), 0 2px 16px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-[11px] font-semibold text-orange-500 tracking-widest uppercase not-italic">
            AUSH Relay
          </span>
        </div>
        <div className="space-y-2 text-[13px] leading-relaxed mb-5">
          {TERMINAL_LINES.map(({ text, color, delay }, i) => (
            <div
              key={i}
              className={color}
              style={{ opacity: 0, animation: `fadeInUp 0.35s ease ${delay}ms both` }}
            >
              {text}
              {i === TERMINAL_LINES.length - 1 && (
                <span className="inline-block w-[2px] h-[13px] bg-orange-400 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="h-[3px] bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full animate-progress-loop" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap not-italic">
          {["14 fields", "0.8s", "98.4% accuracy"].map((stat) => (
            <span
              key={stat}
              className="inline-flex items-center text-[11px] font-medium text-[#A1A1AA] bg-[#1A1A1A] border border-[#2A2A2A] px-2.5 py-1 rounded-md"
            >
              {stat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Industry pills data ───────────────────────────────────────────────────────

const INDUSTRIES = [
  { label: "Healthcare", emoji: "🏥" },
  { label: "Legal",      emoji: "⚖️"  },
  { label: "Finance",    emoji: "💰"  },
  { label: "HR",         emoji: "👥"  },
  { label: "Government", emoji: "🏛️"  },
  { label: "Insurance",  emoji: "📋"  },
  { label: "Enterprise", emoji: "🏢"  },
];

// ── FAQ item ──────────────────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-[#E4E4E7] dark:border-[#2A2A2A] transition-all duration-300"
      style={{ borderLeft: `3px solid ${open ? "#F97316" : "transparent"}` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 pl-4 group"
      >
        <span className="text-[15px] font-semibold text-[#0A0A0A] dark:text-white group-hover:text-orange-500 transition-colors">
          {question}
        </span>
        <ChevronDown
          className="w-4 h-4 text-[#71717A] dark:text-[#666] shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "200px" : "0px" }}
      >
        <p className="text-[14px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed pb-5 pl-4">{answer}</p>
      </div>
    </div>
  );
}

// ── Main landing page ─────────────────────────────────────────────────────────

export function LandingPage({ isAuthenticated }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-white" style={{ scrollBehavior: "smooth" }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 transition-all duration-200 bg-white dark:bg-[#0A0A0A] border-b border-[#E4E4E7] dark:border-[#2A2A2A] ${
          scrolled ? "shadow-sm dark:shadow-none" : ""
        }`}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-[7px] bg-orange-500 flex items-center justify-center">
            <ScanText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-[#0A0A0A] dark:text-white">AUSH Relay</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center rounded-md text-[#71717A] dark:text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-white hover:bg-[#F4F4F5] dark:hover:bg-[#1A1A1A] transition-colors"
            aria-label="Toggle dark mode"
          >
            <Moon className="w-4 h-4 dark:hidden" />
            <Sun className="w-4 h-4 hidden dark:block" />
          </button>

          {isAuthenticated ? (
            <Link
              href="/dashboard/intake/new"
              className="h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[13px] rounded-md transition-colors flex items-center gap-1.5"
            >
              Go to dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="h-9 px-4 text-[13px] font-medium text-[#3F3F46] dark:text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[13px] rounded-md transition-colors flex items-center"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-16">

          {/* Left — text (55%) */}
          <FadeIn delay={0} className="flex flex-col gap-6 lg:w-[55%]">
            <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 text-orange-600 text-[12px] font-semibold px-3.5 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3 h-3" />
              Intake automation for modern teams
            </div>

            <h1 className="font-hero text-[52px] sm:text-[60px] lg:text-[64px] font-extrabold tracking-tight leading-[1.05] text-[#0A0A0A] dark:text-white">
              Your intake forms,<br />
              filled in{" "}
              <span className="relative inline-block">
                seconds
              </span>
            </h1>

            <p className="text-[17px] sm:text-[18px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-[500px]">
              Upload any document — ID, invoice, or form. Our OCR reads it instantly
              and pre-fills your intake form. No manual typing. No errors.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/signup"
                className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[15px] rounded-[8px] transition-colors flex items-center gap-2 w-fit"
              >
                Start for free <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="h-11 px-6 border border-[#E4E4E7] dark:border-[#2A2A2A] text-[#3F3F46] dark:text-[#A1A1AA] hover:bg-[#F4F4F5] dark:hover:bg-[#1A1A1A] hover:border-[#D4D4D8] font-semibold text-[15px] rounded-[8px] transition-colors flex items-center w-fit"
              >
                See how it works
              </a>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {[
                "No document ever leaves your browser",
                "Auto-fills in seconds — no manual entry",
                "Instant PDF export on every submission",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-orange-600" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] text-[#52525B] dark:text-[#A1A1AA]">{text}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Right — mockup (45%) */}
          <FadeIn delay={120} className="lg:w-[45%] flex items-center justify-center w-full pb-8">
            <ProductMockup />
          </FadeIn>

        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────────────────────────── */}
      <div className="border-y border-[#E4E4E7] dark:border-[#1A1A1A] bg-[#F8F8F8] dark:bg-[#0D0D0D] py-4 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-8">
          <span className="text-[13px] font-medium text-[#71717A] dark:text-[#555] shrink-0 whitespace-nowrap">
            Trusted by teams in
          </span>
          <div className="flex-1 overflow-hidden">
            {/* Duplicate array for seamless infinite scroll */}
            <div className="flex gap-3 animate-marquee w-max">
              {[...INDUSTRIES, ...INDUSTRIES].map(({ label, emoji }, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-white dark:bg-[#1A1A1A] border border-[#E4E4E7] dark:border-[#2A2A2A] text-[13px] font-medium text-[#3F3F46] dark:text-[#A1A1AA] px-3.5 py-1.5 rounded-full whitespace-nowrap"
                >
                  <span>{emoji}</span> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-4">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-orange-500">
              How it works
            </span>
          </FadeIn>
          <FadeIn delay={60} className="text-center mb-16">
            <h2 className="font-hero text-[36px] sm:text-[40px] font-bold tracking-tight text-[#0A0A0A] dark:text-white">
              From document to done in 3 steps
            </h2>
          </FadeIn>

          {/* Timeline */}
          <FadeIn delay={100}>
            <div className="relative">
              {/* Connecting dashed line — hidden on mobile */}
              <div
                className="absolute top-[72px] hidden lg:block"
                style={{
                  left: "calc(16.67% + 24px)",
                  right: "calc(16.67% + 24px)",
                  borderTop: "2px dashed #FED7AA",
                }}
              />
              {/* Timing badge centered between step 1 and 2 */}
              <div className="absolute top-[58px] left-1/3 -translate-x-1/2 hidden lg:block z-10">
                <span className="text-[11px] text-orange-600 font-bold bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 px-2.5 py-1 rounded-full whitespace-nowrap">
                  &lt; 1 second
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
                {([
                  { num: "01", icon: Upload,     title: "Upload",  desc: "Drop in any document image. JPEG, PNG, and WEBP are all supported." },
                  { num: "02", icon: ScanText,   title: "Extract", desc: "Tesseract.js reads and extracts every field instantly in your browser." },
                  { num: "03", icon: FileCheck2, title: "Submit",  desc: "Review the pre-filled form, make edits, and download your PDF." },
                ] as { num: string; icon: React.ElementType; title: string; desc: string }[]).map(({ num, icon: Icon, title, desc }, i) => (
                  <div
                    key={num}
                    className="group flex flex-col items-center lg:items-start text-center lg:text-left p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D] cursor-default transition-all duration-300"
                    style={{ transitionProperty: "transform, box-shadow" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Step number */}
                    <div
                      className="text-[72px] font-black leading-none text-orange-500 mb-3 select-none"
                      style={{ opacity: 0.18, fontVariantNumeric: "tabular-nums" }}
                    >
                      {num}
                    </div>
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center mb-4 z-10 relative">
                      <Icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-[17px] font-bold text-[#0A0A0A] dark:text-white mb-2">{title}</h3>
                    <p className="text-[14px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FEATURE BENTO GRID ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAFAFA] dark:bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="font-hero text-[36px] sm:text-[40px] font-bold tracking-tight text-[#0A0A0A] dark:text-white">
              Everything you need, nothing you don&apos;t
            </h2>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Card 1 — Client-side OCR (spans 2 cols, dark) */}
              <div className="sm:col-span-2 rounded-2xl overflow-hidden border border-[#1A1A1A] bg-[#0F0F0F] p-8 flex flex-col sm:flex-row items-start gap-8">
                {/* Animated scan mockup */}
                <div className="shrink-0 mx-auto sm:mx-0">
                  <div className="relative w-32 h-44 rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A]">
                    <div className="p-4 space-y-2.5 mt-1">
                      <div className="h-1.5 bg-[#333] rounded-sm" style={{ width: "75%" }} />
                      <div className="h-1.5 bg-[#333] rounded-sm w-full" />
                      <div className="h-1.5 bg-[#333] rounded-sm" style={{ width: "60%" }} />
                      <div className="h-1.5 bg-[#333] rounded-sm w-full" />
                      <div className="h-1.5 bg-[#333] rounded-sm" style={{ width: "85%" }} />
                      <div className="h-1.5 bg-[#333] rounded-sm" style={{ width: "50%" }} />
                      <div className="h-1.5 bg-[#333] rounded-sm w-full" />
                      <div className="h-1.5 bg-[#333] rounded-sm" style={{ width: "70%" }} />
                    </div>
                    {/* Scanning line */}
                    <div
                      className="absolute inset-x-0 h-0.5 animate-scan-down pointer-events-none"
                      style={{
                        background: "linear-gradient(90deg, transparent, #F97316, transparent)",
                        boxShadow: "0 0 10px 3px rgba(249,115,22,0.45)",
                        top: 0,
                      }}
                    />
                  </div>
                  {/* Extracting badge */}
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-orange-950/40 border border-orange-900/50 text-orange-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    Extracting fields…
                  </div>
                </div>
                {/* Text */}
                <div className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-950/40 border border-orange-900/40 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-[20px] font-bold text-white">Client-side OCR</h3>
                  <p className="text-[14px] text-[#A1A1AA] leading-relaxed max-w-md">
                    Your documents never leave your browser. Tesseract.js runs entirely in a Web Worker —
                    zero server uploads during OCR processing. Full privacy by design.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["JPEG", "PNG", "WEBP"].map((fmt) => (
                      <span key={fmt} className="text-[11px] font-semibold text-[#666] bg-[#1A1A1A] border border-[#2A2A2A] px-2.5 py-1 rounded-md">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2 — Instant PDF */}
              <div className="group rounded-2xl overflow-hidden border border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D] p-7">
                <div className="relative w-14 h-16 mb-5">
                  <div className="w-12 h-14 rounded-lg border-2 border-[#E4E4E7] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#1A1A1A] flex flex-col items-center justify-center gap-1">
                    <FileText className="w-5 h-5 text-orange-500" />
                    <span className="text-[9px] font-black text-orange-500 tracking-wider">PDF</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center transition-transform duration-300 group-hover:translate-y-1">
                    <Download className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="text-[16px] font-bold text-[#0A0A0A] dark:text-white mb-2">Instant PDF generation</h3>
                <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  Every completed submission generates a clean, downloadable PDF summary using pdf-lib — no external service needed.
                </p>
              </div>

              {/* Card 3 — Secure by default */}
              <div className="rounded-2xl overflow-hidden border border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D] p-7">
                <div className="relative w-12 h-12 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-orange-500" />
                  </div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-xl border-2 border-orange-300/40 animate-ping" style={{ animationDuration: "2s" }} />
                </div>
                <h3 className="text-[16px] font-bold text-[#0A0A0A] dark:text-white mb-2">Secure by default</h3>
                <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  Row Level Security enforced on every Supabase table. Your data is yours alone — other users can never access your submissions.
                </p>
              </div>

              {/* Card 4 — Multi-step flow (spans 2 cols) */}
              <div className="sm:col-span-2 rounded-2xl overflow-hidden border border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D] p-7">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center mb-4">
                      <LayoutList className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-[16px] font-bold text-[#0A0A0A] dark:text-white mb-2">Multi-step form flow</h3>
                    <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-sm">
                      Guide users through complex forms without overwhelm. A structured four-step process with progress tracking.
                    </p>
                  </div>
                  {/* Step indicator visual */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(["Upload", "Info", "Details", "Review"] as const).map((label, i) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all ${
                              i === 0
                                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30"
                                : "bg-white dark:bg-[#1A1A1A] border-[#E4E4E7] dark:border-[#2A2A2A] text-[#A1A1AA]"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <span className={`text-[10px] font-medium whitespace-nowrap ${i === 0 ? "text-orange-500" : "text-[#A1A1AA]"}`}>
                            {label}
                          </span>
                        </div>
                        {i < 3 && (
                          <div className="w-6 sm:w-10 h-[1px] bg-[#E4E4E7] dark:bg-[#2A2A2A] mb-5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 5 — Built for business (spans 2 cols) */}
              <div
                className="sm:col-span-2 rounded-2xl overflow-hidden border border-[#E4E4E7] dark:border-[#2A2A2A] p-7"
                style={{ background: "linear-gradient(135deg, #ffffff 0%, #FFF7ED 100%)" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center mb-4">
                      <Building2 className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-[16px] font-bold text-[#0A0A0A] mb-2">Built for business</h3>
                    <p className="text-[13px] text-[#71717A] leading-relaxed max-w-sm">
                      Personalized per company. Every team gets their own intake workspace, tailored to industry and company size.
                    </p>
                  </div>
                  {/* Industry placeholder circles */}
                  <div className="flex items-center gap-4 flex-wrap shrink-0">
                    {[
                      { label: "Healthcare", abbr: "HC", bg: "bg-blue-100",   text: "text-blue-600"   },
                      { label: "Legal",      abbr: "LG", bg: "bg-purple-100", text: "text-purple-600" },
                      { label: "Finance",    abbr: "FN", bg: "bg-green-100",  text: "text-green-600"  },
                      { label: "HR",         abbr: "HR", bg: "bg-pink-100",   text: "text-pink-600"   },
                      { label: "Gov",        abbr: "GV", bg: "bg-orange-100", text: "text-orange-600" },
                    ].map(({ label, abbr, bg, text }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5">
                        <div className={`w-11 h-11 rounded-full ${bg} border border-white shadow-sm flex items-center justify-center text-[11px] font-black ${text}`}>
                          {abbr}
                        </div>
                        <span className="text-[10px] font-medium text-[#71717A] whitespace-nowrap">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────── */}
      <FadeIn as="section" className="bg-[#0F0F0F] py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-0">
          {[
            { stat: "< 1s",   label: "OCR processing time"          },
            { stat: "0",      label: "Documents uploaded to servers" },
            { stat: "100%",   label: "Client-side processing"        },
          ].map(({ stat, label }, i) => (
            <div
              key={stat}
              className={`flex flex-col items-center text-center py-10 px-6 ${
                i < 2 ? "sm:border-r border-b sm:border-b-0 border-[#1A1A1A]" : ""
              }`}
            >
              <span
                className="font-hero text-[64px] sm:text-[72px] font-black text-white leading-none mb-3 tabular-nums"
                style={{ textShadow: "0 0 48px rgba(249,115,22,0.35), 0 0 80px rgba(249,115,22,0.15)" }}
              >
                {stat}
              </span>
              <span className="text-[13px] font-semibold text-orange-500 tracking-wide uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-[680px] mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="font-hero text-[36px] sm:text-[40px] font-bold tracking-tight text-[#0A0A0A] dark:text-white">
              Questions we get a lot
            </h2>
          </FadeIn>

          <FadeIn delay={80}>
            <div>
              {[
                {
                  question: "Is my document data secure?",
                  answer: "Yes. OCR processing happens entirely in your browser using Tesseract.js. No document data is ever sent to our servers.",
                },
                {
                  question: "What file types are supported?",
                  answer: "JPEG, PNG, and WEBP images up to 10MB. PDF support is coming soon.",
                },
                {
                  question: "Do I need to train the OCR?",
                  answer: "No. Tesseract.js works out of the box on any document. No setup or training required.",
                },
                {
                  question: "Can multiple people from my company use it?",
                  answer: "Yes. Every account is linked to a business profile. Team access controls are on the roadmap.",
                },
                {
                  question: "Is there a free plan?",
                  answer: "Yes. You can sign up and start using AUSH Relay for free. No credit card required.",
                },
              ].map(({ question, answer }) => (
                <FAQItem key={question} question={question} answer={answer} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────── */}
      <FadeIn as="section" className="relative bg-[#0A0A0A] py-28 px-6 text-center overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 700px 400px at 50% 40%, rgba(249,115,22,0.10), transparent)",
          }}
        />
        <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="font-hero text-[44px] sm:text-[56px] font-black text-white tracking-tight leading-[1.05]">
            Stop typing.<br />Start submitting.
          </h2>
          <p className="text-[16px] text-[#71717A] leading-relaxed max-w-lg">
            Join teams in healthcare, legal, and finance who&apos;ve eliminated manual data entry from their intake process.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/auth/signup"
              className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[16px] rounded-[8px] transition-colors flex items-center gap-2"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="h-12 px-8 border border-[#2A2A2A] hover:border-[#3A3A3A] text-[#A1A1AA] hover:text-white font-semibold text-[16px] rounded-[8px] transition-colors flex items-center justify-center"
            >
              See how it works
            </a>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {["No credit card", "Free forever plan", "Setup in 2 minutes"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-[13px] text-[#555]">
                <Check className="w-3.5 h-3.5 text-orange-500" strokeWidth={3} />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-[#0A0A0A] border-t border-[#E4E4E7] dark:border-[#1A1A1A] px-6">
        {/* Top row */}
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-b border-[#E4E4E7] dark:border-[#1A1A1A]">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center">
              <ScanText className="w-3 h-3 text-white" />
            </div>
            <span className="text-[14px] font-bold text-[#0A0A0A] dark:text-white">AUSH Relay</span>
          </Link>
          <nav className="flex items-center gap-6">
            {[
              { label: "Features",      href: "#features"      },
              { label: "How it works",  href: "#how-it-works"  },
              { label: "FAQ",           href: "#faq"           },
              { label: "Contact",       href: "#"              },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[13px] text-[#71717A] dark:text-[#666] hover:text-[#0A0A0A] dark:hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        {/* Bottom row */}
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
          <span className="text-[12px] text-[#A1A1AA]">
            &copy; 2025 AUSH Relay. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[12px] text-[#A1A1AA] hover:text-[#0A0A0A] dark:hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
