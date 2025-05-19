#!/bin/bash

# Create a .env.local file with environment variables
echo "NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTI3NzcsImV4cCI6MjAzMTUyODc3N30.Nh8yCZtYJJnRBLGnB9LUqhBpkLhqDMpJgBpQk_aVwYM" >> .env.local

# Create uploads directories
mkdir -p public/uploads/blog public/uploads/services

# Create a temporary admin directory to exclude admin pages from build
echo "Backing up admin directory..."
mkdir -p /tmp/admin-backup
cp -r app/admin /tmp/admin-backup
rm -rf app/admin

# Use the custom next.config.mjs for the build
echo "Using custom next.config.mjs for build..."
cp next.config.build.mjs next.config.mjs.bak
cp next.config.build.mjs next.config.mjs

# Build the application with environment variables
echo "Building the application..."
NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTI3NzcsImV4cCI6MjAzMTUyODc3N30.Nh8yCZtYJJnRBLGnB9LUqhBpkLhqDMpJgBpQk_aVwYM pnpm build:next

# Restore the original next.config.mjs
echo "Restoring original next.config.mjs..."
mv next.config.mjs.bak next.config.mjs

# Restore admin directory after build
echo "Restoring admin directory..."
mkdir -p app/admin
cp -r /tmp/admin-backup/* app/admin/

echo "Build completed successfully!"
