import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const file    = formData.get("file") as File | null;
  const draftId = formData.get("draftId") as string | null;

  // Validate draftId
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!draftId || !uuidPattern.test(draftId)) {
    return NextResponse.json({ error: "invalid_draft_id" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }

  // Validate MIME type
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "unsupported_file_type", message: "Only JPEG, PNG, and WEBP images are accepted." },
      { status: 400 }
    );
  }

  // Validate size
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "file_too_large", message: "File must be 10 MB or smaller." },
      { status: 400 }
    );
  }

  // Sanitise filename
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const storagePath = `${user.id}/${draftId}/${safeName}`;

  // Upload using the service-role client so server-side RLS doesn't block the write
  const service = createServiceClient();
  const fileBuffer = await file.arrayBuffer();

  const { error: uploadError } = await service.storage
    .from(process.env.INTAKE_DOC_BUCKET ?? "intake-documents")
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json(
      { error: "storage_error", message: "Failed to store document. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ storagePath });
}
