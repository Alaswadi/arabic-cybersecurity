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

// Backup admin directory
console.log('Backing up admin directory...');
const adminDir = path.join('app', 'admin');
const adminBackupDir = path.join('/tmp', 'admin-backup');

if (fs.existsSync(adminDir)) {
  if (!fs.existsSync(adminBackupDir)) {
    fs.mkdirSync(adminBackupDir, { recursive: true });
  }

  // Copy admin directory to backup
  execSync(`cp -r ${adminDir} ${adminBackupDir}`);

  // Remove admin directory
  execSync(`rm -rf ${adminDir}`);

  console.log('Admin directory backed up to /tmp/admin-backup');
} else {
  console.log('Admin directory not found, skipping backup');
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

// Restore admin directory
console.log('Restoring admin directory...');
const adminBackupSrcDir = path.join(adminBackupDir, 'admin');

if (fs.existsSync(adminBackupSrcDir)) {
  // Create admin directory
  if (!fs.existsSync(adminDir)) {
    fs.mkdirSync(adminDir, { recursive: true });
  }

  // Copy admin directory from backup
  execSync(`cp -r ${adminBackupSrcDir}/* ${adminDir}`);

  console.log('Admin directory restored from /tmp/admin-backup');
} else {
  console.log('Admin backup not found, skipping restore');
}

console.log('Build completed successfully!');
