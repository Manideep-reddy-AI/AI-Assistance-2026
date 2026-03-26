import { createClient } from '@supabase/supabase-js'
import { getSupabaseEnv, getSupabaseServiceRoleKey } from './env'

const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseEnv()

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (only for API routes)
export function getAdminClient() {
  return createClient(supabaseUrl, getSupabaseServiceRoleKey())
}
