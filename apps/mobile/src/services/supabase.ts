import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (globalThis as any).process?.env ?? {};

const supabaseUrl: string = env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey: string = env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // add AsyncStorage persistence after proper install
    detectSessionInUrl: false,
  },
});
