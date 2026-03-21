import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Project URL and Anon Key from the Supabase Dashboard
const supabaseUrl = 'https://hptdavnevtdowxiqdvvh.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZvenrO3rpl0uKUAAVM1WPA_W-O3FcuC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);