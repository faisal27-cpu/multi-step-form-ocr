# API Contracts

All routes are under `/api/intake/`. All require a valid Supabase session cookie.

> No `/api/intake/ocr` route. OCR runs entirely client-side via Tesseract.js.

---

## POST /api/intake/upload

**Auth required:** Yes
**Purpose:** Store uploaded image in Supabase Storage for audit. OCR is performed client-side separately.

**Request:** multipart/form-data — `file` (JPEG/PNG/WEBP), `draftId` (uuid)

**Validation:**
- MIME: image/jpeg, image/png, image/webp only (no PDF — Tesseract is image-only)
- Size: <= 10 MB
- draftId: valid UUID

**Success 200:**
```json
{ "storagePath": "user-id/draft-id/filename.jpg" }
```

**Errors:**
- 400 `unsupported_file_type` — Only JPEG, PNG, WEBP accepted
- 400 `file_too_large` — Must be 10 MB or smaller
- 400 `invalid_draft_id`
- 401 `unauthorized`
- 500 `storage_error`

**Side effects:** Writes to `intake-documents` at `{userId}/{draftId}/{filename}`.

---

## POST /api/intake/submit

**Auth required:** Yes
**Purpose:** Validate form payload, persist submission, generate PDF, return signed URL.

**Request body (JSON):**
```typescript
{
  draftId: string;
  documentType: "id" | "invoice" | "document";
  storagePath: string;
  ocrRaw: string;
  ocrConfidence: Record<string, number>;
  formData: {
    fullName: string;
    dateOfBirth: string;
    idNumber: string;
    email: string;
    phone: string;
    address: string;
    submissionCategory: string;
    referenceNumber?: string;
    notes?: string;
  }
}
```

**Success 201:**
```json
{ "submissionId": "uuid", "pdfSignedUrl": "https://..." }
```

**Errors:**
- 400 `validation_error` with field-level Zod errors
- 401 `unauthorized`
- 500 `internal_error`

**Side effects:** INSERTs `intake_submissions`, generates PDF via pdf-lib, writes to `intake-pdfs`, UPDATEs row.

---

## GET /api/intake/download

**Auth required:** Yes
**Query params:** `submissionId` (uuid)

**Success 200:**
```json
{ "pdfSignedUrl": "https://..." }
```

**Errors:** 400 missing id, 401, 403 ownership mismatch, 404 not found

**Side effects:** None. TTL = `INTAKE_PDF_SIGNED_URL_TTL` seconds.
