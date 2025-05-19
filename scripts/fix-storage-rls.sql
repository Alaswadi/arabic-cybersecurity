-- This script fixes the RLS policies for the storage bucket
-- Run this in the Supabase SQL Editor

-- Allow public access to the images bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated users to upload files to the images bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update their own files" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete their own files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );
