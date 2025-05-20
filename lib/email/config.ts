// Email configuration for the contact form
// Replace these values with your actual SMTP server credentials

interface EmailConfig {
  // SMTP server host (e.g., smtp.gmail.com, smtp.office365.com)
  host: string;
  
  // SMTP server port (usually 587 for TLS, 465 for SSL)
  port: number;
  
  // Whether to use secure connection (usually true for port 465, false for port 587)
  secure: boolean;
  
  // Your email address (used as both sender and recipient)
  email: string;
  
  // Your email password or app password
  password: string;
  
  // The name to display as the sender
  senderName: string;
}

export const emailConfig: EmailConfig = {
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  email: 'info@phishsimulator.com',
  password: 'your-email-password',
  senderName: 'Arabic Cybersecurity Website',
};

// Function to validate email configuration
export function isEmailConfigValid(): boolean {
  return (
    !!emailConfig.host &&
    !!emailConfig.port &&
    !!emailConfig.email &&
    !!emailConfig.password
  );
}
