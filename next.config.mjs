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
  // Add experimental features for better compatibility
  experimental: {
    // This helps with Supabase data fetching during build
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    // Increase the timeout for static generation
    staticPageGenerationTimeout: 180,
  },
  // Set all pages to be server-side rendered by default
  // This ensures dynamic data fetching from Supabase
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig
