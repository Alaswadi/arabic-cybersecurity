/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure uploaded files are included in the build
  distDir: 'build',
  // Ensure the uploads directory is not processed by webpack
  webpack: (config) => {
    config.module.rules.push({
      test: /public\/uploads/,
      use: 'file-loader',
    });
    return config;
  },
  // Set all pages to be server-side rendered by default
  // This ensures dynamic data fetching from Supabase
  reactStrictMode: true,
  // Configure server actions and components
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Turbopack configuration (stable, no longer experimental)
  turbopack: {
    // No specific rules needed as we'll use the default handling
  },
  // External packages for server components (moved from experimental)
  serverExternalPackages: ['@supabase/supabase-js'],
}

export default nextConfig

