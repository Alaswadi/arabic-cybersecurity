import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabaseAuth = createServerComponentClient({ cookies })
    const { data: { session } } = await supabaseAuth.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Create Supabase client
    const supabase = createClient()
    
    // Fix RLS policies for contact_messages table
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- First, drop the existing insert policy if it exists
        DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
        
        -- Create a new policy that allows anonymous insertions
        CREATE POLICY "Anyone can insert contact messages" ON contact_messages
          FOR INSERT
          WITH CHECK (true);
        
        -- Make sure the table has RLS enabled
        ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
        
        -- Verify other policies are still in place
        DO $$
        BEGIN
          -- Check if the select policy exists, if not create it
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'contact_messages' 
            AND operation = 'SELECT'
          ) THEN
            CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
              FOR SELECT
              USING (auth.role() = 'authenticated');
          END IF;
        
          -- Check if the update policy exists, if not create it
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'contact_messages' 
            AND operation = 'UPDATE'
          ) THEN
            CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
              FOR UPDATE
              USING (auth.role() = 'authenticated');
          END IF;
        
          -- Check if the delete policy exists, if not create it
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'contact_messages' 
            AND operation = 'DELETE'
          ) THEN
            CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
              FOR DELETE
              USING (auth.role() = 'authenticated');
          END IF;
        END
        $$;
      `
    })
    
    if (error) {
      console.error('Error updating RLS policies:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'RLS policies for contact_messages table updated successfully' 
    })
  } catch (error: any) {
    console.error('Error updating RLS policies:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update RLS policies' },
      { status: 500 }
    )
  }
}
