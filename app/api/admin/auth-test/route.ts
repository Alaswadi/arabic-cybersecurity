import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/auth-test - Start");
    
    // Get all cookies for debugging
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    console.log("All cookies:", allCookies.map(c => `${c.name}: ${c.value.substring(0, 10)}...`));
    
    // Create a Supabase client with the cookie store
    const supabaseAuth = createServerComponentClient({ 
      cookies: () => cookieStore 
    });
    
    // Get the session
    const { data: { session }, error } = await supabaseAuth.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      return NextResponse.json({
        authenticated: false,
        error: error.message,
        cookies: allCookies.length,
      });
    }
    
    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");
    
    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: "No session found",
        cookies: allCookies.length,
      });
    }
    
    // Return user info
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      },
      cookies: allCookies.length,
    });
  } catch (error: any) {
    console.error("Unexpected error in auth test:", error);
    return NextResponse.json({
      authenticated: false,
      error: error.message || "Unexpected error",
    }, { status: 500 });
  }
}
