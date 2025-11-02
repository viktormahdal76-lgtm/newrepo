import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for development without real backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder-key';

// Create client with error handling
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'huddleme-app'
    }
  }
});

export { supabase };
