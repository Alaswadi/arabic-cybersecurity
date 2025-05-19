import { createClient } from '@/lib/supabase/server'
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient()

    // Get the current policies
    const { data: policies, error: policiesError } = await supabase.rpc('get_policies')

    if (policiesError) {
      return NextResponse.json({ error: policiesError.message }, { status: 500 })
    }

    return NextResponse.json({ policies })
  } catch (error) {
    console.error('Error getting policies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = createClient()

    // Update storage policy for the images bucket
    // Allow authenticated users to upload files
    const { error: insertError } = await supabase.storage.from('images').upload('test.txt', new Blob(['test']), {
      upsert: true
    })

    if (insertError) {
      console.error('Error uploading test file:', insertError)

      // Return detailed error information
      return NextResponse.json({
        error: insertError.message,
        details: `
          To fix this issue, please run the following SQL in the Supabase SQL Editor:

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
        `
      }, { status: 500 })
    }

    // Delete the test file
    const { error: deleteError } = await supabase.storage.from('images').remove(['test.txt'])

    if (deleteError) {
      console.warn('Could not delete test file:', deleteError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating storage policy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
