import { NextRequest, NextResponse } from "next/server";
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync, statSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the path from the URL
    const imagePath = params.path.join('/');
    console.log(`API Image request for: ${imagePath}`);

    // Construct the full path to the image
    const fullPath = join(process.cwd(), 'public', 'uploads', imagePath);
    console.log(`Full path: ${fullPath}`);

    // Check if the file exists
    if (!existsSync(fullPath)) {
      console.error(`Image not found: ${fullPath}`);

      // Try to serve a placeholder instead
      const placeholderPath = join(process.cwd(), 'public', 'placeholder.svg');
      if (existsSync(placeholderPath)) {
        const placeholderBuffer = await readFile(placeholderPath);
        return new NextResponse(placeholderBuffer, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        });
      }

      return new NextResponse('Image not found', { status: 404 });
    }

    // Check file stats
    try {
      const stats = statSync(fullPath);
      console.log(`File stats: size=${stats.size}, mode=${stats.mode.toString(8)}`);

      if (stats.size === 0) {
        console.error(`File exists but has zero bytes: ${fullPath}`);
        return new NextResponse('Empty file', { status: 500 });
      }
    } catch (statError) {
      console.error(`Error checking file stats: ${statError}`);
    }

    // Read the file
    const fileBuffer = await readFile(fullPath);
    console.log(`Successfully read file with size: ${fileBuffer.length} bytes`);

    // Determine the content type based on file extension
    const extension = imagePath.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';

    if (extension === 'jpg' || extension === 'jpeg') {
      contentType = 'image/jpeg';
    } else if (extension === 'png') {
      contentType = 'image/png';
    } else if (extension === 'gif') {
      contentType = 'image/gif';
    } else if (extension === 'webp') {
      contentType = 'image/webp';
    }

    console.log(`Serving image with content type: ${contentType}`);

    // Return the image with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Disable caching for debugging
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
}
