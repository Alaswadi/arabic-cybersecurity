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

    // Add contact_messages table if it doesn't exist
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        DO $$
        BEGIN
          -- Check if the table already exists
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'contact_messages'
          ) THEN
            -- Create the contact_messages table
            CREATE TABLE contact_messages (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              phone VARCHAR(50),
              subject VARCHAR(255),
              message TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
              read BOOLEAN DEFAULT false NOT NULL
            );

            -- Add comments
            COMMENT ON TABLE contact_messages IS 'Contact form submissions from website visitors';
            COMMENT ON COLUMN contact_messages.id IS 'Unique identifier for the contact message';
            COMMENT ON COLUMN contact_messages.name IS 'Name of the person submitting the contact form';
            COMMENT ON COLUMN contact_messages.email IS 'Email address of the person submitting the contact form';
            COMMENT ON COLUMN contact_messages.phone IS 'Optional phone number of the person submitting the contact form';
            COMMENT ON COLUMN contact_messages.subject IS 'Optional subject/topic of the contact message';
            COMMENT ON COLUMN contact_messages.message IS 'Content of the contact message';
            COMMENT ON COLUMN contact_messages.created_at IS 'Timestamp when the contact message was submitted';
            COMMENT ON COLUMN contact_messages.read IS 'Whether the contact message has been read by an admin';

            -- Add RLS policies
            ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

            -- Allow anyone (including anonymous users) to insert new messages
            CREATE POLICY "Anyone can insert contact messages" ON contact_messages
              FOR INSERT
              WITH CHECK (true);

            -- Allow authenticated admins to read, update, and delete messages
            CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
              FOR SELECT
              USING (auth.role() = 'authenticated');

            CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
              FOR UPDATE
              USING (auth.role() = 'authenticated');

            CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
              FOR DELETE
              USING (auth.role() = 'authenticated');

            RAISE NOTICE 'Created contact_messages table with RLS policies';
          ELSE
            RAISE NOTICE 'contact_messages table already exists';
          END IF;
        END
        $$;
      `
    })

    if (error) {
      console.error('Error updating schema:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Schema updated successfully with contact_messages table'
    })
  } catch (error: any) {
    console.error('Error updating schema:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update schema' },
      { status: 500 }
    )
  }
}
