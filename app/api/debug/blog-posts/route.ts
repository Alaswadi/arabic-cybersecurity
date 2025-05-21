import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createAdminClient } from '@/lib/supabase/admin';

// GET: Fetch all blog posts for debugging
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/debug/blog-posts - Start");

    // Check authentication
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ 
      cookies: () => cookieStore 
    });
    
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create a service role client to bypass RLS
    let serviceRoleClient;
    try {
      serviceRoleClient = createAdminClient();
      console.log("Successfully created service role client");
    } catch (error) {
      console.error("Error creating service role client:", error);
      
      // Fallback to regular client
      serviceRoleClient = createClient();
      console.log("Falling back to regular client");
    }

    // Fetch all blog posts
    const { data: posts, error } = await serviceRoleClient
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Check RLS policies
    const { data: policies, error: policiesError } = await serviceRoleClient.rpc('get_policies');
    
    if (policiesError) {
      console.error("Error fetching policies:", policiesError);
    }

    // Filter policies for blog_posts table
    const blogPostsPolicies = policies?.filter(p => p.tablename === 'blog_posts') || [];

    return NextResponse.json({
      success: true,
      count: posts?.length || 0,
      posts,
      policies: blogPostsPolicies
    });
  } catch (error) {
    console.error("Error in debug blog posts route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Test inserting a blog post
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/debug/blog-posts - Start");

    // Check authentication
    const cookieStore = cookies();
    const supabaseAuth = createServerComponentClient({ 
      cookies: () => cookieStore 
    });
    
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    console.log("Authentication check:", session ? "Authenticated" : "Not authenticated");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create a service role client to bypass RLS
    let serviceRoleClient;
    try {
      serviceRoleClient = createAdminClient();
      console.log("Successfully created service role client");
    } catch (error) {
      console.error("Error creating service role client:", error);
      
      // Fallback to regular client
      serviceRoleClient = createClient();
      console.log("Falling back to regular client");
    }

    // Create a test blog post
    const testPost = {
      title: "Test Blog Post " + new Date().toISOString(),
      slug: "test-blog-post-" + Date.now(),
      content: "This is a test blog post created via the debug API.",
      excerpt: "Test excerpt",
      featured_image: null,
      published: false,
    };

    // Insert the test post
    const { data: newPost, error } = await serviceRoleClient
      .from("blog_posts")
      .insert(testPost)
      .select()
      .single();

    if (error) {
      console.error("Error inserting test blog post:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test blog post created successfully",
      post: newPost
    });
  } catch (error) {
    console.error("Error in debug blog posts route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
