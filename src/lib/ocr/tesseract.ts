import type { OcrFieldMap } from "@/types/intake";

// Field name patterns for extracting structured data from raw OCR text
const FIELD_PATTERNS: Record<keyof Pick<
  Record<string, RegExp>,
  string
>, RegExp> = {
  fullName: /(?:name|full\s*name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i,
  dateOfBirth: /(?:dob|date\s*of\s*birth|born)[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}-\d{2}-\d{2})/i,
  idNumber: /(?:id\s*(?:no|number|#)|document\s*(?:no|number)|passport|license)[:\s#]+([A-Z0-9\-]{3,20})/i,
  email: /\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/,
  phone: /(?:phone|tel|mobile|cell)[:\s]+([+\d\s\(\)\-]{7,20})/i,
  address: /(?:address|addr)[:\s]+([^\n]{5,100})/i,
};

/**
 * Maps raw OCR text to form fields using regex heuristics.
 * Returns OcrFieldMap — matched fields have confidence=1, unmatched confidence=0.
 */
export function mapTextToFields(rawText: string): OcrFieldMap {
  const result: OcrFieldMap = {};

  for (const [field, pattern] of Object.entries(FIELD_PATTERNS)) {
    const match = rawText.match(pattern);
    if (match?.[1]) {
      result[field] = { value: match[1].trim(), confidence: 1 };
    } else {
      result[field] = { value: "", confidence: 0 };
    }
  }

  return result;
}

/**
 * Runs Tesseract.js OCR on an image file.
 * Calls onProgress with values 0–100 as recognition proceeds.
 * Returns an OcrFieldMap with extracted field values.
 */
export async function runOcr(
  imageFile: File,
  onProgress: (pct: number) => void
): Promise<OcrFieldMap> {
  // Tesseract.js is heavy — dynamic import keeps it out of the initial bundle
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng", 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === "recognizing text") {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const { data } = await worker.recognize(imageFile);
    onProgress(100);
    return mapTextToFields(data.text);
  } finally {
    await worker.terminate();
  }
}
