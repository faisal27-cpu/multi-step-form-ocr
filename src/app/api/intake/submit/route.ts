import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { intakeSubmissionSchema } from "@/lib/validations/intake";
import { generateIntakePdf } from "@/lib/pdf/generateIntakePdf";

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Validate with Zod
  const parsed = intakeSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", fields: parsed.error.format() },
      { status: 400 }
    );
  }

  const { draftId, documentType, storagePath, ocrRaw, ocrConfidence, formData } = parsed.data;

  const service = createServiceClient();
  const pdfBucket = process.env.INTAKE_PDF_BUCKET ?? "intake-pdfs";
  const createdAt = new Date().toISOString();

  // 1. Insert draft row
  const { data: row, error: insertError } = await service
    .from("intake_submissions")
    .insert({
      user_id:       user.id,
      draft_id:      draftId,
      document_type: documentType,
      storage_path:  storagePath,
      form_data:     formData as Record<string, unknown>,
      ocr_raw:       ocrRaw,
      ocr_confidence: ocrConfidence,
      status:        "draft",
      created_at:    createdAt,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    console.error("DB insert error:", insertError);
    return NextResponse.json({ error: "internal_error", message: "Failed to save submission." }, { status: 500 });
  }

  const submissionId = row.id;

  try {
    // 2. Generate PDF
    const pdfBytes = await generateIntakePdf({
      submissionId,
      fields: formData,
      createdAt,
    });

    // 3. Upload PDF
    const pdfPath = `${user.id}/${submissionId}.pdf`;
    const { error: pdfUploadError } = await service.storage
      .from(pdfBucket)
      .upload(pdfPath, pdfBytes, { contentType: "application/pdf", upsert: true });

    if (pdfUploadError) throw pdfUploadError;

    // 4. Create signed URL
    const ttl = parseInt(process.env.INTAKE_PDF_SIGNED_URL_TTL ?? "3600", 10);
    const { data: signedData, error: signedError } = await service.storage
      .from(pdfBucket)
      .createSignedUrl(pdfPath, ttl);

    if (signedError || !signedData) throw signedError ?? new Error("Signed URL failed");

    // 5. Update row to complete
    await service
      .from("intake_submissions")
      .update({ pdf_storage_path: pdfPath, status: "complete" })
      .eq("id", submissionId);

    return NextResponse.json(
      { submissionId, pdfSignedUrl: signedData.signedUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error("PDF/upload error:", err);

    // Mark row as errored
    await service
      .from("intake_submissions")
      .update({ status: "error" })
      .eq("id", submissionId);

    return NextResponse.json(
      { error: "internal_error", message: "Submission saved but PDF generation failed." },
      { status: 500 }
    );
  }
}
