# State Management

---

## Where State Lives

| State | Location | Reason |
|---|---|---|
| Current step | URL `?step=upload` | Browser back/forward work |
| Form field values | React Context + sessionStorage | Survives page refresh |
| Draft ID | React Context (crypto.randomUUID once) | Upload/submit idempotency |
| Storage path | React Context | Passed to submit route |
| OCR result (OcrFieldMap) | React Context | Drives pre-fill + OCR badges |
| Submission ID | React Context (set on success) | Passed to PdfDownloadButton |
| Tesseract progress | Local state in StepUpload | Short-lived, not persisted |

---

## IntakeFormContext Shape

```typescript
interface IntakeFormContextValue {
  state: IntakeFormState;
  step: FormStep;
  draftId: string;
  storagePath: string | null;
  ocrResult: OcrFieldMap;
  submissionId: string | null;
  setStep: (step: FormStep) => void;
  updateFields: (fields: Partial<IntakeFormState>) => void;
  setOcrResult: (result: OcrFieldMap) => void;
  setStoragePath: (path: string) => void;
  setSubmissionId: (id: string) => void;
  resetForm: () => void;
}
```

---

## sessionStorage Persistence

- Key: `intake_draft_{draftId}`
- Written: on every `updateFields` or `setOcrResult` call
- Read: on `IntakeFormProvider` mount
- Cleared: by `resetForm()` on "Back to Dashboard"
- Duplicate-submit guard: `submitted_{draftId}` set to `"1"` after successful submit

---

## Step Routing

URL: `/dashboard/intake/new?step=upload`

Valid values: `upload | personal | details | review | success`

`IntakeFormShell` reads `?step` and renders the matching component. `setStep` calls `router.push`. Browser back naturally goes to previous step.

---

## OCR Result State Lifecycle

```
1. User selects image → DocumentDropZone calls onFile(file)
2. StepUpload: POST /api/intake/upload (parallel with OCR)
3. StepUpload: runOcr(file, onProgress) → OcrStatusBanner: idle → loading (% updates)
4. runOcr resolves → mapTextToFields(rawText) → OcrFieldMap
5. context.setOcrResult(ocrFieldMap)
6. OcrStatusBanner: loading → success
7. User clicks Next → StepPersonalInfo mounts
8. useForm defaultValues from context.state (pre-populated)
9. ocrFilled=true on fields where ocrResult[field].confidence > 0
10. User edits → ocrFilled badge disappears for that field
11. On Next → updateFields(values) → context.state updated + sessionStorage written
12. On submit → ocrRaw + ocrConfidence included in payload
13. On success → resetForm() clears context + sessionStorage
```

---

## Page Refresh Behaviour

1. `IntakeFormProvider` mounts, reads draftId from sessionStorage or generates new
2. Rehydrates `state`, `ocrResult`, `storagePath` from `intake_draft_{draftId}`
3. URL `?step=...` intact → correct step renders
4. If sessionStorage cleared → fresh start from Step 1

---

## Session Expiry Behaviour

1. API call returns 401
2. IntakeFormShell catches → `router.push('/auth/login?next=/dashboard/intake/new')`
3. After re-login → sessionStorage draft rehydrates, user continues
