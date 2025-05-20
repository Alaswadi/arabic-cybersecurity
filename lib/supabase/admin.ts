import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from "@/lib/database.types"

// Create a Supabase client with service role key that bypasses RLS
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or service role key')
    throw new Error('Missing Supabase URL or service role key')
  }

  // Create the Supabase client with service role key
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (...args) => fetch(...args),
    },
  })
}
