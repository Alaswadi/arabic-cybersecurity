/**
 * Email service for sending emails using Zoho
 */
import nodemailer from 'nodemailer';
import { getEmailConfig, isEmailConfigured } from './config';

// Email sending options interface
export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

/**
 * Send an email using the configured email service
 * @param options Email sending options
 * @returns Promise resolving to success status and message
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      return {
        success: false,
        message: 'Email service is not configured. Please check your environment variables.',
      };
    }

    // Get email configuration
    const config = getEmailConfig();
    if (!config) {
      return {
        success: false,
        message: 'Failed to get email configuration.',
      };
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });

    // Set up email data
    const mailOptions = {
      from: config.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
      replyTo: options.replyTo || config.auth.user,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    return {
      success: true,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error sending email',
    };
  }
}

/**
 * Create an HTML email template for customer replies
 * @param content The reply content
 * @param customerName The customer's name
 * @returns HTML email content
 */
export function createReplyEmailTemplate(content: string, customerName: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>رد على رسالتك</title>
  <style>
    body {
      font-family: Arial, Tahoma, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #0070f3;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .footer {
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eaeaea;
      padding-top: 10px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>رد على استفسارك</h2>
  </div>
  <div class="content">
    <p>مرحباً ${customerName}،</p>
    <p>${content}</p>
    <p>نشكرك على تواصلك معنا.</p>
  </div>
  <div class="footer">
    <p>هذا رد آلي، يرجى عدم الرد على هذا البريد الإلكتروني.</p>
    <p>© ${new Date().getFullYear()} Arabic Cybersecurity. جميع الحقوق محفوظة.</p>
  </div>
</body>
</html>
  `;
}
