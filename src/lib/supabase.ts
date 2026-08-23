import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbifxlxynfngcgtuiadf.supabase.co';
const supabaseAnonKey = 'sb_publishable_q2_NQPJV-90F0FU45Yo8Gg_8r56R5aF';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
