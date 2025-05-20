import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { sendEmail } from '@/lib/email/sender';
import { isEmailConfigValid } from '@/lib/email/config';

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

    // Check if email configuration is valid
    const configValid = isEmailConfigValid();
    if (!configValid) {
      console.warn('Email configuration is not valid. Please update lib/email/config.ts');
    }

    // Send the email
    const emailResult = await sendEmail({
      name,
      email,
      phone,
      subject,
      message
    });

    // Log the result
    if (emailResult.success) {
      console.log('Email sent successfully');
    } else {
      console.error('Failed to send email:', emailResult.error);
    }

    // Return success response (even if email failed, to provide a good user experience)
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
