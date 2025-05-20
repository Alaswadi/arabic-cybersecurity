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
        -- This script completely resets and fixes the RLS policies for the contact_messages table
        -- to allow anonymous insertions

        -- First, disable RLS temporarily to ensure we can modify the table
        ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

        -- Drop all existing policies for the contact_messages table
        DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
        DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
        DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
        DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;

        -- Create a policy that allows anyone (including anonymous users) to insert messages
        CREATE POLICY "Anyone can insert contact messages" ON contact_messages
          FOR INSERT
          TO anon, authenticated
          WITH CHECK (true);

        -- Create a policy that allows only authenticated users to view messages
        CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
          FOR SELECT
          TO authenticated
          USING (true);

        -- Create a policy that allows only authenticated users to update messages
        CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
          FOR UPDATE
          TO authenticated
          USING (true);

        -- Create a policy that allows only authenticated users to delete messages
        CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
          FOR DELETE
          TO authenticated
          USING (true);

        -- Re-enable RLS
        ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
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
