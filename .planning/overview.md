# Multi-Step Form with OCR — Project Overview

## Project Summary and Goals

An intake-form workflow for authenticated business users. Users navigate a multi-step form (minimum three discrete steps), upload a document image, and receive OCR-extracted field values pre-filled into the form — all processed client-side in the browser via Tesseract.js. On completion they download a PDF summary, and the full submission is persisted to Supabase.

### Success Metrics
- OCR auto-fill triggers on every successful image upload.
- Zero successful submissions without authentication.
- PDF is generated and downloadable in under 5 seconds for typical submissions.
- All submissions queryable per user in Supabase.

---

## User Journey Narrative

### Step 0 — Unauthenticated access attempt
A user visits `/dashboard/intake/new` without a session. The middleware detects the missing user and redirects to `/auth/login?next=/dashboard/intake/new`.

### Step 1 — Document Upload
The user sees a drop-zone accepting JPEG, PNG, and WEBP images up to 10 MB. A client-side type/size check runs immediately — unsupported types (PDF, GIF) are rejected inline before any upload. On pass:
1. The file is POSTed to `POST /api/intake/upload` → streamed to Supabase Storage for record-keeping.
2. Tesseract.js initialises in a Web Worker and begins OCR on the image in the browser.

A progress bar ("Reading document… 42%") is shown. When complete, extracted text is passed through a client-side field mapper (regex heuristics) producing an `OcrFieldMap`. Fields are merged into form state; unmatched fields are left empty for manual entry.

### Step 2 — Personal / Business Information
Pre-filled inputs from OCR. OCR-sourced fields are visually highlighted. Zod + react-hook-form validates in real time. User cannot advance until all required fields are valid.

### Step 3 — Additional Details
Submission category, reference number, notes — not typically extractable from OCR. Same validation pattern.

### Step 4 — Review
Read-only summary of all values + uploaded filename. User can jump back to any step. On "Submit" → `POST /api/intake/submit`.

### Step 5 — Submission and PDF Download
Server validates with Zod, inserts `intake_submissions` row, generates PDF via `pdf-lib`, uploads to Supabase Storage, returns a signed download URL. Browser prompts download immediately. Success screen shows "Download again" and "Back to dashboard".

---

## Key Technical Decisions

### Tesseract.js (client-side) over Azure Document Intelligence
Tesseract.js runs in the browser via WebAssembly — no API keys, no per-request cost, no network round-trip for OCR. Trade-off: returns raw text rather than structured key-value pairs, so field extraction uses client-side regex/heuristic mapping. Accuracy on clean printed documents is acceptable; the manual-entry fallback covers failures.

### Image-only uploads (JPEG, PNG, WEBP)
Tesseract.js processes raster images. PDF-to-image conversion adds significant complexity and is out of scope. Clearly communicated in the UI.

### pdf-lib for PDF generation
Pure-TypeScript, no native deps, ~280 KB, runs in a Vercel Route Handler. Ideal for the structured single-page layout needed.

### Supabase Storage for uploaded images
OCR runs client-side, but the original image is still uploaded server-side for audit trail and potential future reprocessing. RLS ensures per-user isolation.

### React Context + sessionStorage
Form state is session-scoped. Context avoids a state-management dep. sessionStorage handles refresh. URL params track step for back/forward navigation.

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Tesseract WASM initial load (~5–8 MB) | High | Medium | Show "Loading OCR engine…" spinner. Cache worker across uploads in same session. |
| Poor accuracy on low-quality / handwritten docs | High | Medium | Unmatched fields left empty, not wrong. UI guidance: "Upload a clear, well-lit image." |
| WASM unsupported in older browsers | Low | Low | Graceful fallback: "OCR not supported — enter fields manually." |
| Image processing >30 s | Medium | Medium | Real-time Tesseract progress events. Cancel button advances to manual entry. |
| Supabase Storage RLS misconfiguration | Low | Critical | Bucket policy tied to `auth.uid()` path prefix. Integration test validates isolation. |
| Session expiry mid-form | Medium | Medium | Middleware refreshes session. On 401, redirect to login with `next`; sessionStorage draft rehydrates on return. |
