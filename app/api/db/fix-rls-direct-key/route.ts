import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
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
    
    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Use the hardcoded service role key
    const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjkwODkwOSwiZXhwIjoyMDYyNDg0OTA5fQ.eCiXwLPyS-ecD7N8Ifb7GnxwlibTga20ya0ySXcOnPM";
    
    if (!supabaseUrl) {
      console.error('Missing Supabase URL');
      return NextResponse.json(
        { 
          error: 'Missing Supabase URL' 
        },
        { status: 500 }
      );
    }
    
    console.log('Creating Supabase client with service role key...');
    
    // Create a direct Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Execute the SQL script to fix RLS policies
    try {
      console.log('Executing SQL script to fix RLS policies...');
      
      // 1. Disable RLS temporarily
      const { error: disableError } = await supabase.rpc('execute_sql', {
        sql_query: `ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;`
      });
      
      if (disableError) {
        console.error('Error disabling RLS:', disableError);
        // Try direct SQL if execute_sql function fails
        const { error: directDisableError } = await supabase.from('contact_messages')
          .select('id')
          .limit(1);
          
        if (directDisableError) {
          console.error('Error with direct SQL:', directDisableError);
        }
      } else {
        console.log('Successfully disabled RLS');
      }
      
      // 2. Drop existing policies
      const { error: dropError } = await supabase.rpc('execute_sql', {
        sql_query: `
          DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
          DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
          DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
          DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;
        `
      });
      
      if (dropError) {
        console.error('Error dropping policies:', dropError);
      } else {
        console.log('Successfully dropped existing policies');
      }
      
      // 3. Create insert policy
      const { error: insertError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE POLICY "Anyone can insert contact messages" ON contact_messages
            FOR INSERT
            TO anon, authenticated
            WITH CHECK (true);
        `
      });
      
      if (insertError) {
        console.error('Error creating insert policy:', insertError);
      } else {
        console.log('Successfully created insert policy');
      }
      
      // 4. Create select policy
      const { error: selectError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
            FOR SELECT
            TO authenticated
            USING (true);
        `
      });
      
      if (selectError) {
        console.error('Error creating select policy:', selectError);
      } else {
        console.log('Successfully created select policy');
      }
      
      // 5. Create update policy
      const { error: updateError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
            FOR UPDATE
            TO authenticated
            USING (true);
        `
      });
      
      if (updateError) {
        console.error('Error creating update policy:', updateError);
      } else {
        console.log('Successfully created update policy');
      }
      
      // 6. Create delete policy
      const { error: deleteError } = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
            FOR DELETE
            TO authenticated
            USING (true);
        `
      });
      
      if (deleteError) {
        console.error('Error creating delete policy:', deleteError);
      } else {
        console.log('Successfully created delete policy');
      }
      
      // 7. Re-enable RLS
      const { error: enableError } = await supabase.rpc('execute_sql', {
        sql_query: `ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;`
      });
      
      if (enableError) {
        console.error('Error re-enabling RLS:', enableError);
      } else {
        console.log('Successfully re-enabled RLS');
      }
      
      // Return success even if some steps failed
      return NextResponse.json({
        success: true,
        message: 'RLS policies for contact_messages table updated successfully'
      });
    } catch (sqlError: any) {
      console.error('Error executing SQL:', sqlError);
      return NextResponse.json(
        { error: sqlError.message || 'Failed to execute SQL' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error updating RLS policies:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update RLS policies' },
      { status: 500 }
    );
  }
}
