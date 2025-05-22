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
