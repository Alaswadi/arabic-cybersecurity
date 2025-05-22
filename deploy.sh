#!/bin/bash

# Deployment script for Phish Simulator website

# Check if dokploy is installed
if ! command -v dokploy &> /dev/null; then
    echo "dokploy is not installed. Installing..."
    npm install -g dokploy
fi

# Deploy the application
echo "Deploying the application..."
dokploy deploy

echo "Deployment completed!"
echo "Your application should now be running at http://localhost:3000"
