"use client";

import { useState, useTransition } from "react";
import { ScanText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveBusinessProfile } from "@/app/actions/auth";

const INDUSTRIES = [
  { value: "healthcare", label: "Healthcare" },
  { value: "legal",      label: "Legal" },
  { value: "finance",    label: "Finance" },
  { value: "hr",         label: "HR & People Ops" },
  { value: "government", label: "Government" },
  { value: "other",      label: "Other" },
] as const;

const COMPANY_SIZES = [
  { value: "1-10",   label: "1–10 employees" },
  { value: "11-50",  label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "200+",   label: "200+ employees" },
] as const;

export function OnboardingForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!industry || !companySize) {
      setError("Please complete all required fields.");
      return;
    }

    const fd = new FormData(e.currentTarget);
    fd.set("industry", industry);
    fd.set("companySize", companySize);

    startTransition(async () => {
      try {
        await saveBusinessProfile(fd);
      } catch {
        setError("Something went wrong saving your profile. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center px-6 border-b border-border bg-background">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <ScanText className="w-4 h-4 text-primary-foreground" />
          </div>
          IntakeOCR
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-background border border-border rounded-xl shadow-sm p-8 space-y-6">
            {/* Heading */}
            <div className="space-y-1.5">
              <h1 className="text-xl font-semibold tracking-tight">Tell us about your organization</h1>
              <p className="text-sm text-muted-foreground">
                This helps us tailor IntakeOCR to your workflow. You only need to do this once.
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company name */}
              <div className="space-y-1.5">
                <Label htmlFor="companyName">Company name <span className="text-destructive">*</span></Label>
                <Input
                  id="companyName"
                  name="companyName"
                  required
                  placeholder="Acme Corporation"
                  maxLength={200}
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Industry */}
                <div className="space-y-1.5">
                  <Label htmlFor="industry">Industry <span className="text-destructive">*</span></Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="industry" disabled={isPending}>
                      <SelectValue placeholder="Select industry…" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((i) => (
                        <SelectItem key={i.value} value={i.value}>
                          {i.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Company size */}
                <div className="space-y-1.5">
                  <Label htmlFor="companySize">Company size <span className="text-destructive">*</span></Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger id="companySize" disabled={isPending}>
                      <SelectValue placeholder="Select size…" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job title */}
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle">Your role / job title <span className="text-destructive">*</span></Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  required
                  placeholder="Operations Manager"
                  maxLength={100}
                  disabled={isPending}
                />
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <Label htmlFor="companyWebsite">
                  Company website{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="companyWebsite"
                  name="companyWebsite"
                  type="url"
                  placeholder="https://acme.com"
                  disabled={isPending}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? "Saving…" : "Continue to IntakeOCR →"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="h-10 flex items-center justify-center text-xs text-muted-foreground border-t border-border bg-background">
        &copy; {new Date().getFullYear()} IntakeOCR. All rights reserved.
      </footer>
    </div>
  );
}
