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
  // Add experimental features for better compatibility
  experimental: {
    // Configure server actions and components
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // External packages for server components
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
}

export default nextConfig
