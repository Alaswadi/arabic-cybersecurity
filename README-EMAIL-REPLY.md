# Email Reply Feature for Admin Messages

This guide explains how to set up and use the email reply feature for customer messages in the admin panel.

## Overview

The email reply feature allows administrators to respond directly to customer inquiries from the admin messages interface. When a reply is sent, the system:

1. Sends an email to the customer using Zoho email
2. Updates the message in the database to mark it as replied
3. Stores the reply content for future reference

## Setup Instructions

### 1. Configure Email Credentials

You need to set up your Zoho email credentials to use this feature. Run one of the following scripts based on your operating system:

#### For Windows:

```powershell
.\scripts\setup-email-env.ps1
```

#### For Linux/Mac:

```bash
./scripts/setup-email-env.sh
```

Follow the prompts to enter your Zoho email credentials:
- Email address
- Password
- SMTP host (default: smtp.zoho.com)
- SMTP port (default: 465)
- Sender name (default: Arabic Cybersecurity)

### 2. Update Database Schema

Run the database update script to add the necessary fields for storing reply information:

```bash
# Visit this URL in your browser (requires admin authentication)
http://localhost:3001/api/db/update-contact-reply-schema
```

Or use the admin panel's schema update tool at:
```
http://localhost:3001/admin/update-schema
```

## Using the Email Reply Feature

1. **Log in to the Admin Panel**:
   - Go to `/admin/login`
   - Enter your admin credentials

2. **Navigate to Messages**:
   - Go to `/admin/messages`
   - Click on a message to view its details

3. **Reply to a Message**:
   - On the message detail page, click the "الرد على الرسالة" (Reply to Message) button
   - Enter your reply in the text area
   - Click "إرسال الرد" (Send Reply)

4. **View Reply History**:
   - Once a reply has been sent, it will be displayed on the message detail page
   - The message will be marked as "تم الرد" (Replied)

## Troubleshooting

If you encounter issues with the email reply feature:

1. **Check Email Configuration**:
   - Verify your Zoho email credentials in `.env.local`
   - Make sure your Zoho account allows SMTP access
   - Check if you need to generate an app-specific password

2. **Check Network Access**:
   - Ensure your server can connect to Zoho's SMTP server
   - Check if any firewalls are blocking outgoing connections on the SMTP port

3. **Check Logs**:
   - Review server logs for any error messages related to email sending
   - Look for authentication or connection errors

## Security Considerations

- Email credentials are stored in the `.env.local` file, which should never be committed to version control
- All email operations are performed server-side to protect credentials
- Authentication is required to access the reply feature

## Technical Details

The email reply feature uses:
- Nodemailer for sending emails
- Zoho SMTP server for email delivery
- Supabase for storing message and reply data
- Server-side API routes to handle secure email sending

For more information, see the implementation files:
- `lib/email/config.ts` - Email configuration
- `lib/email/service.ts` - Email sending service
- `app/api/admin/messages/reply/route.ts` - API endpoint for sending replies
- `app/admin/messages/[id]/page.tsx` - UI for the reply feature
