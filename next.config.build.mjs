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
  // Exclude admin pages from static generation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Skip admin pages during build
  excludeDefaultMomentLocales: true,
  // Exclude specific paths from the build
  transpilePackages: ['@supabase/auth-helpers-nextjs'],
}

export default nextConfig
