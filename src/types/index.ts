// src/types/index.ts
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed' | 'paused';
export type ContactStatus = 'active' | 'unsubscribed' | 'bounced';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  body: string;
  html_body: string | null;
  status: CampaignStatus;
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
}

export interface Contact {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
  tags: string[];
  status: ContactStatus;
  custom_fields: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface ContactInput {
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  status?: ContactStatus;
  custom_fields?: Record<string, string>;
}

export interface Template {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  body: string;
  html_body: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_contacts: number;
  emails_sent: number;
  open_rate: number;
  click_rate: number;
  active_campaigns: number;
}

export interface ImportResult {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  contacts: ContactInput[];
}

export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  body: string;
  html_body: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}