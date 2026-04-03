import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get("submissionId");

  if (!submissionId) {
    return NextResponse.json({ error: "missing_submission_id" }, { status: 400 });
  }

  // Fetch row and verify ownership via RLS (anon client respects RLS)
  const { data: row, error } = await supabase
    .from("intake_submissions")
    .select("id, user_id, pdf_storage_path, status")
    .eq("id", submissionId)
    .single();

  if (error || !row) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Explicit ownership check (defence-in-depth beyond RLS)
  if (row.user_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (!row.pdf_storage_path) {
    return NextResponse.json({ error: "not_found", message: "PDF not yet generated." }, { status: 404 });
  }

  const service = createServiceClient();
  const pdfBucket = process.env.INTAKE_PDF_BUCKET ?? "intake-pdfs";
  const ttl = parseInt(process.env.INTAKE_PDF_SIGNED_URL_TTL ?? "3600", 10);

  const { data: signedData, error: signedError } = await service.storage
    .from(pdfBucket)
    .createSignedUrl(row.pdf_storage_path, ttl);

  if (signedError || !signedData) {
    console.error("Signed URL error:", signedError);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  return NextResponse.json({ pdfSignedUrl: signedData.signedUrl });
}
