export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: { Row: { id: string; full_name: string | null; avatar_url: string | null; created_at: string; updated_at: string }; Insert: { id: string; full_name?: string | null; avatar_url?: string | null }; Update: Partial<{ full_name: string | null; avatar_url: string | null }> };
      clients: { Row: { id: string; name: string; legal_name: string | null; email: string | null; phone: string | null; notes: string | null; created_at: string; updated_at: string }; Insert: { name: string; legal_name?: string | null; email?: string | null; phone?: string | null; notes?: string | null }; Update: Partial<{ name: string; legal_name: string | null; email: string | null; phone: string | null; notes: string | null }> };
      projects: { Row: { id: string; client_id: string; name: string; description: string | null; status: 'planned' | 'active' | 'paused' | 'completed' | 'archived'; starts_on: string | null; ends_on: string | null; created_at: string; updated_at: string }; Insert: { client_id: string; name: string; description?: string | null; status?: Database['public']['Enums']['project_status']; starts_on?: string | null; ends_on?: string | null }; Update: Partial<{ name: string; description: string | null; status: Database['public']['Enums']['project_status']; starts_on: string | null; ends_on: string | null }> };
      project_members: { Row: { project_id: string; user_id: string; role: 'client_editor' | 'client_viewer'; created_at: string }; Insert: { project_id: string; user_id: string; role: Database['public']['Enums']['membership_role'] }; Update: Partial<{ role: Database['public']['Enums']['membership_role'] }> };
      dashboards: { Row: { id: string; project_id: string; template_id: string; name: string; created_at: string; updated_at: string }; Insert: { project_id: string; template_id: string; name?: string }; Update: Partial<{ name: string; template_id: string }> };
      dashboard_sections: { Row: { id: string; dashboard_id: string; type: string; position: number; is_enabled: boolean; configuration: Json; created_at: string; updated_at: string }; Insert: { dashboard_id: string; type: string; position: number; is_enabled?: boolean; configuration?: Json }; Update: Partial<{ position: number; is_enabled: boolean; configuration: Json }> };
      metrics: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      phases: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      tasks: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      team_members: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      modules: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      decisions: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      gallery_items: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
      documents: { Row: Record<string, never>; Insert: Record<string, never>; Update: Record<string, never> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { app_role: 'admin' | 'client_editor' | 'client_viewer'; membership_role: 'client_editor' | 'client_viewer'; project_status: 'planned' | 'active' | 'paused' | 'completed' | 'archived' };
    CompositeTypes: Record<string, never>;
  };
};
