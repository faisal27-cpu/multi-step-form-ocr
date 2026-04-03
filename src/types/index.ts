export type { Database, Tables, TablesInsert, TablesUpdate } from './database';
export type {
  DocumentType,
  FormStep,
  OcrFieldMap,
  IntakeFormState,
  IntakeSubmissionPayload,
} from './intake';
export { EMPTY_FORM_STATE } from './intake';

import type { Tables } from './database';

export type Project = Tables<'projects'>;
export type Task = Tables<'tasks'>;

export type ProjectStatus = 'planning' | 'active' | 'review' | 'completed';

export type ProjectInsert = {
  name: string;
  description?: string | null;
};

export type ProjectUpdate = Partial<ProjectInsert>;

export type TaskInsert = {
  project_id: string;
  title: string;
  description?: string | null;
};

export type TaskUpdate = Partial<Omit<TaskInsert, 'project_id'>> & {
  is_complete?: boolean;
};

export type ActionResult<T = void> =
  | { data: T; error?: never }
  | { error: string; data?: never };
