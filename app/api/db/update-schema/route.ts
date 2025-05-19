import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Add image column to services table if it doesn't exist
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        DO $$
        BEGIN
          -- Check if the column already exists
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'services'
            AND column_name = 'image'
          ) THEN
            -- Add the column if it doesn't exist
            ALTER TABLE services ADD COLUMN image VARCHAR(255);
            
            -- Add comment
            COMMENT ON COLUMN services.image IS 'URL path to the service image';
          END IF;
        END
        $$;
      `
    })
    
    if (error) {
      console.error('Error updating schema:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, message: 'Schema updated successfully' })
  } catch (error: any) {
    console.error('Error updating schema:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update schema' },
      { status: 500 }
    )
  }
}
