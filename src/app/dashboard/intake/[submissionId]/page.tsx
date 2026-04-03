import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PdfDownloadButton } from "@/components/intake/PdfDownloadButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Tables } from "@/types";

export const metadata: Metadata = { title: "Submission Detail | Document OCR" };

function formatDate(raw: string): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 py-1.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{value || "—"}</dd>
    </div>
  );
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/dashboard");

  const { data: submission } = await supabase
    .from("intake_submissions")
    .select("*")
    .eq("id", submissionId)
    .eq("user_id", user.id)
    .single();

  if (!submission) notFound();

  const CATEGORY_LABELS: Record<string, string> = {
    employment: "Employment",
    financial: "Financial",
    medical: "Medical",
    legal: "Legal",
    other: "Other",
  };

  const row = submission as Tables<"intake_submissions">;
  const formData = row.form_data as Record<string, string>;

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">Submission detail</h1>
            <p className="text-xs text-muted-foreground font-mono mt-1">{row.id}</p>
          </div>
          {row.pdf_storage_path && (
            <PdfDownloadButton submissionId={row.id} label="Download PDF" />
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Personal information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <ReviewRow label="Full name" value={formData.fullName ?? ""} />
              <Separator className="my-0.5" />
              <ReviewRow label="Date of birth" value={formatDate(formData.dateOfBirth ?? "")} />
              <Separator className="my-0.5" />
              <ReviewRow label="ID / document number" value={formData.idNumber ?? ""} />
              <Separator className="my-0.5" />
              <ReviewRow label="Email" value={formData.email ?? ""} />
              <Separator className="my-0.5" />
              <ReviewRow label="Phone" value={formData.phone ?? ""} />
              <Separator className="my-0.5" />
              <ReviewRow label="Address" value={formData.address ?? ""} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Additional details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl>
              <ReviewRow label="Category" value={CATEGORY_LABELS[formData.submissionCategory] ?? formData.submissionCategory ?? ""} />
              <Separator className="my-0.5" />
              <ReviewRow label="Reference number" value={formData.referenceNumber ?? ""} />
              <Separator className="my-0.5" />
              <ReviewRow label="Notes" value={formData.notes ?? ""} />
            </dl>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Submitted {new Date(row.created_at).toLocaleString()}
        </p>
      </div>
    </main>
  );
}
