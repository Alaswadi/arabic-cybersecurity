import { NextRequest, NextResponse } from "next/server";
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
    
    // Use direct SQL query to insert the message (bypassing RLS)
    // This requires the SUPABASE_SERVICE_ROLE_KEY environment variable to be set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase URL or service role key');
      return NextResponse.json(
        { 
          success: false, 
          message: "خطأ في تكوين الخادم. يرجى الاتصال بمسؤول النظام." 
        },
        { status: 500 }
      );
    }
    
    // Make a direct fetch request to Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        read: false,
        created_at: new Date().toISOString(),
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error inserting contact message:', errorData);
      return NextResponse.json(
        { 
          success: false, 
          message: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
          details: errorData
        },
        { status: 500 }
      );
    }
    
    const data = await response.json();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.",
      data: data[0],
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
