import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

// Default values for client-side
const FALLBACK_SUPABASE_URL = 'https://xahxjhzngahtcuekbpnj.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E'

// Use globalThis to store the client instance
// This ensures it persists across module reloads in development
declare global {
  var supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | undefined
}

export const createClient = () => {
  // Get environment variables or use fallbacks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

  // Use globalThis consistently for both development and production
  return (
    globalThis.supabaseClient ??
    (globalThis.supabaseClient = createClientComponentClient<Database>({
      supabaseUrl,
      supabaseKey,
    }))
  )
}
