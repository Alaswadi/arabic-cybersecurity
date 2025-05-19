import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: NextRequest) {
  try {
    // Check authentication using the server component client for API routes
    const supabaseAuth = createServerComponentClient({ cookies })
    const { data: { session } } = await supabaseAuth.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!folder || (folder !== 'blog' && folder !== 'services')) {
      return NextResponse.json(
        { error: 'Invalid folder' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Create a unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`

    // Define the upload path
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
    const filePath = join(uploadDir, fileName)

    // Create the directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
      console.log(`Created directory: ${uploadDir}`)
    }

    // Log file details for debugging
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Log buffer size for debugging
    console.log(`Buffer size: ${buffer.length} bytes`);

    // Write the file to disk
    try {
      // Ensure the directory exists with proper permissions
      await mkdir(uploadDir, { recursive: true, mode: 0o755 })

      // Write the file with explicit permissions
      await writeFile(filePath, buffer)
      console.log(`File written successfully to: ${filePath}`)

      // Double-check if the file exists and has content
      const fs = require('fs');
      const stats = fs.statSync(filePath);
      console.log(`File stats: size=${stats.size}, mode=${stats.mode.toString(8)}`);

      if (stats.size === 0) {
        throw new Error('File was created but has zero bytes');
      }
    } catch (writeError) {
      console.error('Error writing file:', writeError)
      return NextResponse.json(
        { error: `Failed to write file: ${writeError.message}` },
        { status: 500 }
      )
    }

    // Construct the correct URL path
    const fileUrl = `/uploads/${folder}/${fileName}`;

    // Verify the file exists after writing
    const publicFilePath = join(process.cwd(), 'public', 'uploads', folder, fileName);

    console.log('File should be available at:', publicFilePath);
    console.log('Public URL will be:', fileUrl);

    // Set appropriate permissions on the file to ensure it's readable
    try {
      // On Unix systems, this would set read permissions for all users
      // This is a no-op on Windows
      const { chmod } = require('fs/promises');
      await chmod(filePath, 0o644);
    } catch (chmodError) {
      console.warn('Could not set file permissions:', chmodError);
      // Continue anyway as this might be Windows
    }

    // Return the URL to the uploaded file with cache-busting timestamp
    return NextResponse.json({
      url: fileUrl,
      success: true,
      timestamp: Date.now() // Add timestamp for cache busting
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
