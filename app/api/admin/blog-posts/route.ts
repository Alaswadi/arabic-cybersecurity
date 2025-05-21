import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createAdminClient } from '@/lib/supabase/admin';

// GET: Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/blog-posts - Start");

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

    return NextResponse.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error("Error in blog posts route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new blog post
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/admin/blog-posts - Start");

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

    // Parse the request body
    const blogPost = await request.json();
    console.log("Blog post data:", blogPost);

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

    // Insert the blog post
    const { data: newPost, error } = await serviceRoleClient
      .from("blog_posts")
      .insert({
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        excerpt: blogPost.excerpt || null,
        featured_image: blogPost.featured_image || null,
        published: blogPost.published || false,
        published_at: blogPost.published ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting blog post:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post created successfully",
      post: newPost
    });
  } catch (error) {
    console.error("Error in blog posts route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Update a blog post
export async function PATCH(request: NextRequest) {
  try {
    console.log("PATCH /api/admin/blog-posts - Start");

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

    // Parse the request body
    const blogPost = await request.json();
    console.log("Blog post update data:", blogPost);

    if (!blogPost.id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
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

    // Update the blog post
    const { data: updatedPost, error } = await serviceRoleClient
      .from("blog_posts")
      .update({
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        excerpt: blogPost.excerpt || null,
        featured_image: blogPost.featured_image || null,
        published: blogPost.published || false,
        published_at: blogPost.published ? blogPost.published_at || new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", blogPost.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating blog post:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post updated successfully",
      post: updatedPost
    });
  } catch (error) {
    console.error("Error in blog posts route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a blog post by ID
export async function DELETE(request: NextRequest) {
  try {
    console.log("DELETE /api/admin/blog-posts - Start");

    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    console.log("Deleting blog post with ID:", id);

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

    // Delete the blog post
    const { error } = await serviceRoleClient
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting blog post:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully"
    });
  } catch (error) {
    console.error("Error in blog posts route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
