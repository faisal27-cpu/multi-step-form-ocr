# Project 3: Multi-Step Form with OCR

## What is the end product?
A multi-step intake form where users upload a document image (ID, invoice, or custom form), Tesseract.js extracts the text via client-side OCR in the browser, and the extracted data is pre-filled into the form fields. On completion, a PDF summary is generated from the submitted data.

## Who is the user?
Business users submitting intake forms with document uploads.

## Core Features
- Multi-step form flow (minimum 3 steps)
- Document upload (image: JPEG, PNG, WEBP)
- Tesseract.js for client-side OCR (runs entirely in the browser via Web Worker)
- Auto-fill form fields from extracted OCR text using regex field mapping
- Review step before final submission
- PDF generation on form completion
- Supabase for storing submissions
- Supabase Auth for login/signup

## Tech Stack
- Next.js 14+ with App Router and TypeScript
- Tesseract.js for client-side OCR (WASM-based, no server calls)
- Supabase Auth + PostgreSQL for submissions
- Tailwind CSS + shadcn/ui
- PDF generation (pdf-lib)
- Deployed to Vercel

## Acceptance Criteria
- User can upload an image document and see fields auto-filled from OCR
- Multi-step form with progress indicator
- Final step generates a downloadable PDF
- Submissions saved to Supabase
- App is live on Vercel

## Edge Cases
- OCR returns no usable text — show manual entry fallback
- Unsupported file type (e.g. PDF, GIF) — show clear error before upload
- Empty form submission blocked by validation
- Unauthenticated users redirected to login
- Large images may take several seconds to process — show progress indicator
