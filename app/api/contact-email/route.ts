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

    // Log the contact form submission
    console.log('Contact form submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone || 'Not provided');
    console.log('Subject:', subject || 'Not provided');
    console.log('Message:', message);

    // In a real implementation, you would send an email here
    // For now, we'll just log the submission and return a success response

    // Return success response
    return NextResponse.json({
      success: true,
      message: "تم استلام رسالتك بنجاح. سنتواصل معك قريبًا.",
      data: {
        id: 'email-' + Date.now(),
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        created_at: new Date().toISOString(),
      }
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
