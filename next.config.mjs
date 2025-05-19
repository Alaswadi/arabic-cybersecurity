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
  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],
  // Set all pages to be server-side rendered by default
  // This ensures dynamic data fetching from Supabase
  reactStrictMode: true,
  // Add experimental features for better compatibility
  experimental: {
    // Increase the timeout for page generation
    pageGenerationTimeout: 180,
  },
}

export default nextConfig
