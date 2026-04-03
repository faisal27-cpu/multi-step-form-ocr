export type DocumentType = 'id' | 'invoice' | 'document';

export type FormStep = 'upload' | 'personal' | 'details' | 'review' | 'success';

export type OcrFieldMap = Record<string, { value: string; confidence: number }>;

export interface IntakeFormState {
  // Step 2 — personal info
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  email: string;
  phone: string;
  address: string;
  // Step 3 — additional details
  submissionCategory: string;
  referenceNumber: string;
  notes: string;
}

export const EMPTY_FORM_STATE: IntakeFormState = {
  fullName: '',
  dateOfBirth: '',
  idNumber: '',
  email: '',
  phone: '',
  address: '',
  submissionCategory: '',
  referenceNumber: '',
  notes: '',
};

export interface IntakeSubmissionPayload {
  draftId: string;
  documentType: DocumentType;
  storagePath: string;
  ocrRaw: string;
  ocrConfidence: Record<string, number>;
  formData: IntakeFormState;
}
