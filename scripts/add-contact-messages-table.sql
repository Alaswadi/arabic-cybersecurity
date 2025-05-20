-- Add contact_messages table if it doesn't exist
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

    -- Allow authenticated users to insert new messages
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
