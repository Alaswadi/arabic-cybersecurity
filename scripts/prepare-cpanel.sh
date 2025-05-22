#!/bin/bash

# Script to prepare the Next.js application for cPanel deployment

# Create a deployment directory
mkdir -p deployment

# Copy the necessary files and directories
echo "Copying package.json..."
cp package.json deployment/

echo "Copying next.config.mjs..."
cp next.config.mjs deployment/

echo "Copying .env.local (if exists)..."
if [ -f .env.local ]; then
  cp .env.local deployment/
fi

echo "Copying build directory..."
cp -r build deployment/

echo "Copying public directory..."
cp -r public deployment/

echo "Creating uploads directories if they don't exist..."
mkdir -p deployment/public/uploads/blog
mkdir -p deployment/public/uploads/services

echo "Creating a .htaccess file for cPanel..."
cat > deployment/.htaccess << 'EOL'
# Disable directory listing
Options -Indexes

# Handle Next.js routing
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Redirect to HTTPS if not already
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # If the request is not for a file or directory that exists
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite all requests to the Next.js server
  RewriteRule ^(.*)$ /server.js [L]
</IfModule>
EOL

echo "Creating a server.js file for Node.js in cPanel..."
cat > deployment/server.js << 'EOL'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);

      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
EOL

echo "Creating a package.json for cPanel..."
cat > deployment/package.json << 'EOL'
{
  "name": "arabic-cybersecurity",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "NODE_ENV=production node server.js"
  },
  "dependencies": {
    "next": "13.5.6",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
EOL

echo "Creating a README.md with deployment instructions..."
cat > deployment/README.md << 'EOL'
# Phish Simulator Website - cPanel Deployment

## Deployment Instructions

1. Upload all files to your cPanel account
2. Set up a Node.js application in cPanel:
   - Go to cPanel > Setup Node.js App
   - Create a new application
   - Set the Node.js version to 18.x or higher
   - Set the Application mode to Production
   - Set the Application root to the directory where you uploaded the files
   - Set the Application URL to your domain
   - Set the Application startup file to server.js
   - Save the configuration

3. Install dependencies:
   - Go to cPanel > Terminal
   - Navigate to your application directory
   - Run `npm install`

4. Start the application:
   - In the Node.js App interface, click "Start" for your application

5. Set up environment variables:
   - In the Node.js App interface, click "Edit" for your application
   - Add the following environment variables:
     - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

6. Make sure the uploads directory is writable:
   - Go to cPanel > File Manager
   - Navigate to your application directory > public > uploads
   - Right-click on the uploads directory and select "Change Permissions"
   - Set permissions to 755 for directories and 644 for files

## Troubleshooting

If you encounter any issues, check the application logs in the Node.js App interface.
EOL

echo "Deployment directory created: ./deployment"
echo "Upload the contents of this directory to your cPanel account and follow the instructions in the README.md file."
