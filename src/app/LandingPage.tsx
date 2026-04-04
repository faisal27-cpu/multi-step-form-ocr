"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ScanText, Upload, Sparkles, FileCheck2, ShieldCheck,
  FileText, Lock, LayoutList, Building2, Database,
  ChevronDown, ArrowRight,
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

// ── Product mockup ────────────────────────────────────────────────────────────

function ProductMockup() {
  return (
    <div className="w-full bg-[#F8F8F8] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6">
      {/* Document card */}
      <div className="relative w-44 shrink-0 bg-white rounded-xl border border-[#E4E4E7] shadow-sm p-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <FileText className="w-3 h-3 text-orange-500" />
          </div>
          <div className="h-2 w-14 rounded-full bg-[#E4E4E7]" />
        </div>
        {/* Document lines */}
        <div className="space-y-2">
          {[100, 80, 100, 72, 88, 60, 78].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-[#E4E4E7]" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* Scanning orange line */}
        <div
          className="absolute left-0 right-0 h-[2px] animate-scan-down"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #F97316 30%, #F97316 70%, transparent 100%)",
          }}
        />
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center text-orange-400 rotate-90 sm:rotate-0">
        <ArrowRight className="w-5 h-5" strokeWidth={2} />
      </div>

      {/* Form card */}
      <div className="w-52 shrink-0 bg-white rounded-xl border border-[#E4E4E7] shadow-sm p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <LayoutList className="w-3 h-3 text-orange-500" />
          </div>
          <div className="h-2 w-16 rounded-full bg-[#E4E4E7]" />
        </div>

        {/* Fields with typing animation */}
        <div className="space-y-2.5">
          {[
            { label: "Name",    value: "Sarah Mitchell", cls: "animate-type-1" },
            { label: "Company", value: "Acme Corp",      cls: "animate-type-2" },
            { label: "Date",    value: "2024-03-15",     cls: "animate-type-3" },
          ].map(({ label, value, cls }) => (
            <div key={label}>
              <div className="h-1.5 w-8 rounded-full bg-[#E4E4E7] mb-1" />
              <div className="h-7 rounded-md bg-[#F4F4F5] px-2 flex items-center">
                <span className={`text-[11px] font-medium text-[#0A0A0A] ${cls}`}>
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-3 h-6 bg-orange-500 rounded-md flex items-center justify-center">
          <span className="text-[9px] font-bold text-white uppercase tracking-wider">Submit</span>
        </div>
      </div>
    </div>
  );
}

// ── FAQ item ──────────────────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E4E4E7]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-[15px] font-semibold text-[#0A0A0A] group-hover:text-orange-500 transition-colors">
          {question}
        </span>
        <ChevronDown
          className="w-4 h-4 text-[#71717A] shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "200px" : "0px" }}
      >
        <p className="text-[14px] text-[#71717A] leading-relaxed pb-5">{answer}</p>
      </div>
    </div>
  );
}

// ── Main landing page ─────────────────────────────────────────────────────────

export function LandingPage({ isAuthenticated }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="bg-white text-[#0A0A0A]" style={{ scrollBehavior: "smooth" }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 transition-all duration-200"
        style={{
          backgroundColor: "white",
          borderBottom: scrolled ? "1px solid #E4E4E7" : "1px solid #E4E4E7",
          boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-[7px] bg-orange-500 flex items-center justify-center">
            <ScanText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-[#0A0A0A]">IntakeOCR</span>
        </Link>

        {/* Nav actions */}
        <div className="flex items-center gap-3">
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
                className="h-9 px-4 text-[13px] font-medium text-[#3F3F46] hover:text-[#0A0A0A] transition-colors"
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
      <section className="pt-16 pb-20 px-6 flex flex-col items-center text-center">
        <FadeIn delay={0} className="flex flex-col items-center gap-6 w-full max-w-[720px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-600 text-[12px] font-semibold px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            Intake automation for modern teams
          </div>

          {/* Headline */}
          <h1 className="text-[44px] sm:text-[52px] font-bold tracking-tight leading-[1.1] text-[#0A0A0A]">
            Your intake forms,<br />filled in seconds
          </h1>

          {/* Sub */}
          <p className="text-[17px] sm:text-[18px] text-[#71717A] leading-relaxed max-w-[540px]">
            Upload any document — ID, invoice, or form. Our OCR reads it instantly
            and pre-fills your intake form. No manual typing. No errors.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <Link
              href="/auth/signup"
              className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[15px] rounded-[8px] transition-colors flex items-center gap-2"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="h-11 px-6 border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#F4F4F5] font-semibold text-[15px] rounded-[8px] transition-colors flex items-center"
            >
              See how it works
            </a>
          </div>

          {/* Product mockup */}
          <div className="w-full mt-6">
            <ProductMockup />
          </div>
        </FadeIn>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────────────────────────── */}
      <FadeIn as="section" className="bg-[#F4F4F5] py-5 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap text-center">
          <span className="text-[13px] font-medium text-[#71717A] shrink-0">
            Trusted by teams in
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Healthcare", emoji: "🏥" },
              { label: "Legal",      emoji: "⚖️" },
              { label: "Finance",    emoji: "📊" },
              { label: "HR",         emoji: "👥" },
              { label: "Government", emoji: "🏛️" },
            ].map(({ label, emoji }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 bg-white border border-[#E4E4E7] text-[13px] font-medium text-[#3F3F46] px-3 py-1.5 rounded-full"
              >
                <span>{emoji}</span> {label}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-[34px] font-bold tracking-tight text-[#0A0A0A]">
              Three steps to zero manual entry
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload",
                desc: "Drop in a photo of any document — ID, invoice, or intake form. JPEG, PNG, and WEBP are all supported.",
                delay: 0,
              },
              {
                step: "02",
                icon: ScanText,
                title: "Extract",
                desc: "Tesseract.js reads and extracts every field instantly inside your browser. Your document never touches a server.",
                delay: 120,
              },
              {
                step: "03",
                icon: FileCheck2,
                title: "Submit",
                desc: "Review the pre-filled fields, make any edits, and submit. A PDF summary is generated and saved automatically.",
                delay: 240,
              },
            ].map(({ step, icon: Icon, title, desc, delay }) => (
              <FadeIn key={step} delay={delay} className="flex flex-col gap-4">
                <div className="text-[48px] font-extrabold text-orange-500 leading-none">{step}</div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[18px] font-bold text-[#0A0A0A]">{title}</h3>
                <p className="text-[14px] text-[#71717A] leading-relaxed">{desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE BENTO GRID ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-[34px] font-bold tracking-tight text-[#0A0A0A]">
              Everything you need, nothing you don&apos;t
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full-width — Client-side OCR */}
              <div className="sm:col-span-2 bg-white border border-[#E4E4E7] rounded-xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0A0A0A] mb-1">Client-side OCR</h3>
                  <p className="text-[14px] text-[#71717A] leading-relaxed max-w-lg">
                    Tesseract.js runs entirely in the browser as a Web Worker. Your documents are never uploaded to
                    a server during text extraction — full privacy by design.
                  </p>
                </div>
              </div>

              {/* Half — Instant PDF */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-7">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0A0A0A] mb-1.5">Instant PDF generation</h3>
                <p className="text-[13px] text-[#71717A] leading-relaxed">
                  Every completed submission generates a clean, downloadable PDF summary using pdf-lib — no external service needed.
                </p>
              </div>

              {/* Half — Secure */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-7">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0A0A0A] mb-1.5">Secure by default</h3>
                <p className="text-[13px] text-[#71717A] leading-relaxed">
                  Row-level security is enforced on every Supabase table. Each user can only read and write their own submissions.
                </p>
              </div>

              {/* Half — Multi-step */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-7">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                  <LayoutList className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0A0A0A] mb-1.5">Multi-step form flow</h3>
                <p className="text-[13px] text-[#71717A] leading-relaxed">
                  A structured four-step process — upload, personal info, additional details, and a review step before final submission.
                </p>
              </div>

              {/* Half — Onboarding */}
              <div className="bg-white border border-[#E4E4E7] rounded-xl p-7">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0A0A0A] mb-1.5">Business onboarding</h3>
                <p className="text-[13px] text-[#71717A] leading-relaxed">
                  Teams set up a company profile on first sign-in. The workspace is personalized to your industry and company size.
                </p>
              </div>

              {/* Full-width — Supabase */}
              <div className="sm:col-span-2 bg-white border border-[#E4E4E7] rounded-xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#0A0A0A] mb-1">Supabase-powered</h3>
                  <p className="text-[14px] text-[#71717A] leading-relaxed max-w-lg">
                    Built on Supabase for authentication, PostgreSQL storage, and row-level security. Enterprise-grade
                    infrastructure with zero ops overhead.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────── */}
      <FadeIn as="section" className="py-20 px-6 border-y border-[#E4E4E7]">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { stat: "3",       label: "steps from upload to submission"   },
            { stat: "0",       label: "server uploads during OCR"         },
            { stat: "Instant", label: "PDF generated on every submission" },
          ].map(({ stat, label }) => (
            <div key={stat} className="flex flex-col items-center gap-1.5">
              <span className="text-[48px] font-extrabold text-orange-500 leading-none">{stat}</span>
              <span className="text-[13px] text-[#71717A] leading-snug max-w-[160px]">{label}</span>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-[34px] font-bold tracking-tight text-[#0A0A0A]">Common questions</h2>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="divide-y-0">
              {[
                {
                  question: "Is my document data secure?",
                  answer:
                    "Yes. OCR runs entirely inside your browser using Tesseract.js (WebAssembly). The raw document image is never sent to any server — only the extracted text is submitted with your form.",
                },
                {
                  question: "What file types are supported?",
                  answer:
                    "JPEG, PNG, and WEBP are supported. PDF and GIF uploads are blocked with a clear error. For best results, use a high-contrast image with clear, printed text.",
                },
                {
                  question: "Do I need to train the OCR?",
                  answer:
                    "No. IntakeOCR uses Tesseract.js with pre-trained English language data. It works out of the box on most printed documents, IDs, and invoices — no configuration needed.",
                },
                {
                  question: "Can I customize the form fields?",
                  answer:
                    "Custom field mapping is on the roadmap. Currently, IntakeOCR uses a standard intake form with personal info, company details, and additional notes. The OCR auto-fills based on regex pattern matching.",
                },
                {
                  question: "Is there a free plan?",
                  answer:
                    "Yes — signing up is free. You can submit intake forms and download PDFs without any payment. Paid plans for higher volume and team features are planned for the future.",
                },
              ].map(({ question, answer }) => (
                <FAQItem key={question} question={question} answer={answer} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────── */}
      <FadeIn as="section" className="bg-[#0F0F0F] py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-[36px] sm:text-[40px] font-bold text-white tracking-tight leading-tight">
            Ready to eliminate manual data entry?
          </h2>
          <p className="text-[16px] text-[#A1A1AA] leading-relaxed max-w-lg">
            Join teams in healthcare, legal, and finance who&apos;ve automated their intake process with OCR auto-fill.
          </p>
          <Link
            href="/auth/signup"
            className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[16px] rounded-[8px] transition-colors flex items-center gap-2 mt-2"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E4E4E7] px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: logo + copyright */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-orange-500 flex items-center justify-center">
              <ScanText className="w-3 h-3 text-white" />
            </div>
            <span className="text-[13px] font-semibold text-[#0A0A0A]">IntakeOCR</span>
            <span className="text-[12px] text-[#A1A1AA]">&copy; 2025</span>
          </div>

          {/* Right: links */}
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Contact"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[13px] text-[#71717A] hover:text-[#0A0A0A] transition-colors"
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
