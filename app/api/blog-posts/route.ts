import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch published blog posts for public display
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/blog-posts - Start");

    // Get URL parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "3");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    
    // Create a Supabase client
    const supabase = createClient();
    
    // Fetch published blog posts with pagination
    const { data: posts, error, count } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact" })
      .eq("published", true)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Format the posts for the frontend
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + "..." : ""),
      image: post.featured_image || "/placeholder-blog-1.jpg",
      date: post.published_at 
        ? new Date(post.published_at).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) 
        : "غير محدد",
      author: "فريق الأمن السيبراني", // Default author
      authorImage: "/placeholder-author-1.jpg",
      category: post.category || "الأمن السيبراني", // Default category
      slug: post.slug,
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      total: count || formattedPosts.length,
      hasMore: count ? offset + limit < count : false
    });
  } catch (error) {
    console.error("Error in blog posts route:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
