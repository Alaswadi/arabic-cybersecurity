# Fixing the Admin Contact Messages Page

This guide explains how to fix the issue where contact messages are being stored in the database but not displayed in the admin page.

## The Problem

The contact form is now successfully storing submissions in the Supabase database, but they're not appearing in the admin interface. This is likely due to the Row Level Security (RLS) policies not being properly configured to allow authenticated users to view the messages.

## The Solution

You need to run an updated SQL script that properly configures the RLS policies for the `contact_messages` table. This script will:

1. Allow anonymous users to insert messages (for the contact form)
2. Allow authenticated users to view, update, and delete messages (for the admin interface)

## Step-by-Step Instructions

1. **Log in to your Supabase Dashboard**:
   - Go to [https://app.supabase.com/](https://app.supabase.com/)
   - Select your project (xahxjhzngahtcuekbpnj)

2. **Open the SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New query" to create a new SQL query

3. **Copy and Paste the SQL Script**:
   - Copy the entire SQL script from the file `scripts/fix-contact-rls-final-updated.sql` in your project
   - Or copy the script below:

```sql
-- IMPORTANT: Run this script directly in the Supabase SQL Editor
-- This script fixes the RLS policies for the contact_messages table
-- to allow anonymous insertions and authenticated users to view/manage messages

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
```

4. **Run the SQL Script**:
   - Click the "Run" button to execute the script
   - You should see a success message and a table showing the policies that have been created

5. **Test the Admin Interface**:
   - Go to your admin interface at `/admin/messages`
   - You should now be able to see the contact messages that have been submitted

## What This Script Does

This SQL script:

1. Temporarily disables RLS for the `contact_messages` table
2. Removes any existing policies that might be conflicting
3. Creates a new policy that allows both anonymous and authenticated users to insert messages
4. Creates policies that allow only authenticated users to view, update, and delete messages
5. Re-enables RLS for the table
6. Verifies that the policies have been created correctly

## Troubleshooting

If you're still experiencing issues after applying this fix:

1. **Check Authentication**:
   - Make sure you're logged in as an authenticated user when accessing the admin interface
   - The RLS policies only allow authenticated users to view the messages

2. **Check the Console Logs**:
   - Open your browser's developer tools (F12)
   - Go to the Console tab
   - Look for any error messages when loading the admin page

3. **Verify the API Response**:
   - In the Network tab of your browser's developer tools
   - Look for requests to `/api/admin/messages`
   - Check the response to see if it contains any error messages

4. **Check RLS Enablement**:
   - In Supabase, go to "Table Editor" > "contact_messages"
   - Click on "RLS" at the top
   - Make sure "Row Level Security" is enabled

5. **Contact Supabase Support**:
   - If you continue to have issues, you may need to contact Supabase support
   - Provide them with the error messages and the steps you've taken
