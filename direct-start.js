// A direct start script that doesn't rely on shell scripts
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting the application with dynamic rendering...');

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.NEXT_FORCE_DYNAMIC = '1';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://xahxjhzngahtcuekbpnj.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E';

// Create .env.local file if it doesn't exist
if (!fs.existsSync('.env.local')) {
  console.log('Creating .env.local file...');
  const envContent =
  `NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E
NEXT_FORCE_DYNAMIC=1`;

  fs.writeFileSync('.env.local', envContent);
}

// Start the application
try {
  execSync('node_modules/.bin/next start', {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      NEXT_FORCE_DYNAMIC: '1',
      NEXT_PUBLIC_SUPABASE_URL: 'https://xahxjhzngahtcuekbpnj.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E'
    },
    stdio: 'inherit'
  });
} catch (error) {
  console.error('Failed to start the application:', error);
  process.exit(1);
}
