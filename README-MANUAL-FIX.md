# Manual Fix for Contact Form RLS Policies

This guide explains how to manually fix the Row Level Security (RLS) policies for the contact form in your Arabic cybersecurity website.

## The Problem

The contact form is currently unable to store submissions in the Supabase database due to RLS policy violations. The error message is:

```
new row violates row-level security policy for table "contact_messages"
```

This happens because the default RLS policies don't allow anonymous users (non-authenticated visitors) to insert data into the `contact_messages` table.

## The Solution

You need to manually update the RLS policies for the `contact_messages` table to allow anonymous insertions. This can be done directly in the Supabase SQL Editor.

## Step-by-Step Instructions

1. **Log in to your Supabase Dashboard**:
   - Go to [https://app.supabase.com/](https://app.supabase.com/)
   - Select your project (xahxjhzngahtcuekbpnj)

2. **Open the SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New query" to create a new SQL query

3. **Copy and Paste the SQL Script**:
   - Copy the entire SQL script from the file `scripts/manual-fix-rls.sql` in your project
   - Or copy the script below:

```sql
-- IMPORTANT: Run this script directly in the Supabase SQL Editor
-- This script fixes the RLS policies for the contact_messages table
-- to allow anonymous insertions without requiring authentication

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
```

4. **Run the SQL Script**:
   - Click the "Run" button to execute the script
   - You should see a success message indicating that the commands were executed

5. **Verify the Policies**:
   - Go to "Authentication" > "Policies" in the left sidebar
   - Find the `contact_messages` table
   - Verify that there are four policies:
     - "Anyone can insert contact messages" (INSERT)
     - "Authenticated users can view contact messages" (SELECT)
     - "Authenticated users can update contact messages" (UPDATE)
     - "Authenticated users can delete contact messages" (DELETE)

6. **Test the Contact Form**:
   - Go to your website's contact page
   - Fill out the form and submit it
   - The form should now successfully store the submission in the database

## What This Fix Does

This SQL script:

1. Temporarily disables RLS for the `contact_messages` table
2. Removes any existing policies that might be conflicting
3. Creates a new policy that allows both anonymous and authenticated users to insert messages
4. Creates policies that allow only authenticated users to view, update, and delete messages
5. Re-enables RLS for the table

## Troubleshooting

If you're still experiencing issues after applying this fix:

1. **Check the Console Logs**:
   - Open your browser's developer tools (F12)
   - Go to the Console tab
   - Look for any error messages when submitting the form

2. **Verify Table Structure**:
   - Make sure the `contact_messages` table exists and has the correct columns
   - The table should have columns for: name, email, phone, subject, message, read, created_at

3. **Check RLS Enablement**:
   - In Supabase, go to "Table Editor" > "contact_messages"
   - Click on "RLS" at the top
   - Make sure "Row Level Security" is enabled

4. **Contact Supabase Support**:
   - If you continue to have issues, you may need to contact Supabase support
   - Provide them with the error messages and the steps you've taken
