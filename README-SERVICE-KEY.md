# Setting Up Your Supabase Service Role Key

This guide will help you set up your Supabase service role key for the contact form functionality.

## Why You Need a Service Role Key

The contact form in this application requires a service role key to bypass Row Level Security (RLS) policies in Supabase. This allows anonymous users to submit contact forms without authentication.

## How to Get Your Service Role Key

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (xahxjhzngahtcuekbpnj)
3. Navigate to Project Settings > API
4. Find the "Project API keys" section
5. Copy the `service_role` key (it starts with "eyJh...")

## Setting Up Your Environment

### For Local Development

1. Open the `.env.local` file in the root of your project
2. Find the line that says `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-goes-here`
3. Replace `your-service-role-key-goes-here` with your actual service role key
4. Save the file
5. Restart your development server

### For Production Deployment

When deploying to production, you need to set the `SUPABASE_SERVICE_ROLE_KEY` environment variable in your hosting environment:

#### For Vercel:

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Add a new environment variable:
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your service role key
4. Save and redeploy your application

#### For Other Hosting Providers:

Follow your hosting provider's instructions for setting environment variables.

## Security Considerations

The service role key has full access to your database, bypassing RLS policies. Keep it secure:

- Never expose it in client-side code
- Never commit it to version control
- Use environment variables to store it
- Restrict its use to server-side code only

## Troubleshooting

If you see the error "Missing Supabase URL or service role key" when submitting the contact form:

1. Make sure you've set the `SUPABASE_SERVICE_ROLE_KEY` environment variable
2. Verify that the key is correct (it should start with "eyJh...")
3. Restart your development server or redeploy your application

If you continue to have issues, the form will fall back to a logging-only mode where submissions are logged to the console but not stored in the database.
