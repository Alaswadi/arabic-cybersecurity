-- Comprehensive RLS Fix Script for contact_messages table
-- Run this directly in the Supabase SQL Editor

-- 1. Check if the table exists and count records
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'contact_messages'
) AS table_exists;

SELECT COUNT(*) FROM contact_messages;

-- 2. Check table ownership and permissions
SELECT 
    tablename AS table_name, 
    tableowner AS table_owner
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'contact_messages';

-- 3. Check if RLS is enabled
SELECT 
    c.relname AS table_name,
    CASE WHEN c.relrowsecurity THEN 'enabled' ELSE 'disabled' END AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'contact_messages';

-- 4. Check detailed RLS policy definitions
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'contact_messages';

-- 5. Fix: Recreate RLS policies with explicit USING clause
-- First disable RLS to make changes
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;

-- Create new policies with explicit conditions
-- SELECT policy for authenticated users - explicitly use TRUE
CREATE POLICY "Authenticated users can view contact messages" 
    ON contact_messages
    FOR SELECT
    TO authenticated
    USING (TRUE);  -- This allows access to ALL rows

-- INSERT policy for anyone
CREATE POLICY "Anyone can insert contact messages" 
    ON contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (TRUE);

-- UPDATE policy for authenticated users
CREATE POLICY "Authenticated users can update contact messages" 
    ON contact_messages
    FOR UPDATE
    TO authenticated
    USING (TRUE);

-- DELETE policy for authenticated users
CREATE POLICY "Authenticated users can delete contact messages" 
    ON contact_messages
    FOR DELETE
    TO authenticated
    USING (TRUE);

-- Re-enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 6. Grant explicit permissions to the authenticated role
GRANT ALL ON contact_messages TO authenticated;
GRANT ALL ON contact_messages TO anon;

-- 7. Verify the fix
-- Check policies again
SELECT
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'contact_messages';

-- 8. Insert a test record to verify
INSERT INTO contact_messages (name, email, message, read, created_at)
VALUES ('Test User', 'test@example.com', 'This is a test message to verify RLS policies are working correctly.', false, NOW())
RETURNING id;

-- 9. Count records again to verify
SELECT COUNT(*) FROM contact_messages;

-- 10. Final verification
SELECT 'Fix complete. Please check your application again.' AS message;
