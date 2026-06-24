// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nhxwetdfoclphlubbllt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oeHdldGRmb2NscGhsdWJibGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDg3ODksImV4cCI6MjA5NzY4NDc4OX0.pkL2unjIjgvtjnk53S3ZW6z9nkAExpcpiUXaqsYPVCM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});