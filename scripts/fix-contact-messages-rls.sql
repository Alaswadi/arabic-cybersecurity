-- This script updates the RLS policies for the contact_messages table
-- to allow anonymous insertions (not just authenticated users)

-- First, drop the existing insert policy if it exists
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;

-- Create a new policy that allows anonymous insertions
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Make sure the table has RLS enabled
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Verify other policies are still in place
DO $$
BEGIN
  -- Check if the select policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND operation = 'SELECT'
  ) THEN
    CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
      FOR SELECT
      USING (auth.role() = 'authenticated');
  END IF;

  -- Check if the update policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND operation = 'UPDATE'
  ) THEN
    CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
      FOR UPDATE
      USING (auth.role() = 'authenticated');
  END IF;

  -- Check if the delete policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND operation = 'DELETE'
  ) THEN
    CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
      FOR DELETE
      USING (auth.role() = 'authenticated');
  END IF;
END
$$;
