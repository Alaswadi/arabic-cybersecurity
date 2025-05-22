-- Update contact_messages table to add reply-related fields
DO $$
BEGIN
  -- Check if the replied column already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'contact_messages' AND column_name = 'replied'
  ) THEN
    -- Add replied column
    ALTER TABLE contact_messages ADD COLUMN replied BOOLEAN DEFAULT false NOT NULL;
    COMMENT ON COLUMN contact_messages.replied IS 'Whether a reply has been sent to this contact message';
    
    RAISE NOTICE 'Added replied column to contact_messages table';
  ELSE
    RAISE NOTICE 'replied column already exists in contact_messages table';
  END IF;

  -- Check if the reply_content column already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'contact_messages' AND column_name = 'reply_content'
  ) THEN
    -- Add reply_content column
    ALTER TABLE contact_messages ADD COLUMN reply_content TEXT;
    COMMENT ON COLUMN contact_messages.reply_content IS 'Content of the reply sent to this contact message';
    
    RAISE NOTICE 'Added reply_content column to contact_messages table';
  ELSE
    RAISE NOTICE 'reply_content column already exists in contact_messages table';
  END IF;

  -- Check if the replied_at column already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'contact_messages' AND column_name = 'replied_at'
  ) THEN
    -- Add replied_at column
    ALTER TABLE contact_messages ADD COLUMN replied_at TIMESTAMP WITH TIME ZONE;
    COMMENT ON COLUMN contact_messages.replied_at IS 'Timestamp when the reply was sent';
    
    RAISE NOTICE 'Added replied_at column to contact_messages table';
  ELSE
    RAISE NOTICE 'replied_at column already exists in contact_messages table';
  END IF;
END
$$;
