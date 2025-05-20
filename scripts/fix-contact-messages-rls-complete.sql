-- This script completely resets and fixes the RLS policies for the contact_messages table
-- to allow anonymous insertions

-- First, disable RLS temporarily to ensure we can modify the table
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for the contact_messages table
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;

-- Create a policy that allows anyone (including anonymous users) to insert messages
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create a policy that allows only authenticated users to view messages
CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy that allows only authenticated users to update messages
CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create a policy that allows only authenticated users to delete messages
CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Re-enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
