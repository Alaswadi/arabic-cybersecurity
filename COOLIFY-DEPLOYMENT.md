# Deploying to Coolify

This guide will help you deploy your application to Coolify and configure the necessary environment variables.

## Prerequisites

- A Coolify account and server
- Your Supabase project details

## Setting Up Environment Variables in Coolify

When deploying to Coolify, you need to set up the following environment variables:

### Required Environment Variables

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Your Supabase project URL (e.g., `https://xahxjhzngahtcuekbpnj.supabase.co`)

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Your Supabase anonymous key (starts with `eyJh...`)

3. **SUPABASE_SERVICE_ROLE_KEY** (Important!)
   - Your Supabase service role key (starts with `eyJh...`)
   - This is required for the contact form and admin functionality

4. **NEXT_FORCE_DYNAMIC**
   - Set to `1` to ensure dynamic rendering

### How to Get Your Supabase Service Role Key

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (xahxjhzngahtcuekbpnj)
3. Navigate to Project Settings > API
4. Find the "Project API keys" section
5. Copy the `service_role` key (it starts with "eyJh...")

### Setting Up in Coolify

1. In your Coolify dashboard, go to your application
2. Navigate to the "Environment Variables" section
3. Add each of the variables listed above
4. Save the changes
5. Redeploy your application

## Troubleshooting

If you see the error "Service role key not configured" when accessing the admin panel:

1. Make sure you've set the `SUPABASE_SERVICE_ROLE_KEY` environment variable in Coolify
2. Verify that the key is correct (it should start with "eyJh...")
3. Redeploy your application after updating the environment variables

## Security Considerations

The service role key has full access to your database, bypassing Row Level Security (RLS) policies. Keep it secure:

- Never expose it in client-side code
- Only use it in server-side API routes
- Ensure it's properly set as an environment variable

## Additional Configuration

### Persistent Storage

If you need to store uploaded images, configure a volume in Coolify:

1. Go to your application settings in Coolify
2. Navigate to the "Volumes" section
3. Add a volume mapping:
   - Container path: `/app/public/uploads`
   - Host path: Choose a path on your server or use a named volume

### Custom Domain

To set up a custom domain:

1. Go to your application settings in Coolify
2. Navigate to the "Domains" section
3. Add your domain (e.g., phishsimulator.com)
4. Configure the DNS records as instructed by Coolify
5. Enable HTTPS if needed
