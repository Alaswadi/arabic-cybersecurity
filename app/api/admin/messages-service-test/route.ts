import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/messages-service-test - Start");
    
    // Check authentication first
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ 
      cookies: () => cookieStore 
    });
    
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");
    
    if (session) {
      console.log("User ID:", session.user.id);
      console.log("User Email:", session.user.email);
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Create a Supabase client with service role key
    // This bypasses RLS policies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }
    
    console.log("Creating service role client");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If ID is provided, fetch a single message
    if (id) {
      console.log(`Fetching single message with ID: ${id}`);
      
      const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .limit(1);
      
      if (error) {
        console.error('Error fetching contact message by ID:', error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }
      
      console.log(`Message found:`, data ? `Yes (${data.length} items)` : 'No');
      
      return NextResponse.json({
        messages: data || [],
        source: 'service_role'
      });
    }
    
    // Otherwise, fetch all messages
    console.log("Fetching all messages with service role");
    
    const { data, error, count } = await supabaseAdmin
      .from('contact_messages')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Error fetching contact messages:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    console.log(`Found ${data?.length || 0} messages out of ${count || 0} total`);
    
    // Also check table structure and RLS policies
    console.log("Checking table structure");
    const { data: columns, error: columnsError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'contact_messages')
      .eq('table_schema', 'public');
    
    console.log("Checking RLS policies");
    const { data: policies, error: policiesError } = await supabaseAdmin
      .from('pg_policies')
      .select('tablename, policyname, cmd, roles')
      .eq('tablename', 'contact_messages');
    
    return NextResponse.json({
      messages: data || [],
      count: count || 0,
      columns: columns || [],
      policies: policies || [],
      columnsError: columnsError ? columnsError.message : null,
      policiesError: policiesError ? policiesError.message : null,
      source: 'service_role'
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
