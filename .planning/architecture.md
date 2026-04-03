# System Architecture

## Overview

Next.js 14+ App Router project deployed to Vercel. Auth via Supabase Auth. Data in Supabase PostgreSQL. Files in Supabase Storage. **OCR runs client-side in the browser via Tesseract.js (WebAssembly Web Worker) — no server-side OCR route.** PDF generation runs in a Vercel Route Handler using pdf-lib.

---

## Directory / File Tree

```
multi-step-form-ocr/
├── middleware.ts                          # Protects /dashboard routes
├── vercel.json                            # maxDuration: 60 for submit route only
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx                       # Redirects to /dashboard/intake/new
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                 # Dashboard shell (auth guard)
│   │   │   └── intake/
│   │   │       ├── new/
│   │   │       │   ├── page.tsx           # NEW — renders IntakeFormShell
│   │   │       │   └── loading.tsx        # NEW — Suspense skeleton
│   │   │       └── [submissionId]/
│   │   │           └── page.tsx           # NEW — read-only submission + download
│   │   └── api/
│   │       └── intake/
│   │           ├── upload/
│   │           │   └── route.ts           # NEW — POST: store image in Supabase Storage
│   │           ├── submit/
│   │           │   └── route.ts           # NEW — POST: validate, insert DB row, generate PDF
│   │           └── download/
│   │               └── route.ts           # NEW — GET: fresh signed URL for PDF
│   ├── components/
│   │   ├── ui/                            # shadcn primitives
│   │   └── intake/
│   │       ├── IntakeFormShell.tsx        # NEW — context provider + step router (client)
│   │       ├── StepIndicator.tsx          # NEW — horizontal progress bar
│   │       ├── StepUpload.tsx             # NEW — drop-zone + Tesseract OCR trigger
│   │       ├── StepPersonalInfo.tsx       # NEW — Step 2: pre-filled fields
│   │       ├── StepAdditionalDetails.tsx  # NEW — Step 3: category, notes
│   │       ├── StepReview.tsx             # NEW — Step 4: read-only summary
│   │       ├── StepSuccess.tsx            # NEW — Step 5: download + links
│   │       ├── DocumentDropZone.tsx       # NEW — drag-and-drop widget
│   │       ├── OcrFieldInput.tsx          # NEW — input with OCR-source badge
│   │       ├── OcrStatusBanner.tsx        # NEW — idle/loading/success/error states
│   │       └── PdfDownloadButton.tsx      # NEW — triggers signed-URL download
│   ├── lib/
│   │   ├── supabase/                      # client.ts, server.ts, middleware.ts
│   │   ├── ocr/
│   │   │   └── tesseract.ts              # NEW — Tesseract.js worker wrapper + field mapper
│   │   ├── pdf/
│   │   │   └── generateIntakePdf.ts       # NEW — pdf-lib template
│   │   ├── validations/
│   │   │   └── intake.ts                  # NEW — Zod schemas for all steps
│   │   └── utils.ts
│   ├── context/
│   │   └── IntakeFormContext.tsx          # NEW — React context for form state
│   ├── hooks/
│   │   └── useIntakeForm.ts               # NEW — typed hook for IntakeFormContext
│   └── types/
│       ├── database.ts                    # Extended with intake_submissions
│       ├── index.ts                       # Re-exports + domain types
│       └── intake.ts                      # NEW — OcrFieldMap, FormStep, IntakeFormState
├── supabase/
│   └── migrations/
│       ├── 0001_initial.sql
│       └── 0002_intake_submissions.sql
```

---

## Data Flow Diagrams

### Client-Side OCR Flow

```
Browser (StepUpload)
  |
  | 1. User selects image — client validates type (JPEG/PNG/WEBP) and size (<= 10 MB)
  |    Unsupported type → inline error, no upload
  |
  | 2. POST /api/intake/upload  { file: FormData, draftId: string }
  |    → stores image in Supabase Storage: intake-documents/{userId}/{draftId}/{filename}
  |    → returns { storagePath }
  |
  | 3. Tesseract.js Web Worker initialises (WASM loaded from CDN, ~5-8 MB first time)
  |    Tesseract.recognize(imageFile) → emits progress events (0–100%)
  |    OcrStatusBanner shows live progress bar
  |
  | 4. Tesseract returns { data: { text, words, confidence } }
  |    mapTextToFields(text) → OcrFieldMap (regex heuristics per field)
  |    Fields with no match → { value: '', confidence: 0 }
  |
  | 5. IntakeFormContext.setOcrResult(ocrFieldMap)
  |    → form fields in Step 2 pre-populated
  v
Browser (StepPersonalInfo) — inputs pre-filled, user verifies
```

### Form Submission and PDF Generation Flow

```
Browser (StepReview → Submit)
  |
  | POST /api/intake/submit  { formData, draftId, storagePath, documentType }
  v
Route Handler (submit/route.ts)
  |-- authenticate user
  |-- validate payload with Zod (intakeSubmissionSchema)
  |-- INSERT intake_submissions row (status: 'draft')
  |-- generateIntakePdf({ submissionId, fields, createdAt })
  |-- upload PDF to intake-pdfs/{userId}/{submissionId}.pdf
  |-- UPDATE intake_submissions: pdf_storage_path, status: 'complete'
  |-- createSignedUrl (TTL from env)
  |-- return { submissionId, pdfSignedUrl }
  |
  v
Browser — download triggered, StepSuccess rendered
```

### Auth Flow

```
Request → middleware.ts
  → updateSession() / getUser()
  → no user: redirect /auth/login?next=...
  → user present: NextResponse.next()
  → DashboardLayout server-side getUser() (defence-in-depth)
  → IntakeFormShell renders
```

---

## API Routes

### POST /api/intake/upload
- Auth: required
- Request: `multipart/form-data` — `file` (image), `draftId` (uuid)
- Success 200: `{ storagePath: string }`
- Errors: 400 invalid type/size, 401, 500 storage error
- Side effects: writes image to `intake-documents` bucket

### POST /api/intake/submit
- Auth: required
- Request body (JSON): `IntakeSubmissionPayload`
- Success 201: `{ submissionId: string, pdfSignedUrl: string }`
- Errors: 400 validation failure with field errors, 401, 500 DB/PDF error
- Side effects: inserts `intake_submissions` row, generates PDF, writes to `intake-pdfs`

### GET /api/intake/download
- Auth: required
- Query: `submissionId` (uuid)
- Success 200: `{ pdfSignedUrl: string }` (fresh 60-min signed URL)
- Errors: 401, 403 ownership mismatch, 404 not found

> Note: No `/api/intake/ocr` route. OCR runs entirely in the browser via Tesseract.js.

---

## Supabase Schema

### Table: `intake_submissions`

```sql
CREATE TABLE IF NOT EXISTS intake_submissions (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_id          uuid NOT NULL,
  document_type     text NOT NULL CHECK (document_type IN ('id', 'invoice', 'document')),
  storage_path      text,
  pdf_storage_path  text,
  form_data         jsonb NOT NULL DEFAULT '{}',
  ocr_raw           jsonb,   -- raw Tesseract text for audit
  ocr_confidence    jsonb,   -- per-field confidence from field mapper
  status            text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'complete', 'error')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
```

RLS: users can SELECT/INSERT/UPDATE their own rows only (see migration).

### Storage Buckets
- `intake-documents` (private) — uploaded images
- `intake-pdfs` (private) — generated PDF summaries

---

## Environment Variables

```
# Supabase (public)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase service role — SERVER ONLY
SUPABASE_SERVICE_ROLE_KEY=

# Storage config
INTAKE_PDF_BUCKET=intake-pdfs
INTAKE_DOC_BUCKET=intake-documents
INTAKE_PDF_SIGNED_URL_TTL=3600
```

No Azure or other third-party API credentials required. Tesseract.js loads its WASM and language data from a CDN at runtime (no build-time configuration needed).
