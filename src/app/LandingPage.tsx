"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ScanText, Upload, Sparkles, FileCheck2, ShieldCheck,
  FileText, LayoutList, Building2,
  ChevronDown, ArrowRight, Check, Moon, Sun, Download,
} from "lucide-react";
import { motion } from "motion/react";
import { TestimonialsColumn, testimonials } from "@/components/ui/testimonials-columns-1";

// ── Types ────────────────────────────────────────────────────────────────────

interface Props { isAuthenticated: boolean }

// ── FadeIn scroll-trigger component ─────────────────────────────────────────

function FadeIn({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  style: outerStyle,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
  style?: React.CSSProperties;
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
        ...outerStyle,
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

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FAFAFA] dark:bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-10"
          >
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-orange-500 mb-3">
              Testimonials
            </span>
            <h2 className="font-hero text-[36px] sm:text-[40px] font-bold tracking-tight text-[#0A0A0A] dark:text-white">
              What our users say
            </h2>
            <p className="text-[15px] text-[#71717A] dark:text-[#A1A1AA] mt-3 max-w-md">
              Teams across healthcare, legal, and finance trust AUSH Relay to handle their intake.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[700px] overflow-hidden">
            <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={15} />
            <TestimonialsColumn testimonials={testimonials.slice(3, 6)} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={testimonials.slice(6, 9)} className="hidden lg:block" duration={17} />
          </div>
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

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{
              gridTemplateAreas: `
                "card1 card1"
                "card2 card3"
                "card4 card5"
              `,
            }}
          >

            {/* ── Card 1 — Client-side OCR (full width, dark) ── */}
            <FadeIn
              delay={0}
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
              style={{ gridArea: "card1" } as React.CSSProperties}
            >
              <div className="bg-[#0F0F0F] p-10 h-full flex flex-col gap-8">
                {/* Top row: text left, visual right */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Text */}
                  <div className="flex-1 flex flex-col gap-4">
                    <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-orange-500">
                      Privacy first
                    </span>
                    <h3 className="font-hero text-[26px] sm:text-[30px] font-bold text-white leading-tight">
                      Your documents never leave your browser
                    </h3>
                    <p className="text-[14px] text-[#A1A1AA] leading-relaxed max-w-md">
                      OCR processing happens 100% client-side using Tesseract.js.
                      Zero server uploads. Zero data exposure. Full privacy by design.
                    </p>
                  </div>

                  {/* Scan visual */}
                  <div className="shrink-0 flex flex-col items-center gap-3">
                    <div
                      className="relative w-36 h-48 rounded-2xl overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A]"
                      style={{ boxShadow: "0 0 40px rgba(249,115,22,0.12)" }}
                    >
                      {/* Document lines */}
                      <div className="p-5 space-y-2.5 mt-2">
                        {[75, 100, 55, 100, 80, 45, 100, 65, 88].map((w, i) => (
                          <div
                            key={i}
                            className="h-1.5 rounded-sm"
                            style={{ width: `${w}%`, backgroundColor: i % 3 === 0 ? "#3A3A3A" : "#2A2A2A" }}
                          />
                        ))}
                      </div>
                      {/* Scan line */}
                      <div
                        className="absolute inset-x-0 h-0.5 animate-scan-down pointer-events-none"
                        style={{
                          background: "linear-gradient(90deg, transparent 0%, #F97316 40%, #FB923C 50%, #F97316 60%, transparent 100%)",
                          boxShadow: "0 0 14px 5px rgba(249,115,22,0.5)",
                          top: 0,
                        }}
                      />
                      {/* Orange glow overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at center 60%, rgba(249,115,22,0.04), transparent 70%)" }}
                      />
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-orange-950/40 border border-orange-900/50 text-orange-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      Extracting fields…
                    </div>
                  </div>
                </div>

                {/* Bottom mini-stats row */}
                <div className="flex flex-wrap gap-6 pt-6 border-t border-[#1A1A1A]">
                  {[
                    { value: "0 uploads",    label: "to any server" },
                    { value: "100% local",   label: "processing"    },
                    { value: "Tesseract.js", label: "powered"       },
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                      <span className="text-[13px] font-semibold text-white">{value}</span>
                      <span className="text-[12px] text-[#555]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* ── Card 2 — Instant PDF (half width) ── */}
            <FadeIn
              delay={100}
              className="group rounded-2xl overflow-hidden border border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D] p-7 flex flex-col gap-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
              style={{ gridArea: "card2" } as React.CSSProperties}
            >
              {/* PDF icon + badge */}
              <div className="flex items-start justify-between">
                <div className="relative w-14 h-16">
                  <div className="w-12 h-14 rounded-xl border border-[#E4E4E7] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#1A1A1A] flex flex-col items-center justify-center gap-1">
                    <FileText className="w-5 h-5 text-orange-500" />
                    <span className="text-[9px] font-black text-orange-500 tracking-widest">PDF</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-orange-900/40 transition-transform duration-300 group-hover:translate-y-1">
                    <Download className="w-3 h-3 text-white" />
                  </div>
                </div>
                {/* PDF Ready badge */}
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 180, damping: 14 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-green-600 dark:text-green-400 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  PDF Ready ✓
                </motion.div>
              </div>

              <div className="flex-1">
                <h3 className="text-[16px] font-bold text-[#0A0A0A] dark:text-white mb-2">Instant PDF generation</h3>
                <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  Every completed submission generates a clean, downloadable PDF summary using pdf-lib — no external service needed.
                </p>
              </div>

              {/* Animated download button */}
              <div className="mt-auto">
                <button
                  className="w-full h-9 rounded-lg border border-[#E4E4E7] dark:border-[#2A2A2A] text-[13px] font-medium text-[#3F3F46] dark:text-[#A1A1AA] flex items-center justify-center gap-2 transition-all duration-200 group-hover:border-orange-300 group-hover:text-orange-500 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/10"
                  tabIndex={-1}
                >
                  <Download className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
                  Download PDF
                </button>
              </div>
            </FadeIn>

            {/* ── Card 3 — Secure by default (half width) ── */}
            <FadeIn
              delay={150}
              className="rounded-2xl overflow-hidden border border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#0D0D0D] p-7 flex flex-col gap-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
              style={{ gridArea: "card3" } as React.CSSProperties}
            >
              {/* Shield with pulsing rings */}
              <div className="relative w-16 h-16">
                <div
                  className="absolute inset-0 rounded-full border border-orange-300/30 animate-ping"
                  style={{ animationDuration: "2s" }}
                />
                <div
                  className="absolute inset-[-6px] rounded-full border border-orange-200/20 animate-ping"
                  style={{ animationDuration: "2.6s", animationDelay: "0.4s" }}
                />
                <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center relative z-10">
                  <ShieldCheck className="w-6 h-6 text-orange-500" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-[16px] font-bold text-[#0A0A0A] dark:text-white mb-2">Secure by default</h3>
                <p className="text-[13px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  Row Level Security enforced on every table. Your data is yours alone.
                </p>
              </div>

              {/* Security badges */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "RLS Enabled", color: "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/40" },
                  { label: "Encrypted",   color: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40"   },
                  { label: "Zero Trust",  color: "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40" },
                ].map(({ label, color }) => (
                  <span key={label} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${color}`}>
                    {label}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* ── Card 4 — Multi-step flow (half width) ── */}
            <FadeIn
              delay={200}
              className="rounded-2xl overflow-hidden border border-orange-100 dark:border-[#2A2A2A] p-7 flex flex-col gap-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
              style={{ gridArea: "card4", backgroundColor: "#FFFBF7" } as React.CSSProperties}
            >
              <div>
                <h3 className="text-[16px] font-bold text-[#0A0A0A] mb-2">Guided multi-step forms</h3>
                <p className="text-[13px] text-[#71717A] leading-relaxed">
                  Break complex intake into manageable steps. Users always know where they are.
                </p>
              </div>

              {/* Horizontal step pills */}
              <div className="flex items-center gap-2 mt-auto flex-wrap">
                {([
                  { num: 1, label: "Upload",  active: true  },
                  { num: 2, label: "Info",    active: false },
                  { num: 3, label: "Details", active: false },
                  { num: 4, label: "Review",  active: false },
                ] as { num: number; label: string; active: boolean }[]).map(({ num, label, active }, i, arr) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className={`flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl border transition-all ${
                        active
                          ? "bg-orange-500 border-orange-500 shadow-md shadow-orange-200/60"
                          : "bg-white border-[#E4E4E7]"
                      }`}
                    >
                      <span className={`text-[20px] font-black leading-none ${active ? "text-white" : "text-[#D4D4D8]"}`}>
                        {num}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? "text-white/80" : "text-[#A1A1AA]"}`}>
                        {label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${active ? "text-orange-400" : "text-[#D4D4D8]"}`} />
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* ── Card 5 — Built for every industry (half width, dark) ── */}
            <FadeIn
              delay={250}
              className="rounded-2xl overflow-hidden p-7 flex flex-col gap-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
              style={{ gridArea: "card5", backgroundColor: "#1A1A1A" } as React.CSSProperties}
            >
              <div>
                <h3 className="text-[16px] font-bold text-white mb-2">Built for every industry</h3>
                <p className="text-[13px] text-[#666] leading-relaxed">
                  Personalized per company from day one. Your workspace, your rules.
                </p>
              </div>

              {/* Glowing industry pills */}
              <div className="flex flex-col gap-2.5 mt-auto">
                {([
                  { label: "Healthcare", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)",  text: "rgb(147,197,253)"  },
                  { label: "Legal",      bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.25)",  text: "rgb(216,180,254)"  },
                  { label: "Finance",    bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.25)",   text: "rgb(134,239,172)"  },
                  { label: "HR",         bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.25)",  text: "rgb(249,168,212)"  },
                  { label: "Government", bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.25)",   text: "rgb(253,224,71)"   },
                ] as { label: string; bg: string; border: string; text: string }[]).map(({ label, bg, border, text }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold"
                    style={{ backgroundColor: bg, border: `1px solid ${border}`, color: text }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: text, boxShadow: `0 0 6px ${text}` }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </FadeIn>

          </div>
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
