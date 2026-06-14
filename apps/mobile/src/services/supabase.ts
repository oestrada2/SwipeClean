import { createClient } from '@supabase/supabase-js';

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const supabaseUrl = env?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
