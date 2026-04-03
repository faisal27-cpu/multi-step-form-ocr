# Implementation Phases

---

## Phase 0 — Scaffold and Configuration COMPLETE

**Goal:** Next.js project scaffolded, all dependencies installed, env files and migrations in place.

**Completed:**
- Next.js 16 + TypeScript + Tailwind v4 + shadcn
-  installed (client-side OCR, replaces Azure Document Intelligence)
- , , , , ,  installed
-  protecting /dashboard routes
- -  +  (no Azure vars)
-  with maxDuration: 60 for submit route only
-  passes

**Manual steps before Phase 2:**
- Fill .env.local with Supabase URL, anon key, service role key
- Create intake-documents and intake-pdfs buckets in Supabase Storage (private)
- Run npx supabase db push to apply migrations

---

## Phase 1 — Auth Pages

**Goal:** Login, signup, and dashboard layout with auth protection.

**Tasks:**
1. Create src/app/dashboard/layout.tsx — server-side getUser() guard.
2. Create src/app/auth/login/page.tsx — email/password login.
3. Create src/app/auth/signup/page.tsx — signup form.
4. Create src/app/actions/auth.ts — signIn, signUp, signOut Server Actions.

**Acceptance test:** Unauthenticated GET /dashboard/intake/new redirects to /auth/login?next=...

---

## Phase 2 — Types and Zod Schemas

**Goal:** All TypeScript types and Zod schemas for the intake domain.

**Tasks:**
1. Extend src/types/database.ts with intake_submissions Row/Insert/Update.
2. Create src/types/intake.ts: OcrFieldMap, IntakeFormState, FormStep, IntakeSubmissionPayload.
3. Create src/lib/validations/intake.ts: step2Schema, step3Schema, intakeSubmissionSchema, fileUploadSchema (JPEG/PNG/WEBP only, max 10 MB).
4. Update src/types/index.ts to re-export IntakeSubmission.

**Files to create / modify:**
- src/types/database.ts
- src/types/intake.ts
- src/types/index.ts
- src/lib/validations/intake.ts

**Acceptance test:** npm run typecheck passes. Each schema .safeParse({}) returns expected error keys.

---

## Phase 3 — React Context and Form State

**Goal:** State management layer for the multi-step form.

**Tasks:**
1. Create src/context/IntakeFormContext.tsx:
   - State: IntakeFormState, FormStep, draftId, storagePath, ocrResult: OcrFieldMap
   - draftId initialised once with crypto.randomUUID()
   - Persist to sessionStorage on change (key: intake_draft_{draftId})
   - Rehydrate from sessionStorage on mount
   - Actions: setStep, updateFields, setOcrResult, setStoragePath, resetForm
   - Step synced to URL ?step=upload so browser back/forward works
2. Create src/hooks/useIntakeForm.ts — typed hook, throws if used outside provider.

**Files to create:**
- src/context/IntakeFormContext.tsx
- src/hooks/useIntakeForm.ts

**Acceptance test:** Advance steps, refresh — state restored. Back button returns to previous step.

---

## Phase 4 — Form Step UI Components

**Goal:** All visual step components with mock OCR data.

**Tasks:**
1. StepIndicator.tsx — horizontal step bar (Upload / Info / Details / Review).
2. DocumentDropZone.tsx — drag-and-drop, JPEG/PNG/WEBP only, client-side rejection with inline error, file preview.
3. OcrStatusBanner.tsx — idle / loading (progress bar + percentage) / success / error states.
4. OcrFieldInput.tsx — wraps Input, shows blue left border + OCR badge when ocrFilled=true.
5. StepUpload.tsx — drop-zone + OCR status banner + Skip OCR button.
6. StepPersonalInfo.tsx — fullName, dateOfBirth, idNumber, email, phone, address. Validates with step2Schema.
7. StepAdditionalDetails.tsx — submissionCategory (select), referenceNumber, notes. Validates with step3Schema.
8. StepReview.tsx — read-only summary, Edit links per section.
9. StepSuccess.tsx — submission ID, PdfDownloadButton, New submission button.
10. PdfDownloadButton.tsx — GET /api/intake/download, triggers programmatic download.
11. IntakeFormShell.tsx — IntakeFormProvider + step router, reads step from URL.
12. src/app/dashboard/intake/new/page.tsx — Server Component, renders IntakeFormShell.
13. src/app/dashboard/intake/[submissionId]/page.tsx — read-only submission detail.
14. src/app/dashboard/intake/new/loading.tsx — Suspense skeleton.

**Acceptance test:** All steps render, navigate, validate. Review shows all data. Back navigation works.

---

## Phase 5 — Tesseract OCR + API Routes

**Goal:** Wire real client-side OCR and all server API routes.

**Tasks:**

### Tesseract field mapper
1. Create src/lib/ocr/tesseract.ts:
   - Export runOcr(imageFile: File, onProgress: (pct: number) => void): Promise<OcrFieldMap>
   - Uses tesseract.js createWorker with eng language
   - Calls mapTextToFields(rawText) after recognition
   - mapTextToFields uses regex to extract: name, DOB, ID number, email, phone, address
   - Returns OcrFieldMap: matched fields confidence=1, unmatched confidence=0
   - Terminates worker after completion

### Upload route
2. Create src/app/api/intake/upload/route.ts:
   - multipart/form-data: file + draftId
   - Validate MIME (jpeg/png/webp) + size (<= 10 MB)
   - Authenticate, upload to intake-documents/{userId}/{draftId}/{filename}
   - Return { storagePath }

### Submit route  
3. Create src/lib/pdf/generateIntakePdf.ts — pdf-lib: header, field grid, footer.
4. Create src/app/api/intake/submit/route.ts:
   - Validate with intakeSubmissionSchema
   - INSERT intake_submissions (status: draft)
   - generateIntakePdf, upload to intake-pdfs
   - UPDATE row: pdf_storage_path, status: complete
   - Return { submissionId, pdfSignedUrl }

### Download route
5. Create src/app/api/intake/download/route.ts:
   - Auth + ownership check, return fresh signed URL

### Wire StepUpload
6. Update StepUpload.tsx: call runOcr() with progress callback, call /api/intake/upload.

**Acceptance test:** Upload real JPEG, fields populate. Complete form, PDF downloads. Row in Supabase.

---

## Phase 6 — Polish and Edge Cases

**Goal:** All error states, UX refinements, edge case handling.

**Tasks:**
1. Skip OCR button: empty ocrResult, advance to Step 2.
2. Client-side file rejection: inline error before any network request.
3. Tesseract error: OcrStatusBanner error state, manual entry allowed.
4. Duplicate submission guard: sessionStorage flag submitted_{draftId}.
5. Session-expiry: 401 in IntakeFormShell redirects to /auth/login?next=...
6. resetForm() on Back to Dashboard clears sessionStorage draft.
7. Add Intake nav item to sidebar.

**Acceptance test:** GIF upload rejected inline. Skip OCR works. Session expiry redirects. Duplicate submit shows error.

---

## Phase 7 — Deployment

**Goal:** Ship to Vercel.

**Tasks:**
1. Add env vars to Vercel (no Azure vars needed).
2. Apply migration to production Supabase.
3. Create Storage buckets with RLS in production.
4. vercel --prod.
5. Smoke test: upload image, OCR fills fields, submit, download PDF.
