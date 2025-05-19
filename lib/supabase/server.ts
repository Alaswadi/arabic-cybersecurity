import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from "@/lib/supabase/schema"

// Default values for local development or build time
const FALLBACK_SUPABASE_URL = 'https://xahxjhzngahtcuekbpnj.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E'

// Create a client that doesn't use cookies for server components
// This allows static site generation
export const createClient = () => {
  // Use environment variables or fallback to default values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

  // Create the Supabase client with additional options
  return createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (...args) => fetch(...args),
    },
  })
}
