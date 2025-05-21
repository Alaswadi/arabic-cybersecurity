import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Check authentication - properly await cookies()
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({
      cookies: () => cookieStore
    });
    const { data: { session } } = await supabaseAuth.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the path to revalidate from the query string
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      )
    }

    // Revalidate the path
    revalidatePath(path)

    // Also revalidate the public-facing pages
    if (path === '/admin/blog') {
      revalidatePath('/blog')
    } else if (path === '/admin/services') {
      revalidatePath('/services')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error('Error revalidating path:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate path' },
      { status: 500 }
    )
  }
}
