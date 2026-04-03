// Hand-written types matching the DB schema in supabase/migrations/0001_initial.sql
// Regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: 'planning' | 'active' | 'review' | 'completed' | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: 'planning' | 'active' | 'review' | 'completed' | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: 'planning' | 'active' | 'review' | 'completed' | null;
          due_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          title: string;
          description: string | null;
          is_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          title: string;
          description?: string | null;
          is_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          is_complete?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      intake_submissions: {
        Row: {
          id: string;
          user_id: string;
          draft_id: string;
          document_type: 'id' | 'invoice' | 'document';
          storage_path: string | null;
          pdf_storage_path: string | null;
          form_data: Record<string, unknown>;
          ocr_raw: string | null;  // raw OCR text
          ocr_confidence: Record<string, number> | null;
          status: 'draft' | 'complete' | 'error';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          draft_id: string;
          document_type: 'id' | 'invoice' | 'document';
          storage_path?: string | null;
          pdf_storage_path?: string | null;
          form_data?: Record<string, unknown>;
          ocr_raw?: string | null;
          ocr_confidence?: Record<string, number> | null;
          status?: 'draft' | 'complete' | 'error';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          draft_id?: string;
          document_type?: 'id' | 'invoice' | 'document';
          storage_path?: string | null;
          pdf_storage_path?: string | null;
          form_data?: Record<string, unknown>;
          ocr_raw?: string | null;
          ocr_confidence?: Record<string, number> | null;
          status?: 'draft' | 'complete' | 'error';
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
