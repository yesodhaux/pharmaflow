
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://shizachusmzcrqbgbpae.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaXphY2h1c216Y3JxYmdicGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTk0MTUsImV4cCI6MjA2MDU3NTQxNX0.mCojCey1dOlT9hSsWQKNy1x_3W1cC9jWc5LQ12cy7Bo";

// Create the supabase client configured to use anon key
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false
  }
});

export function isSupabaseConfigured(): boolean {
  // Check if Supabase is configured with valid values
  return (
    SUPABASE_URL.length > 0 && 
    SUPABASE_PUBLISHABLE_KEY.length > 0 &&
    // Use includes for string comparison instead of direct equality
    !SUPABASE_URL.includes('xyzcompany.supabase.co') && 
    !SUPABASE_PUBLISHABLE_KEY.includes('mocktoken')
  );
}
