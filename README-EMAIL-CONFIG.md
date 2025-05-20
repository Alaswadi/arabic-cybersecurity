# Setting Up Your Email Sender for the Contact Form

This guide explains how to set up your own email sender for the contact form in your Arabic cybersecurity website.

## Current Implementation

The contact form is set up to use your own SMTP server to send emails. To make it work, you need to:

1. Configure your email credentials
2. Install the Nodemailer package
3. Uncomment the email sending code

## Step 1: Configure Your Email Credentials

Open the file `lib/email/config.ts` and update the following values with your actual SMTP server credentials:

```typescript
export const emailConfig: EmailConfig = {
  host: 'smtp.example.com',     // Replace with your SMTP server host
  port: 587,                    // Replace with your SMTP server port
  secure: false,                // true for port 465, false for port 587
  email: 'info@phishsimulator.com', // Your email address
  password: 'your-email-password',  // Your email password or app password
  senderName: 'Arabic Cybersecurity Website', // The name to display as sender
};
```

### Common SMTP Settings

Here are some common SMTP settings for popular email providers:

#### Gmail
```
host: 'smtp.gmail.com'
port: 587
secure: false
```
Note: For Gmail, you'll need to use an "App Password" instead of your regular password. See [Google Account Help](https://support.google.com/accounts/answer/185833) for instructions.

#### Outlook/Office 365
```
host: 'smtp.office365.com'
port: 587
secure: false
```

#### Yahoo Mail
```
host: 'smtp.mail.yahoo.com'
port: 587
secure: false
```

## Step 2: Install Nodemailer

Run the following command to install Nodemailer:

```bash
npm install nodemailer
```

## Step 3: Uncomment the Email Sending Code

Open the file `lib/email/sender.ts` and uncomment the Nodemailer code section (lines 30-85 approximately).

First, add the import at the top of the file:
```typescript
import nodemailer from 'nodemailer';
```

Then uncomment the code block that starts with:
```typescript
// Create a transporter
const transporter = nodemailer.createTransport({
  // ...
```

And ends with:
```typescript
console.log('Email sent:', info.messageId);
```

Make sure to remove the placeholder code that just logs the email data.

## Step 4: Test the Contact Form

After completing the setup:

1. Restart your development server
2. Go to the contact page
3. Fill out the form and submit it
4. Check if you receive the email at the address you configured

## Troubleshooting

If you're not receiving emails:

1. Check your SMTP settings in `lib/email/config.ts`
2. Make sure your email provider allows SMTP access
3. For Gmail, Yahoo, and some other providers, you may need to:
   - Enable "Less secure app access" or
   - Create an "App Password" for your account
4. Check your spam/junk folder
5. Look at the server console for error messages

## Security Considerations

- Never commit your email password to version control
- Consider using environment variables for sensitive information
- For production, you might want to move the email credentials to environment variables:

```typescript
export const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  email: process.env.EMAIL_USER || 'info@phishsimulator.com',
  password: process.env.EMAIL_PASS || 'your-email-password',
  senderName: process.env.EMAIL_SENDER_NAME || 'Arabic Cybersecurity Website',
};
```

Then set these environment variables in your hosting environment.
