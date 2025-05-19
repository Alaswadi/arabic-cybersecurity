import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

// Use globalThis to store the client instance
// This ensures it persists across module reloads in development
declare global {
  var supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | undefined
}

export const createClient = () => {
  // Use globalThis consistently for both development and production
  return (
    globalThis.supabaseClient ??
    (globalThis.supabaseClient = createClientComponentClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }))
  )
}
