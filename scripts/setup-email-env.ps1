# Setup Email Environment Variables for Zoho Email
# This script adds Zoho email configuration to your .env.local file

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "Error: .env.local file not found. Please run setup-env.ps1 first." -ForegroundColor Red
    exit 1
}

# Prompt for Zoho email credentials
$zohoEmail = Read-Host "Enter your Zoho email address"
$zohoPassword = Read-Host "Enter your Zoho email password" -AsSecureString
$zohoPasswordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($zohoPassword))
$zohoSmtpHost = Read-Host "Enter Zoho SMTP host (default: smtp.zoho.com)"
$zohoSmtpPort = Read-Host "Enter Zoho SMTP port (default: 465)"
$emailFromName = Read-Host "Enter the sender name to display in emails (default: Arabic Cybersecurity)"

# Use defaults if not provided
if ([string]::IsNullOrWhiteSpace($zohoSmtpHost)) {
    $zohoSmtpHost = "smtp.zoho.com"
}
if ([string]::IsNullOrWhiteSpace($zohoSmtpPort)) {
    $zohoSmtpPort = "465"
}
if ([string]::IsNullOrWhiteSpace($emailFromName)) {
    $emailFromName = "Arabic Cybersecurity"
}

# Read existing .env.local content
$envContent = Get-Content .env.local -Raw

# Check if email configuration already exists
$emailConfigExists = $envContent -match "ZOHO_EMAIL="

if ($emailConfigExists) {
    Write-Host "Email configuration already exists in .env.local. Updating..." -ForegroundColor Yellow
    
    # Update existing configuration
    $envContent = $envContent -replace "ZOHO_EMAIL=.*", "ZOHO_EMAIL=$zohoEmail"
    $envContent = $envContent -replace "ZOHO_PASSWORD=.*", "ZOHO_PASSWORD=$zohoPasswordText"
    $envContent = $envContent -replace "ZOHO_SMTP_HOST=.*", "ZOHO_SMTP_HOST=$zohoSmtpHost"
    $envContent = $envContent -replace "ZOHO_SMTP_PORT=.*", "ZOHO_SMTP_PORT=$zohoSmtpPort"
    $envContent = $envContent -replace "EMAIL_FROM_NAME=.*", "EMAIL_FROM_NAME=$emailFromName"
    
    # Write updated content back to .env.local
    Set-Content -Path .env.local -Value $envContent
} else {
    Write-Host "Adding email configuration to .env.local..." -ForegroundColor Green
    
    # Add email configuration to .env.local
    $emailConfig = @"

# Email Configuration
ZOHO_EMAIL=$zohoEmail
ZOHO_PASSWORD=$zohoPasswordText
ZOHO_SMTP_HOST=$zohoSmtpHost
ZOHO_SMTP_PORT=$zohoSmtpPort
EMAIL_FROM_NAME=$emailFromName
"@
    
    # Append to .env.local
    Add-Content -Path .env.local -Value $emailConfig
}

Write-Host "Email configuration has been added to .env.local" -ForegroundColor Green
Write-Host "IMPORTANT: Keep your .env.local file secure and never commit it to version control!" -ForegroundColor Yellow
