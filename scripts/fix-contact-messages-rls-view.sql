-- This script fixes the RLS policies for the contact_messages table
-- to ensure authenticated users can view all messages

-- First, check the current RLS policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'contact_messages';

-- Disable RLS temporarily to ensure we can modify the table
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Drop the existing SELECT policy if it exists
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;

-- Create a new policy that allows authenticated users to view ALL messages
-- The key change is using 'true' instead of any specific condition
CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Make sure the insert policy exists
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Make sure the update policy exists
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Make sure the delete policy exists
DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;
CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Re-enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Verify the updated policies
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'contact_messages';
