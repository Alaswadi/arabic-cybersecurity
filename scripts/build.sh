#!/bin/bash

# Build script for the Next.js application

# Create the uploads directory if it doesn't exist
mkdir -p public/uploads/blog public/uploads/services

# Install dependencies
npm install

# Build the application
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build completed successfully!"
  echo "The application has been built in the 'build' directory."
  echo ""
  echo "To start the application:"
  echo "npm run start"
  echo ""
  echo "To deploy the application:"
  echo "1. Copy the entire project directory to your server."
  echo "2. Run 'npm install' on the server."
  echo "3. Run 'npm run build' on the server."
  echo "4. Run 'npm run start' on the server."
  echo "5. Make sure the 'public/uploads' directory is writable by the web server for file uploads."
else
  echo "Build failed. Please check the error messages above."
fi
