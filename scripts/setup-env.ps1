# PowerShell script to set up environment variables for the project

# Check if .env.local exists
if (Test-Path .env.local) {
    Write-Host "Backing up existing .env.local file to .env.local.bak"
    Copy-Item .env.local .env.local.bak
}

# Prompt for Supabase service role key
$serviceRoleKey = Read-Host "Enter your Supabase service role key (from Project Settings > API > service_role key)"

# Create .env.local file
@"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E
SUPABASE_SERVICE_ROLE_KEY=$serviceRoleKey

# Next.js Configuration
NEXT_FORCE_DYNAMIC=1
"@ | Out-File -FilePath .env.local -Encoding utf8

Write-Host "Environment variables set up successfully in .env.local"
Write-Host "Please restart your development server for the changes to take effect"
