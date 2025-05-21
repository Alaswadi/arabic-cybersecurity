-- This script fixes the RLS policies for the contact_messages table
-- Run this directly in the Supabase SQL Editor

-- First, check if the table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'contact_messages'
) AS table_exists;

-- Count rows in the table
SELECT COUNT(*) FROM contact_messages;

-- Show a sample of data
SELECT * FROM contact_messages LIMIT 5;

-- Check current RLS policies
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

-- Now fix the RLS policies
-- Disable RLS temporarily
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

-- Create a policy that allows authenticated users to view ALL messages
CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy that allows authenticated users to update messages
CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create a policy that allows authenticated users to delete messages
CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Re-enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Verify the policies
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
