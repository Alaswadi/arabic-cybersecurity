import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from "@/lib/supabase/schema"

// Create a client that doesn't use cookies for server components
// This allows static site generation
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey)
}
