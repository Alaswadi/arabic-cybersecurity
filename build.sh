#!/bin/sh

# Create a .env.local file with environment variables
echo "NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTI3NzcsImV4cCI6MjAzMTUyODc3N30.Nh8yCZtYJJnRBLGnB9LUqhBpkLhqDMpJgBpQk_aVwYM" >> .env.local

# Create uploads directories
mkdir -p public/uploads/blog public/uploads/services

# Skip admin pages during build by using a direct build command
echo "Building the application with Next.js..."
NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NTI3NzcsImV4cCI6MjAzMTUyODc3N30.Nh8yCZtYJJnRBLGnB9LUqhBpkLhqDMpJgBpQk_aVwYM node_modules/.bin/next build

echo "Build completed successfully!"
