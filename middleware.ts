import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next()

  // Create the Supabase client
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Get the session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Get the current path
    const path = req.nextUrl.pathname

    // Define auth routes
    const isAuthRoute = path === "/admin/login" || path === "/admin/register"

    // Define admin routes (excluding auth routes)
    const isAdminRoute = path.startsWith("/admin") && !isAuthRoute

    // If trying to access admin routes without a session, redirect to login
    if (isAdminRoute && !session) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // If trying to access auth routes with a session, redirect to admin dashboard
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // For all other cases, continue
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error, allow the request to continue
    // The page's server component will handle authentication if needed
    return res
  }
}

// Only run middleware on admin routes
export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
