#!/bin/bash
# Setup Email Environment Variables for Zoho Email
# This script adds Zoho email configuration to your .env.local file

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found. Please run setup-env.sh first."
    exit 1
fi

# Prompt for Zoho email credentials
echo "Enter your Zoho email address:"
read zoho_email

echo "Enter your Zoho email password:"
read -s zoho_password
echo ""

echo "Enter Zoho SMTP host (default: smtp.zoho.com):"
read zoho_smtp_host

echo "Enter Zoho SMTP port (default: 465):"
read zoho_smtp_port

echo "Enter the sender name to display in emails (default: Arabic Cybersecurity):"
read email_from_name

# Use defaults if not provided
if [ -z "$zoho_smtp_host" ]; then
    zoho_smtp_host="smtp.zoho.com"
fi

if [ -z "$zoho_smtp_port" ]; then
    zoho_smtp_port="465"
fi

if [ -z "$email_from_name" ]; then
    email_from_name="Arabic Cybersecurity"
fi

# Check if email configuration already exists
if grep -q "ZOHO_EMAIL=" .env.local; then
    echo "Email configuration already exists in .env.local. Updating..."
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Update existing configuration
    cat .env.local | \
    sed "s/ZOHO_EMAIL=.*/ZOHO_EMAIL=$zoho_email/" | \
    sed "s/ZOHO_PASSWORD=.*/ZOHO_PASSWORD=$zoho_password/" | \
    sed "s/ZOHO_SMTP_HOST=.*/ZOHO_SMTP_HOST=$zoho_smtp_host/" | \
    sed "s/ZOHO_SMTP_PORT=.*/ZOHO_SMTP_PORT=$zoho_smtp_port/" | \
    sed "s/EMAIL_FROM_NAME=.*/EMAIL_FROM_NAME=$email_from_name/" > "$temp_file"
    
    # Replace .env.local with the updated content
    mv "$temp_file" .env.local
else
    echo "Adding email configuration to .env.local..."
    
    # Add email configuration to .env.local
    cat >> .env.local << EOF

# Email Configuration
ZOHO_EMAIL=$zoho_email
ZOHO_PASSWORD=$zoho_password
ZOHO_SMTP_HOST=$zoho_smtp_host
ZOHO_SMTP_PORT=$zoho_smtp_port
EMAIL_FROM_NAME=$email_from_name
EOF
fi

echo "Email configuration has been added to .env.local"
echo "IMPORTANT: Keep your .env.local file secure and never commit it to version control!"

# Make the script executable
chmod +x scripts/setup-email-env.sh
