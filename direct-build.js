// A direct build script that doesn't rely on shell scripts
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting direct build process...');

// Create .env.local file
console.log('Creating .env.local file...');
const envContent =
`NEXT_PUBLIC_SUPABASE_URL=https://xahxjhzngahtcuekbpnj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaHhqaHpuZ2FodGN1ZWticG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDg5MDksImV4cCI6MjA2MjQ4NDkwOX0.S77Knjse4ZQCcHBfjai7Cu1ThcElR60_iV23huRWa3E
NEXT_FORCE_DYNAMIC=1`;

fs.writeFileSync('.env.local', envContent);

// Create uploads directories
console.log('Creating uploads directories...');
const uploadsDir = path.join('public', 'uploads');
const blogUploadsDir = path.join(uploadsDir, 'blog');
const servicesUploadsDir = path.join(uploadsDir, 'services');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(blogUploadsDir)) {
  fs.mkdirSync(blogUploadsDir, { recursive: true });
}
if (!fs.existsSync(servicesUploadsDir)) {
  fs.mkdirSync(servicesUploadsDir, { recursive: true });
}

// We're no longer removing the admin directory
// Instead, we'll ensure it's properly configured for dynamic rendering
console.log('Configuring admin directory for dynamic rendering...');
const adminDir = path.join('app', 'admin');
const adminConfigFile = path.join(adminDir, 'config.ts');

if (fs.existsSync(adminDir)) {
  // Make sure the admin config file exists and has the right content
  const configContent = `// This file contains configuration for the admin pages

// Set dynamic to force-dynamic to prevent static generation
export const dynamic = 'force-dynamic'

// Skip prerendering for admin pages
export const generateStaticParams = () => {
  return []
}
`;

  // Write or update the config file
  fs.writeFileSync(adminConfigFile, configContent);
  console.log('Admin directory configured for dynamic rendering');
} else {
  console.log('Admin directory not found, skipping configuration');
}

// Build the application
console.log('Building the application...');
try {
  execSync('node_modules/.bin/next build', {
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
  console.error('Build failed:', error);
  process.exit(1);
}

// No need to restore admin directory since we're not removing it anymore
console.log('Admin directory was preserved during build');

console.log('Build completed successfully!');
