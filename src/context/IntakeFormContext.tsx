"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  FormStep,
  IntakeFormState,
  OcrFieldMap,
} from "@/types/intake";
import { EMPTY_FORM_STATE } from "@/types/intake";

// ---------------------------------------------------------------------------
// Persisted draft shape (what we write to sessionStorage)
// ---------------------------------------------------------------------------
interface DraftSnapshot {
  state: IntakeFormState;
  ocrResult: OcrFieldMap;
  storagePath: string | null;
}

function readDraft(draftId: string): DraftSnapshot | null {
  try {
    const raw = sessionStorage.getItem(`intake_draft_${draftId}`);
    if (!raw) return null;
    return JSON.parse(raw) as DraftSnapshot;
  } catch {
    return null;
  }
}

function writeDraft(draftId: string, snapshot: DraftSnapshot) {
  try {
    sessionStorage.setItem(`intake_draft_${draftId}`, JSON.stringify(snapshot));
  } catch {
    // sessionStorage full or unavailable — silently continue
  }
}

function clearDraft(draftId: string) {
  try {
    sessionStorage.removeItem(`intake_draft_${draftId}`);
    sessionStorage.removeItem(`submitted_${draftId}`);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Context value interface
// ---------------------------------------------------------------------------
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

const IntakeFormContext = createContext<IntakeFormContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function IntakeFormProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // draftId is stable for the lifetime of this provider instance
  const draftIdRef = useRef<string>(
    typeof sessionStorage !== "undefined"
      ? (sessionStorage.getItem("intake_active_draft_id") ?? crypto.randomUUID())
      : crypto.randomUUID()
  );
  const draftId = draftIdRef.current;

  // Persist the active draftId so it survives a refresh
  useEffect(() => {
    try {
      sessionStorage.setItem("intake_active_draft_id", draftId);
    } catch {
      // ignore
    }
  }, [draftId]);

  // Rehydrate from sessionStorage on first mount
  const [state, setState] = useState<IntakeFormState>(() => {
    const draft = typeof sessionStorage !== "undefined" ? readDraft(draftId) : null;
    return draft?.state ?? { ...EMPTY_FORM_STATE };
  });

  const [ocrResult, setOcrResultState] = useState<OcrFieldMap>(() => {
    const draft = typeof sessionStorage !== "undefined" ? readDraft(draftId) : null;
    return draft?.ocrResult ?? {};
  });

  const [storagePath, setStoragePathState] = useState<string | null>(() => {
    const draft = typeof sessionStorage !== "undefined" ? readDraft(draftId) : null;
    return draft?.storagePath ?? null;
  });

  const [submissionId, setSubmissionIdState] = useState<string | null>(null);

  // Derive current step from URL search param
  const rawStep = searchParams.get("step");
  const VALID_STEPS: FormStep[] = ["upload", "personal", "details", "review", "success"];
  const step: FormStep = VALID_STEPS.includes(rawStep as FormStep)
    ? (rawStep as FormStep)
    : "upload";

  // Write to sessionStorage whenever persisted state changes
  const persistSnapshot = useCallback(
    (nextState: IntakeFormState, nextOcr: OcrFieldMap, nextPath: string | null) => {
      writeDraft(draftId, { state: nextState, ocrResult: nextOcr, storagePath: nextPath });
    },
    [draftId]
  );

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const setStep = useCallback(
    (next: FormStep) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", next);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const updateFields = useCallback(
    (fields: Partial<IntakeFormState>) => {
      setState((prev) => {
        const next = { ...prev, ...fields };
        persistSnapshot(next, ocrResult, storagePath);
        return next;
      });
    },
    [ocrResult, storagePath, persistSnapshot]
  );

  const setOcrResult = useCallback(
    (result: OcrFieldMap) => {
      setOcrResultState(result);
      // Merge OCR values into form state for pre-fill
      const ocrFields: Partial<IntakeFormState> = {};
      for (const [key, { value }] of Object.entries(result)) {
        if (value && key in EMPTY_FORM_STATE) {
          (ocrFields as Record<string, string>)[key] = value;
        }
      }
      setState((prev) => {
        const next = { ...prev, ...ocrFields };
        persistSnapshot(next, result, storagePath);
        return next;
      });
    },
    [storagePath, persistSnapshot]
  );

  const setStoragePath = useCallback(
    (path: string) => {
      setStoragePathState(path);
      persistSnapshot(state, ocrResult, path);
    },
    [state, ocrResult, persistSnapshot]
  );

  const setSubmissionId = useCallback((id: string) => {
    setSubmissionIdState(id);
  }, []);

  const resetForm = useCallback(() => {
    clearDraft(draftId);
    try {
      sessionStorage.removeItem("intake_active_draft_id");
    } catch {
      // ignore
    }
    // Generate a new draftId for the next submission
    draftIdRef.current = crypto.randomUUID();
    setState({ ...EMPTY_FORM_STATE });
    setOcrResultState({});
    setStoragePathState(null);
    setSubmissionIdState(null);
  }, [draftId]);

  return (
    <IntakeFormContext.Provider
      value={{
        state,
        step,
        draftId,
        storagePath,
        ocrResult,
        submissionId,
        setStep,
        updateFields,
        setOcrResult,
        setStoragePath,
        setSubmissionId,
        resetForm,
      }}
    >
      {children}
    </IntakeFormContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Raw context export for the hook
// ---------------------------------------------------------------------------
export { IntakeFormContext };
