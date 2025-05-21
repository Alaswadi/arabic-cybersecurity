import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/admin/fix-messages-rls - Start");
    
    // Check authentication
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ 
      cookies: () => cookieStore 
    });
    
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create Supabase client
    const supabase = createClient();
    
    // SQL to fix RLS policies
    const sql = `
      -- Disable RLS temporarily
      ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

      -- Drop the existing SELECT policy if it exists
      DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;

      -- Create a new policy that allows authenticated users to view ALL messages
      CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
        FOR SELECT
        TO authenticated
        USING (true);

      -- Make sure the insert policy exists
      DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
      CREATE POLICY "Anyone can insert contact messages" ON contact_messages
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);

      -- Make sure the update policy exists
      DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
      CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
        FOR UPDATE
        TO authenticated
        USING (true);

      -- Make sure the delete policy exists
      DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;
      CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
        FOR DELETE
        TO authenticated
        USING (true);

      -- Re-enable RLS
      ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
    `;

    // Execute the SQL
    const { error } = await supabase.rpc('execute_sql', { sql });

    if (error) {
      console.error('Error fixing RLS policies:', error);
      
      // Try an alternative approach if execute_sql fails
      try {
        console.log("Trying alternative approach with individual queries");
        
        // Disable RLS
        await supabase.rpc('execute_sql', { 
          sql: 'ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;' 
        });
        
        // Drop and recreate SELECT policy
        await supabase.rpc('execute_sql', { 
          sql: 'DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;' 
        });
        
        await supabase.rpc('execute_sql', { 
          sql: 'CREATE POLICY "Authenticated users can view contact messages" ON contact_messages FOR SELECT TO authenticated USING (true);' 
        });
        
        // Re-enable RLS
        await supabase.rpc('execute_sql', { 
          sql: 'ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;' 
        });
        
        console.log("Alternative approach completed");
        
      } catch (altError: any) {
        console.error('Error with alternative approach:', altError);
        return NextResponse.json(
          { 
            error: 'Failed to fix RLS policies', 
            details: error.message,
            altError: altError.message 
          },
          { status: 500 }
        );
      }
    }

    // Verify the policies were updated
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'contact_messages');

    if (policiesError) {
      console.error('Error fetching updated policies:', policiesError);
    } else {
      console.log('Updated policies:', policies);
    }

    // Test fetching messages after fixing RLS
    const { data: messages, error: messagesError, count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact' });

    console.log(`After RLS fix: Found ${messages?.length || 0} messages out of ${count || 0} total`);

    if (messagesError) {
      console.error('Error testing message fetch after RLS fix:', messagesError);
    }

    return NextResponse.json({
      success: true,
      message: 'RLS policies updated successfully',
      messageCount: messages?.length || 0,
      totalCount: count || 0
    });

  } catch (error: any) {
    console.error('Unexpected error fixing RLS policies:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fix RLS policies' },
      { status: 500 }
    );
  }
}
