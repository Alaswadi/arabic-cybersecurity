# Setting Up Email Sending for Contact Form

This guide explains how to set up email sending for the contact form in your Arabic cybersecurity website.

## Current Implementation

Currently, the contact form submissions are:
1. Validated on the client and server side
2. Logged to the console
3. A success message is shown to the user

However, the actual email sending functionality needs to be implemented.

## How to Implement Email Sending

### Option 1: Using a Transactional Email Service (Recommended)

The easiest and most reliable way to send emails is to use a transactional email service like:

- [SendGrid](https://sendgrid.com/)
- [Mailgun](https://www.mailgun.com/)
- [Amazon SES](https://aws.amazon.com/ses/)
- [Resend](https://resend.com/)

#### Steps for SendGrid:

1. Sign up for a SendGrid account
2. Create an API key
3. Install the SendGrid package:
   ```bash
   npm install @sendgrid/mail
   ```
4. Update the contact-email API endpoint:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import sgMail from '@sendgrid/mail';

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Define validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يحتوي على حرفين على الأقل" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "الرسالة يجب أن تحتوي على 10 أحرف على الأقل" }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the form data
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        { 
          success: false, 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    // Get validated data
    const { name, email, phone, subject, message } = validationResult.data;
    
    // Create email message
    const msg = {
      to: 'info@phishsimulator.com',
      from: 'info@phishsimulator.com', // Must be a verified sender
      subject: subject ? `رسالة جديدة: ${subject}` : 'رسالة جديدة من موقع الأمن السيبراني',
      text: `
        اسم المرسل: ${name}
        البريد الإلكتروني: ${email}
        ${phone ? `رقم الهاتف: ${phone}` : ''}
        
        الرسالة:
        ${message}
      `,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">رسالة جديدة من موقع الأمن السيبراني</h2>
          <p><strong>اسم المرسل:</strong> ${name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          ${phone ? `<p><strong>رقم الهاتف:</strong> ${phone}</p>` : ''}
          ${subject ? `<p><strong>الموضوع:</strong> ${subject}</p>` : ''}
          <div style="margin-top: 20px;">
            <h3 style="color: #555;">الرسالة:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `,
    };
    
    // Send the email
    try {
      await sgMail.send(msg);
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: "تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.",
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // Log the submission as a fallback
      console.log('Contact form submission (email failed):');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Phone:', phone || 'Not provided');
      console.log('Subject:', subject || 'Not provided');
      console.log('Message:', message);
      
      // Return a success response even though the email failed
      return NextResponse.json({
        success: true,
        message: "تم استلام رسالتك بنجاح. سنتواصل معك قريبًا.",
      });
    }
  } catch (error) {
    console.error('Unexpected error in contact form submission:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى." 
      },
      { status: 500 }
    );
  }
}
```

### Option 2: Using SMTP with Nodemailer

If you prefer to use your own SMTP server:

1. Install Nodemailer:
   ```bash
   npm install nodemailer
   ```

2. Update the contact-email API endpoint with your SMTP credentials.

## Environment Variables

Make sure to set up the following environment variables:

For SendGrid:
```
SENDGRID_API_KEY=your_sendgrid_api_key
```

For Nodemailer:
```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## Testing

After implementation, test the contact form by submitting a test message and checking if the email is received at the specified address.
