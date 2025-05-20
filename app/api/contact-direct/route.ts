import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

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

    // Create a direct Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Log environment variables for debugging (don't include full key in production)
    console.log('Environment variables check:');
    console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Fallback to hardcoded URL if environment variable is missing
    const finalSupabaseUrl = supabaseUrl || 'https://xahxjhzngahtcuekbpnj.supabase.co';

    if (!supabaseServiceKey) {
      console.error('Missing Supabase service role key');
      return NextResponse.json(
        {
          success: false,
          message: "خطأ في تكوين الخادم: مفتاح الخدمة غير متوفر. يرجى الاتصال بمسؤول النظام."
        },
        { status: 500 }
      );
    }

    // Create a Supabase client with service role key
    const supabase = createClient(finalSupabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Insert the contact message directly using the service role client
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          subject: subject || null,
          message,
          read: false,
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting contact message:', error);
      return NextResponse.json(
        {
          success: false,
          message: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
          details: error
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.",
      data: data?.[0] || null,
    });

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
