/**
 * Transforms a Supabase storage URL to ensure it works correctly
 * This is needed because sometimes the public URLs from Supabase storage
 * don't work correctly due to bucket permissions or configuration
 */
export function transformStorageUrl(url: string): string {
  if (!url) return '';

  // If it's already a working URL (e.g., a URL from another source), return it as is
  if (!url.includes('supabase.co/storage')) {
    return url;
  }

  // Check if the URL already has a token (signed URL)
  if (url.includes('?token=')) {
    return url; // It's already a signed URL, return as is
  }

  // For Supabase storage URLs, we need to ensure they're in the correct format
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || 'xahxjhzngahtcuekbpnj';

  // Convert from public URL to signed URL format
  // From: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
  // To:   https://[project-ref].supabase.co/storage/v1/object/sign/[bucket]/[path]
  if (url.includes('/storage/v1/object/public/')) {
    const baseUrl = url.replace('/storage/v1/object/public/', '/storage/v1/object/sign/');

    // Add a dummy token parameter - this will be replaced by the actual signed URL in the component
    return `${baseUrl}?dummy=1`;
  }

  return url;
}
