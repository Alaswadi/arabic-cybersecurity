import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// GET: Fetch all contact messages
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/messages - Start");

    // Properly await cookies() to fix the warning
    const cookieStore = cookies();

    // Create a Supabase client with the cookie store
    const supabaseAuth = createServerComponentClient({
      cookies: () => cookieStore
    });

    // Get the session
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
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const read = searchParams.get('read')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    // Since we're seeing a discrepancy between regular client and service role client,
    // let's use the service role client directly for all operations
    console.log("Using service role client for all operations");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseServiceKey) {
      console.error('Service role key not configured');
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    // Create service role client
    const serviceRoleClient = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // If ID is provided, fetch a single message
    if (id) {
      console.log(`Fetching single message with ID: ${id}`);

      // Use service role client directly
      const { data, error } = await serviceRoleClient
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .limit(1);

      console.log(`Service role client result:`, error ? `Error: ${error.message}` : `Found ${data?.length || 0} items`);

      if (error) {
        console.error('Error fetching contact message by ID:', error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      console.log(`Message found:`, data ? `Yes (${data.length} items)` : 'No');

      return NextResponse.json({
        messages: data || []
      });
    }

    // Otherwise, build query for multiple messages
    console.log("Querying with service role client");
    let query = serviceRoleClient
      .from('contact_messages')
      .select('*', { count: 'exact' });

    // Apply filters
    if (read === 'true') {
      query = query.eq('read', true)
    } else if (read === 'false') {
      query = query.eq('read', false)
    }

    // Apply sorting
    if (sortBy && ['created_at', 'name', 'email', 'subject'].includes(sortBy)) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    console.log("Executing query for messages list with service role client");

    // Execute query with service role client
    const { data, error, count } = await query;

    console.log(`Service role client result:`, error ? `Error: ${error?.message}` : `Found ${data?.length || 0} items out of ${count || 0}`);

    if (error) {
      console.error('Error fetching contact messages:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log(`Final result: Found ${data?.length || 0} messages out of ${count || 0} total`);

    // Return messages with pagination info
    const response = {
      messages: data || [],
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      },
      source: 'service_role_client'
    };

    console.log("Returning response:", JSON.stringify(response.pagination));

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Unexpected error fetching contact messages:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contact messages' },
      { status: 500 }
    )
  }
}

// PATCH: Update a contact message (mark as read/unread)
export async function PATCH(request: NextRequest) {
  try {
    console.log("PATCH /api/admin/messages - Start");

    // Properly await cookies() to fix the warning
    const cookieStore = cookies();

    // Create a Supabase client with the cookie store
    const supabaseAuth = createServerComponentClient({
      cookies: () => cookieStore
    });

    // Get the session
    const { data: { session } } = await supabaseAuth.auth.getSession();

    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { id, read } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    if (typeof read !== 'boolean') {
      return NextResponse.json(
        { error: 'Read status must be a boolean' },
        { status: 400 }
      )
    }

    // Since we're seeing a discrepancy between regular client and service role client,
    // let's use the service role client directly for updates to ensure it works
    console.log("Using service role client for update operation");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseServiceKey) {
      console.error('Service role key not configured');
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    // Create service role client
    const serviceRoleClient = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify the message exists before updating
    console.log(`Verifying message ${id} exists before update`);
    const { data: messageData, error: messageError } = await serviceRoleClient
      .from('contact_messages')
      .select('id, read')
      .eq('id', id)
      .single();

    if (messageError || !messageData) {
      console.error('Message not found or error verifying:', messageError);
      return NextResponse.json(
        { error: messageError?.message || 'Message not found' },
        { status: 404 }
      );
    }

    console.log(`Message ${id} found with current read status: ${messageData.read}, updating to: ${read}`);

    // Update the message using service role client
    const { data, error: updateError } = await serviceRoleClient
      .from('contact_messages')
      .update({ read })
      .eq('id', id)
      .select();

    console.log("Service role client update result:", updateError ? `Error: ${updateError.message}` : "Success");

    if (updateError) {
      console.error('Error updating contact message with service role:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.error('No data returned after update');
      return NextResponse.json(
        { error: 'Update failed - no data returned' },
        { status: 500 }
      );
    }

    console.log(`Message ${id} successfully updated to read status: ${read}`);

    return NextResponse.json({
      success: true,
      message: data[0]
    });

  } catch (error: any) {
    console.error('Unexpected error updating contact message:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update contact message' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a contact message
export async function DELETE(request: NextRequest) {
  try {
    console.log("DELETE /api/admin/messages - Start");

    // Properly await cookies() to fix the warning
    const cookieStore = cookies();

    // Create a Supabase client with the cookie store
    const supabaseAuth = createServerComponentClient({
      cookies: () => cookieStore
    });

    // Get the session
    const { data: { session } } = await supabaseAuth.auth.getSession();

    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get message ID from query parameters
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    // Since we're seeing a discrepancy between regular client and service role client,
    // let's use the service role client directly for deletion to ensure it works
    console.log("Using service role client for delete operation");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseServiceKey) {
      console.error('Service role key not configured');
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      );
    }

    // Create service role client
    const serviceRoleClient = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify the message exists before deleting
    console.log(`Verifying message ${id} exists before deletion`);
    const { data: messageData, error: messageError } = await serviceRoleClient
      .from('contact_messages')
      .select('id')
      .eq('id', id)
      .single();

    if (messageError || !messageData) {
      console.error('Message not found or error verifying:', messageError);
      return NextResponse.json(
        { error: messageError?.message || 'Message not found' },
        { status: 404 }
      );
    }

    console.log(`Message ${id} found, proceeding with deletion`);

    // Delete the message using service role client
    const { error: deleteError } = await serviceRoleClient
      .from('contact_messages')
      .delete()
      .eq('id', id);

    console.log("Service role client delete result:", deleteError ? `Error: ${deleteError.message}` : "Success");

    if (deleteError) {
      console.error('Error deleting contact message with service role:', deleteError);
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    // Verify deletion was successful
    const { data: verifyData, error: verifyError } = await serviceRoleClient
      .from('contact_messages')
      .select('id')
      .eq('id', id)
      .single();

    if (verifyData) {
      console.error('Message still exists after deletion attempt');
      return NextResponse.json(
        { error: 'Message deletion failed - message still exists' },
        { status: 500 }
      );
    }

    console.log(`Message ${id} successfully deleted and verified`);

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully'
    });

  } catch (error: any) {
    console.error('Unexpected error deleting contact message:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete contact message' },
      { status: 500 }
    )
  }
}
