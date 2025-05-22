import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Check for authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Simple token validation (in production, use a more secure method)
    if (token !== process.env.DB_UPDATE_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 403 }
      );
    }

    // Create a Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase URL or service role key' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'update-contact-messages-add-reply.sql');
    const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL query
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: sqlQuery
    });

    if (error) {
      console.error('Error executing SQL:', error);
      return NextResponse.json(
        { error: `Failed to update schema: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact messages schema updated successfully to include reply fields'
    });
  } catch (error) {
    console.error('Error updating schema:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
