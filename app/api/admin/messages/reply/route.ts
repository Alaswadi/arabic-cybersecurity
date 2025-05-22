import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendEmail, createReplyEmailTemplate } from '@/lib/email/service';

// Define validation schema for reply form
const replyFormSchema = z.object({
  messageId: z.string().uuid({ message: "معرف الرسالة غير صالح" }),
  replyContent: z.string().min(10, { message: "الرد يجب أن يحتوي على 10 أحرف على الأقل" }),
});

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/admin/messages/reply - Start");

    // Properly await cookies() to fix the warning
    const cookieStore = cookies();

    // Create a Supabase client with the cookie store
    const supabaseAuth = createServerComponentClient({
      cookies: () => cookieStore
    });

    // Check if the user is authenticated
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    if (!session) {
      console.error('User not authenticated');
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    console.log(`User authenticated: ${session.user.email}`);

    // Parse the request body
    const body = await request.json();

    // Validate the form data
    const validationResult = replyFormSchema.safeParse(body);

    if (!validationResult.success) {
      // Return validation errors
      console.error('Validation errors:', validationResult.error.format());
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    // Get validated data
    const { messageId, replyContent } = validationResult.data;

    // Create a service role client to bypass RLS
    let serviceRoleClient;

    try {
      // Import the admin client creator
      const { createAdminClient } = await import('@/lib/supabase/admin');

      // Create the admin client
      serviceRoleClient = createAdminClient();
      console.log("Successfully created service role client using admin utility");
    } catch (error) {
      console.error('Error creating service role client with admin utility:', error);

      // Fallback to direct creation
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

      if (!supabaseServiceKey) {
        console.error('Service role key not configured');
        return NextResponse.json(
          { error: 'Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables.' },
          { status: 500 }
        );
      }

      serviceRoleClient = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      console.log("Created service role client directly");
    }

    // Fetch the message to get recipient details
    console.log(`Fetching message with ID: ${messageId}`);
    const { data: message, error: messageError } = await serviceRoleClient
      .from('contact_messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (messageError || !message) {
      console.error('Error fetching message:', messageError);
      return NextResponse.json(
        { error: messageError?.message || 'Message not found' },
        { status: 404 }
      );
    }

    console.log(`Found message from ${message.name} (${message.email})`);

    // Send the email reply
    const emailResult = await sendEmail({
      to: message.email,
      subject: `رد على رسالتك: ${message.subject || 'استفسار'}`,
      text: replyContent,
      html: createReplyEmailTemplate(replyContent, message.name),
      replyTo: process.env.ZOHO_EMAIL,
    });

    if (!emailResult.success) {
      console.error('Error sending email:', emailResult.message);
      return NextResponse.json(
        { error: `Failed to send email: ${emailResult.message}` },
        { status: 500 }
      );
    }

    console.log('Email sent successfully');

    // Update the message in the database to mark as replied
    const now = new Date().toISOString();
    const { data: updatedMessage, error: updateError } = await serviceRoleClient
      .from('contact_messages')
      .update({
        replied: true,
        reply_content: replyContent,
        replied_at: now,
        read: true, // Also mark as read
      })
      .eq('id', messageId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating message:', updateError);
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email sent successfully, but failed to update database record.',
          error: updateError.message
        },
        { status: 200 }
      );
    }

    console.log('Message updated successfully');

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'تم إرسال الرد بنجاح',
      data: updatedMessage
    });

  } catch (error: any) {
    console.error('Unexpected error sending reply:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send reply' },
      { status: 500 }
    );
  }
}
