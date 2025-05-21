import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// GET: Fetch all contact messages using service role
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/messages-service-role - Start");
    
    // Check authentication first
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const read = searchParams.get('read');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Create Supabase client with service role
    const supabase = createClient();
    
    // If ID is provided, fetch a single message
    if (id) {
      console.log(`Fetching single message with ID: ${id}`);
      
      const { data, error } = await supabase
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
        messages: data
      });
    }
    
    console.log("Executing query for messages list with service role");
    
    // Otherwise, build query for multiple messages
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (read === 'true') {
      query = query.eq('read', true);
    } else if (read === 'false') {
      query = query.eq('read', false);
    }
    
    // Apply sorting
    if (sortBy && ['created_at', 'name', 'email', 'subject'].includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching contact messages:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    console.log(`Found ${data?.length || 0} messages out of ${count || 0} total`);
    
    // Return messages with pagination info
    const response = {
      messages: data || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
    
    console.log("Returning response:", JSON.stringify(response.pagination));
    
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Unexpected error fetching contact messages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}
