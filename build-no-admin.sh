#!/bin/sh

# This script builds the application without admin pages

# Create a .env.local file with environment variables
echo "NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTI3NzcsImV4cCI6MjAzMTUyODc3N30.Nh8yCZtYJJnRBLGnB9LUqhBpkLhqDMpJgBpQk_aVwYM" >> .env.local
echo "NEXT_FORCE_DYNAMIC=1" >> .env.local

# Backup admin directory
echo "Backing up admin directory..."
mkdir -p /tmp/admin-backup
cp -r app/admin /tmp/admin-backup
rm -rf app/admin
echo "Admin directory backed up to /tmp/admin-backup"

# Build the application
echo "Building the application..."
NEXT_FORCE_DYNAMIC=1 NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTI3NzcsImV4cCI6MjAzMTUyODc3N30.Nh8yCZtYJJnRBLGnB9LUqhBpkLhqDMpJgBpQk_aVwYM node_modules/.bin/next build

# Restore admin directory
echo "Restoring admin directory..."
mkdir -p app/admin
cp -r /tmp/admin-backup/admin/* app/admin/
echo "Admin directory restored from /tmp/admin-backup"

echo "Build completed successfully!"
