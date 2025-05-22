/**
 * Email configuration for Zoho email service
 * This file handles the secure configuration for sending emails
 */

// Environment variable names for email configuration
export const EMAIL_ENV_VARS = {
  ZOHO_EMAIL: 'ZOHO_EMAIL',
  ZOHO_PASSWORD: 'ZOHO_PASSWORD',
  ZOHO_SMTP_HOST: 'ZOHO_SMTP_HOST',
  ZOHO_SMTP_PORT: 'ZOHO_SMTP_PORT',
  EMAIL_FROM_NAME: 'EMAIL_FROM_NAME',
};

// Interface for email configuration
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

/**
 * Get email configuration from environment variables
 * @returns Email configuration object or null if configuration is incomplete
 */
export function getEmailConfig(): EmailConfig | null {
  // Check if all required environment variables are set
  const email = process.env[EMAIL_ENV_VARS.ZOHO_EMAIL];
  const password = process.env[EMAIL_ENV_VARS.ZOHO_PASSWORD];
  const host = process.env[EMAIL_ENV_VARS.ZOHO_SMTP_HOST] || 'smtp.zoho.com';
  const portStr = process.env[EMAIL_ENV_VARS.ZOHO_SMTP_PORT] || '465';
  const fromName = process.env[EMAIL_ENV_VARS.EMAIL_FROM_NAME] || 'Phish Simulator';

  // Validate required configuration
  if (!email || !password) {
    console.error('Email configuration is incomplete. Missing required environment variables.');
    return null;
  }

  // Parse port number
  const port = parseInt(portStr, 10);
  if (isNaN(port)) {
    console.error('Invalid SMTP port number');
    return null;
  }

  // Return email configuration
  return {
    host,
    port,
    secure: port === 465, // true for port 465, false for other ports
    auth: {
      user: email,
      pass: password,
    },
    from: `"${fromName}" <${email}>`,
  };
}

/**
 * Validate email configuration
 * @returns True if email configuration is valid, false otherwise
 */
export function isEmailConfigured(): boolean {
  return getEmailConfig() !== null;
}
