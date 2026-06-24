// types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          sender_email: string;
          sender_name: string;
          signature: string | null;
          timezone: string;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          sender_email?: string;
          sender_name?: string;
          signature?: string | null;
          timezone?: string;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          sender_email?: string;
          sender_name?: string;
          signature?: string | null;
          timezone?: string;
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          company: string | null;
          phone: string | null;
          tags: string[];
          status: string;
          custom_fields: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          company?: string | null;
          phone?: string | null;
          tags?: string[];
          status?: string;
          custom_fields?: Record<string, string>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          company?: string | null;
          phone?: string | null;
          tags?: string[];
          status?: string;
          custom_fields?: Record<string, string>;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          subject: string;
          body: string;
          html_body: string | null;
          status: string;
          template_id: string | null;
          scheduled_at: string | null;
          sent_at: string | null;
          total_recipients: number;
          sent_count: number;
          open_count: number;
          click_count: number;
          bounce_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          subject: string;
          body: string;
          html_body?: string | null;
          status?: string;
          template_id?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          total_recipients?: number;
          sent_count?: number;
          open_count?: number;
          click_count?: number;
          bounce_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          subject?: string;
          body?: string;
          html_body?: string | null;
          status?: string;
          template_id?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          total_recipients?: number;
          sent_count?: number;
          open_count?: number;
          click_count?: number;
          bounce_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      email_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          subject: string;
          body: string;
          html_body: string | null;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          subject: string;
          body: string;
          html_body?: string | null;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          subject?: string;
          body?: string;
          html_body?: string | null;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}