import { emailConfig, isEmailConfigValid } from './config';

interface EmailData {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

/**
 * Sends an email using the configured SMTP server
 * This is a placeholder function that will be implemented with Nodemailer
 * when the package is installed
 */
export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: any }> {
  // Check if email configuration is valid
  if (!isEmailConfigValid()) {
    console.error('Invalid email configuration. Please update lib/email/config.ts');
    return { 
      success: false, 
      error: 'Invalid email configuration' 
    };
  }

  try {
    // This is where we would use Nodemailer to send the email
    // For now, we'll just log the data and configuration
    console.log('Email would be sent with the following data:');
    console.log('From:', `"${emailConfig.senderName}" <${emailConfig.email}>`);
    console.log('To:', emailConfig.email);
    console.log('Subject:', data.subject || 'رسالة جديدة من موقع الأمن السيبراني');
    console.log('Name:', data.name);
    console.log('Email:', data.email);
    console.log('Phone:', data.phone || 'Not provided');
    console.log('Message:', data.message);
    
    // To implement with Nodemailer, uncomment this code and install nodemailer:
    /*
    // Import nodemailer at the top of the file:
    // import nodemailer from 'nodemailer';
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.email,
        pass: emailConfig.password,
      },
    });
    
    // Format the email content
    const mailOptions = {
      from: `"${emailConfig.senderName}" <${emailConfig.email}>`,
      to: emailConfig.email,
      subject: data.subject || 'رسالة جديدة من موقع الأمن السيبراني',
      text: `
        اسم المرسل: ${data.name}
        البريد الإلكتروني: ${data.email}
        ${data.phone ? `رقم الهاتف: ${data.phone}` : ''}
        
        الرسالة:
        ${data.message}
      `,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">رسالة جديدة من موقع الأمن السيبراني</h2>
          <p><strong>اسم المرسل:</strong> ${data.name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>رقم الهاتف:</strong> ${data.phone}</p>` : ''}
          ${data.subject ? `<p><strong>الموضوع:</strong> ${data.subject}</p>` : ''}
          <div style="margin-top: 20px;">
            <h3 style="color: #555;">الرسالة:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">
            تم إرسال هذه الرسالة من نموذج الاتصال في موقع الأمن السيبراني.
          </p>
        </div>
      `,
    };
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    */
    
    // For now, simulate a successful email send
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error 
    };
  }
}
