#!/bin/bash

# Script to prepare a pre-built version of the Next.js application for cPanel

# Create a deployment directory
mkdir -p prebuilt

# Copy the necessary files and directories
echo "Copying build directory..."
cp -r build prebuilt/

echo "Copying public directory..."
cp -r public prebuilt/

echo "Creating uploads directories if they don't exist..."
mkdir -p prebuilt/public/uploads/blog
mkdir -p prebuilt/public/uploads/services

echo "Creating a .htaccess file for cPanel..."
cat > prebuilt/.htaccess << 'EOL'
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

echo "Creating a minimal server.js file..."
cat > prebuilt/server.js << 'EOL'
const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const next = require('next');

// Make sure we're running in production mode
process.env.NODE_ENV = 'production';

// Get the port from the environment or use 3000 as default
const port = process.env.PORT || 3000;

// Create the Next.js app
const app = next({
  dev: false,
  dir: __dirname,
  conf: {
    distDir: path.join(__dirname, 'build'),
  }
});

// Get the request handler
const handle = app.getRequestHandler();

// Prepare the app
app.prepare()
  .then(() => {
    // Create the server
    const server = createServer(async (req, res) => {
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
    });
    
    // Start the server
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on port ${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
EOL

echo "Creating a minimal package.json..."
cat > prebuilt/package.json << 'EOL'
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
    "react-dom": "^18.3.1",
    "fs": "0.0.1-security",
    "path": "0.12.7",
    "url": "0.11.3"
  }
}
EOL

echo "Creating a .npmrc file..."
cat > prebuilt/.npmrc << 'EOL'
legacy-peer-deps=true
engine-strict=false
fund=false
audit=false
loglevel=error
prefer-offline=true
progress=false
save-exact=true
package-lock=false
EOL

echo "Creating a start.sh script..."
cat > prebuilt/start.sh << 'EOL'
#!/bin/bash

# Set NODE_ENV to production
export NODE_ENV=production

# Start the application
node server.js
EOL

# Make start.sh executable
chmod +x prebuilt/start.sh

echo "Creating a README.md with deployment instructions..."
cat > prebuilt/README.md << 'EOL'
# Phish Simulator Website - Pre-built cPanel Deployment

## Deployment Instructions

### 1. Upload Files to cPanel

1. Upload all files from this directory to your cPanel account
2. Make sure the .htaccess file is uploaded correctly (it might be hidden by default)

### 2. Set Up Node.js Application in cPanel

1. Go to cPanel > Setup Node.js App
2. Click "Create Application"
3. Configure the application:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: The directory where you uploaded the files
   - Application URL: Your domain or subdomain
   - Application startup file: start.sh
   - Click "Create"

### 3. Install Minimal Dependencies

1. In the Node.js App interface, click on "Run NPM Install" for your application
   - This should be quick as we're only installing a few core dependencies

### 4. Set Environment Variables

1. In the Node.js App interface, click "Edit" for your application
2. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`
   - `NODE_ENV=production`
   - `PORT=3000` (or whatever port your cPanel provider requires)
3. Click "Save"

### 5. Set File Permissions

1. Make start.sh executable: Right-click on start.sh, select "Change Permissions", set to 755
2. Make uploads directory writable:
   - Navigate to public/uploads
   - Right-click on the uploads directory and select "Change Permissions"
   - Set permissions to 755 for directories
   - Set permissions to 644 for files

### 6. Start the Application

1. In the Node.js App interface, click "Start" for your application
2. Visit your domain to verify that the application is running

## Troubleshooting

If you encounter any issues, check the application logs in the Node.js App interface.
EOL

echo "Pre-built package created in the 'prebuilt' directory"
echo "Upload the contents of this directory to your cPanel account and follow the instructions in the README.md file."
