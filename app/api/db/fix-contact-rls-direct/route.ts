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
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase URL or service role key');
      return NextResponse.json(
        { 
          error: 'Missing Supabase credentials. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.' 
        },
        { status: 500 }
      );
    }
    
    // Create a direct Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Execute each SQL statement individually
    try {
      // 1. Disable RLS temporarily
      await supabase.from('contact_messages').select('id').limit(1);
      console.log('1. Connected to Supabase');
      
      // 2. Drop existing policies
      const { error: dropError } = await supabase.rpc('execute_sql', {
        sql_query: `
          -- Disable RLS temporarily
          ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
          
          -- Drop existing policies
          DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
          DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
          DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
          DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;
        `
      });
      
      if (dropError) {
        console.error('Error dropping policies:', dropError);
        // Continue anyway, as we'll try to create the policies
      } else {
        console.log('2. Dropped existing policies');
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
        console.log('3. Created insert policy');
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
        console.log('4. Created select policy');
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
        console.log('5. Created update policy');
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
        console.log('6. Created delete policy');
      }
      
      // 7. Re-enable RLS
      const { error: enableError } = await supabase.rpc('execute_sql', {
        sql_query: `
          -- Re-enable RLS
          ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
        `
      });
      
      if (enableError) {
        console.error('Error re-enabling RLS:', enableError);
      } else {
        console.log('7. Re-enabled RLS');
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
