import Link from "next/link";
import { ArrowRight, ScanText, FileCheck2, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-sm tracking-tight">IntakeOCR</span>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button size="sm" asChild>
                <Link href="/dashboard/intake/new">
                  Start New Intake
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground">
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Get started free</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 gap-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
          <ScanText className="w-3.5 h-3.5" />
          Client-side OCR — your document never leaves your device
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-tight">
          Intake forms that fill themselves
        </h1>

        <p className="text-muted-foreground max-w-md text-base leading-relaxed">
          Upload an ID, invoice, or document image. We extract the text instantly in your browser
          and pre-fill the form — no manual typing, no server uploads during OCR.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          {user ? (
            <Button size="lg" asChild>
              <Link href="/dashboard/intake/new">
                Start New Intake
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Get started free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-16">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto">
              <ScanText className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm">Instant OCR</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tesseract.js reads your document in the browser — no data sent to a server during extraction.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto">
              <FileCheck2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm">PDF summary</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every completed submission generates a downloadable PDF summary automatically.
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm">Secure storage</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Submissions are stored in Supabase with row-level security — only you can see your data.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        IntakeOCR &mdash; built with Next.js, Tesseract.js, and Supabase
      </footer>
    </main>
  );
}
