# Image API Documentation

This document describes the image serving API endpoints available in the application.

## Overview

The application provides several API endpoints for serving images stored in the `/public/uploads/` directory. These endpoints handle error cases gracefully and provide appropriate caching headers.

## API Endpoints

### 1. General Image API

**Endpoint:** `/api/image/[...path]`

This endpoint serves any image from the `/public/uploads/` directory.

**Example:**
- `/api/image/blog/example.jpg` - Serves the image at `/public/uploads/blog/example.jpg`
- `/api/image/services/icon.png` - Serves the image at `/public/uploads/services/icon.png`

### 2. Blog Image API

**Endpoint:** `/api/blog-image/[...path]`

This endpoint is specifically for blog images and automatically prepends `blog/` to the path.

**Example:**
- `/api/blog-image/example.jpg` - Serves the image at `/public/uploads/blog/example.jpg`

### 3. Service Image API

**Endpoint:** `/api/service-image/[...path]`

This endpoint is specifically for service images and automatically prepends `services/` to the path.

**Example:**
- `/api/service-image/icon.png` - Serves the image at `/public/uploads/services/icon.png`

## Response Headers

The API sets the following headers for image responses:

- `Content-Type`: Automatically determined based on the file extension
- `Cache-Control`: Set to `public, max-age=86400` (24 hours) for production
- `ETag`: Generated based on the file path for caching

## Error Handling

The API handles various error cases:

1. **Invalid Path**: Returns a 400 status code
2. **Image Not Found**: Returns a 404 status code or serves a placeholder image if available
3. **Empty File**: Returns a 500 status code
4. **File Read Error**: Returns a 500 status code

## Placeholder Images

If an image is not found, the API attempts to serve a placeholder image from `/public/placeholder.svg`. If this file doesn't exist, a 404 response is returned.

## Usage in Components

When displaying images in your components, you can use these API endpoints to ensure proper error handling and caching:

```jsx
// For blog images
<img 
  src={`/api/blog-image/${imageName}`} 
  alt="Blog image" 
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder.svg';
  }}
/>

// For service images
<img 
  src={`/api/service-image/${imageName}`} 
  alt="Service image" 
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder.svg';
  }}
/>
```

## Implementation Details

The image serving functionality is implemented in the `lib/image-handler.ts` file, which provides helper functions for serving images with proper error handling and response headers.
