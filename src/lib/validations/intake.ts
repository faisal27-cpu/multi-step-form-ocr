import { z } from 'zod';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const fileUploadSchema = z.object({
  type: z.enum(ACCEPTED_IMAGE_TYPES, {
    error: 'Only JPEG, PNG, and WEBP images are accepted.',
  }),
  size: z.number().max(MAX_FILE_SIZE, 'File must be 10 MB or smaller.'),
});

export const step2Schema = z.object({
  fullName: z
    .string()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(100, 'Full name must be 100 characters or fewer.'),
  dateOfBirth: z
    .string()
    .min(1, 'Please enter your date of birth.')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date < new Date();
    }, 'That date doesn\'t look right — please enter a valid date in the past.'),
  idNumber: z
    .string()
    .min(3, 'Please enter your ID or document number.')
    .max(50, 'ID number must be 50 characters or fewer.')
    .regex(/^[a-zA-Z0-9\-]+$/, 'ID number may only contain letters, numbers, and hyphens.'),
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('That doesn\'t look like a valid email — double-check and try again.'),
  phone: z
    .string()
    .min(7, 'Please enter your phone number.')
    .max(20, 'Phone number must be 20 characters or fewer.')
    .regex(/^[0-9\s\+\-\(\)]+$/, 'Please enter a valid phone number (digits, spaces, and +/- allowed).'),
  address: z
    .string()
    .min(5, 'Please enter your address.')
    .max(200, 'Address must be 200 characters or fewer.'),
});

export const step3Schema = z.object({
  submissionCategory: z.enum(
    ['employment', 'financial', 'medical', 'legal', 'other'],
    { error: 'Please choose a submission category to continue.' }
  ),
  referenceNumber: z
    .string()
    .max(50, 'Reference number must be 50 characters or fewer.'),
  notes: z
    .string()
    .max(1000, 'Notes must be 1000 characters or fewer.'),
});

export const intakeSubmissionSchema = z.object({
  draftId: z.string().uuid('Invalid draft ID.'),
  documentType: z.enum(['id', 'invoice', 'document']),
  storagePath: z.string(),
  ocrRaw: z.string(),
  ocrConfidence: z.record(z.string(), z.number()),
  formData: step2Schema.merge(step3Schema),
});

export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type IntakeSubmissionInput = z.infer<typeof intakeSubmissionSchema>;
