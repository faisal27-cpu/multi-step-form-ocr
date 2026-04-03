# UI Components Reference

All new components: `src/components/intake/`. Shadcn primitives: `src/components/ui/`.

---

## IntakeFormShell

**Path:** `src/components/intake/IntakeFormShell.tsx` | Client Component

Wraps everything in `IntakeFormProvider`. Reads `?step` from URL. Renders `StepIndicator` + active step. Catches 401 → redirect to login.

---

## StepIndicator

**Path:** `src/components/intake/StepIndicator.tsx` | Client Component

Horizontal progress bar: Upload → Info → Details → Review. Current step highlighted in primary. Completed steps show check icon.

```typescript
Props: { currentStep: FormStep }
```

---

## DocumentDropZone

**Path:** `src/components/intake/DocumentDropZone.tsx` | Client Component

Drag-and-drop file input. Accepts JPEG/PNG/WEBP only. Client-side type + size rejection with inline error (no toast). Shows filename, size, thumbnail preview after selection.

```typescript
Props: { onFile: (file: File) => void; isLoading: boolean; error?: string }
```

Shadcn: Card, Button

---

## OcrStatusBanner

**Path:** `src/components/intake/OcrStatusBanner.tsx` | Client Component

Shows OCR state below the drop-zone.
- idle: hidden
- loading: spinner + "Reading document…" + progress %
- success: green check + "Fields pre-filled — please verify"
- error: red warning + "Could not read document — enter fields manually"

```typescript
Props: { status: 'idle' | 'loading' | 'success' | 'error'; progress?: number }
```

---

## OcrFieldInput

**Path:** `src/components/intake/OcrFieldInput.tsx` | Client Component

Wraps shadcn `Input`. When `ocrFilled=true`: blue left border + small "OCR" badge. Badge disappears when user edits. Compatible with react-hook-form via `forwardRef`.

```typescript
Props: { ocrFilled?: boolean } & React.InputHTMLAttributes<HTMLInputElement>
```

Shadcn: Input, Badge

---

## StepUpload (Step 1)

**Path:** `src/components/intake/StepUpload.tsx` | Client Component

Renders DocumentDropZone + OcrStatusBanner. On file select:
1. POST /api/intake/upload → context.setStoragePath
2. runOcr(file, onProgress) → context.setOcrResult

"Skip OCR" button sets empty OcrFieldMap + advances step.

Local state: `ocrStatus`, `ocrProgress`, `uploadError`

---

## StepPersonalInfo (Step 2)

**Path:** `src/components/intake/StepPersonalInfo.tsx` | Client Component

react-hook-form with fields: fullName, dateOfBirth, idNumber, email, phone, address. Each uses OcrFieldInput. Validates with step2Schema. On Next: updateFields(values) + setStep('details').

Shadcn: Label, Card

---

## StepAdditionalDetails (Step 3)

**Path:** `src/components/intake/StepAdditionalDetails.tsx` | Client Component

Fields: submissionCategory (Select), referenceNumber (Input), notes (Textarea). Validates with step3Schema.

Shadcn: Select, Textarea, Label

---

## StepReview (Step 4)

**Path:** `src/components/intake/StepReview.tsx` | Client Component

Read-only two-column grid of all values grouped by section. Edit buttons per section call setStep. Submit button calls POST /api/intake/submit.

Shadcn: Card, Separator, Button

---

## StepSuccess (Step 5)

**Path:** `src/components/intake/StepSuccess.tsx` | Client Component

Shows submission ID, PdfDownloadButton, "New submission" button (resetForm + navigate).

---

## PdfDownloadButton

**Path:** `src/components/intake/PdfDownloadButton.tsx` | Client Component

Calls GET /api/intake/download?submissionId=..., receives signed URL, triggers programmatic download via hidden anchor.

```typescript
Props: { submissionId: string; label?: string }
```

Shadcn: Button
