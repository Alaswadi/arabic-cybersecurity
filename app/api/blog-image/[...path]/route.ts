import { NextRequest, NextResponse } from "next/server";
import { join } from 'path';
import { readFile } from 'fs/promises';
import { existsSync, statSync } from 'fs';

// Define the type for the context parameter
type Context = {
  params: {
    path: string[]
  }
}

// Helper function to determine content type
function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  request: NextRequest,
  context: Context
): Promise<NextResponse> {
  try {
    // In Next.js 14, we need to avoid directly accessing properties of params
    // Instead, we'll use a completely different approach

    // Get the URL from the request
    const url = new URL(request.url);

    // Extract the path from the URL pathname
    // The pathname will be something like /api/blog-image/image.jpg
    const pathname = url.pathname;

    // Remove the /api/blog-image prefix to get the actual image path
    const imageName = pathname.replace(/^\/api\/blog-image\//, '');

    // Prepend 'blog/' to the path
    const imagePath = `blog/${imageName}`;

    console.log(`API Blog Image request for: ${imagePath}`);

    // Construct the full path to the image
    const fullPath = join(process.cwd(), 'public', 'uploads', imagePath);
    console.log(`Full path: ${fullPath}`);

    // Check if the file exists
    if (!existsSync(fullPath)) {
      console.error(`Blog image not found: ${fullPath}`);
      return new NextResponse('Image not found', { status: 404 });
    }

    // Log file stats for debugging
    try {
      const stats = statSync(fullPath);
      console.log(`File stats: size=${stats.size}, mode=${stats.mode.toString(8)}, last modified=${stats.mtime}`);
    } catch (statError) {
      console.error(`Error checking file stats: ${statError}`);
    }

    // Read the file
    const fileBuffer = await readFile(fullPath);
    console.log(`Successfully read file with size: ${fileBuffer.length} bytes`);

    // Determine the content type
    const contentType = getContentType(imageName);
    console.log(`Serving blog image with content type: ${contentType}`);

    // Return the image with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'ETag': `"${Buffer.from(fullPath).toString('base64')}"`, // Add ETag for caching
      },
    });
  } catch (error) {
    console.error('Error in blog image route handler:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
