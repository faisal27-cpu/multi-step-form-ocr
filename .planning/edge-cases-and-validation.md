# Edge Cases and Validation

---

## File Upload Constraints

**Accepted:** image/jpeg, image/png, image/webp
**Rejected:** application/pdf, image/gif, all others

PDF is NOT supported — Tesseract.js is image-only. Clearly communicated in the drop-zone label.

| Check | Where | Behaviour |
|---|---|---|
| Wrong MIME type | Client (DocumentDropZone) | Inline error, no upload initiated |
| File > 10 MB | Client (DocumentDropZone) | Inline error, no upload initiated |
| Wrong MIME (bypass) | Server (upload/route.ts) | 400 unsupported_file_type |
| File > 10 MB (bypass) | Server (upload/route.ts) | 400 file_too_large |

---

## Step 2 Field Validation (step2Schema)

| Field | Rules |
|---|---|
| fullName | required, 2–100 chars |
| dateOfBirth | required, valid ISO date, must be in the past |
| idNumber | required, 3–50 chars, alphanumeric + hyphens |
| email | required, valid email |
| phone | required, 7–20 chars, digits/spaces/+/hyphens |
| address | required, 5–200 chars |

---

## Step 3 Field Validation (step3Schema)

| Field | Rules |
|---|---|
| submissionCategory | required, enum: employment/financial/medical/legal/other |
| referenceNumber | optional, max 50 chars |
| notes | optional, max 1000 chars |

---

## Server-Side Validation (intakeSubmissionSchema)

Merges step2Schema + step3Schema. Also validates:
- draftId: valid UUID
- documentType: "id" | "invoice" | "document"
- storagePath: non-empty string

On failure: 400 `{ error: "validation_error", fields: ZodFormattedErrors }`

---

## OCR Failure Handling

**Worker init failure** (WASM unsupported or CDN unreachable):
- Detect `window.Worker` / WebAssembly availability before init
- OcrStatusBanner → error: "OCR not supported in this browser — enter fields manually"
- Skip OCR always available as escape hatch

**Recognition failure** (corrupt image, processing error):
- OcrStatusBanner → error: "Could not read document — enter fields manually"
- mapTextToFields returns all confidence=0

**No text extracted** (blank image, very low quality):
- mapTextToFields finds no regex matches → all fields empty, confidence=0
- No error shown — treated as successful OCR with no matches
- User fills manually

---

## Auth Edge Cases

| Scenario | Behaviour |
|---|---|
| Unauthenticated /dashboard/intake/new | middleware → 307 /auth/login?next=... |
| Session expires during upload | 401 → IntakeFormShell redirects to login; draft preserved in sessionStorage |
| Session expires during submit | 401 → same redirect; draft preserved |
| Returns after re-login | sessionStorage rehydrates; continues from saved step |
| Wrong user's submissionId | download route → 403 forbidden |

---

## Duplicate Submission Guard

Before POST /api/intake/submit:
1. Check sessionStorage for `submitted_{draftId}`
2. Found → show "Already submitted" UI with download link, block re-submit
3. Not found → submit → on success set `submitted_{draftId}="1"`

---

## Network Failure Handling

| Scenario | Behaviour |
|---|---|
| Upload fails | Error in StepUpload: "Upload failed — try again." OCR still runs (client-side). |
| Submit fails (non-401) | sonner toast: "Submission failed — try again." Form state preserved. |
| Download fails | Error in PdfDownloadButton: "Could not generate download link." |
| Tesseract CDN unreachable | Worker init fails → OCR error state → manual entry |

---

## Unsupported Browser

If window.Worker or WebAssembly unavailable:
- Detect before Tesseract init
- Show banner: "Document OCR is not available in this browser. Please enter your details manually."
- Form proceeds normally without OCR.
