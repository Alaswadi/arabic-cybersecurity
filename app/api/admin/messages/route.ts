import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// GET: Fetch all contact messages
export async function GET(request: NextRequest) {
  try {
    // Check authentication - properly await cookies()
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabaseAuth.auth.getSession();

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

    // Create Supabase client
    const supabase = createClient()

    // If ID is provided, fetch a single message
    if (id) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .limit(1)

      if (error) {
        console.error('Error fetching contact message by ID:', error)
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        messages: data
      })
    }

    // Otherwise, build query for multiple messages
    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' })

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

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching contact messages:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Return messages with pagination info
    return NextResponse.json({
      messages: data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

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
    // Check authentication - properly await cookies()
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabaseAuth.auth.getSession();

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

    // Create Supabase client
    const supabase = createClient()

    // Update message
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating contact message:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: data[0]
    })

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
    // Check authentication - properly await cookies()
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabaseAuth.auth.getSession();

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

    // Create Supabase client
    const supabase = createClient()

    // Delete message
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact message:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully'
    })

  } catch (error: any) {
    console.error('Unexpected error deleting contact message:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete contact message' },
      { status: 500 }
    )
  }
}
