#!/bin/bash

# Get the Supabase URL and service role key from the user
echo "Enter your Supabase URL (e.g., https://xahxjhzngahtcuekbpnj.supabase.co):"
read SUPABASE_URL

echo "Enter your Supabase service role key:"
read SUPABASE_SERVICE_ROLE_KEY

# Export the environment variables
export NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
export SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# Run the script
node scripts/create-buckets.js
