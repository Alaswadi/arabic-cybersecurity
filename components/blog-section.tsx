import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { BlogPostsList, BlogPost } from "@/components/blog/blog-posts-list"

// Default blog posts in case Supabase fetch fails
const defaultBlogPosts: BlogPost[] = [
  {
    title: "كيفية حماية مؤسستك من هجمات التصيد الاحتيالي",
    excerpt: "تعرف على أحدث التقنيات والاستراتيجيات لحماية مؤسستك من هجمات التصيد الاحتيالي المتطورة",
    image: "/placeholder-blog-1.jpg",
    date: "15 يونيو 2023",
    author: "أحمد محمد",
    authorImage: "/placeholder-author-1.jpg",
    slug: "protect-from-phishing",
    category: "الأمن السيبراني",
  },
  {
    title: "أهمية تدريب الموظفين على الأمن السيبراني",
    excerpt: "لماذا يعتبر تدريب الموظفين على الوعي الأمني أحد أهم خطوط الدفاع ضد الهجمات السيبرانية",
    image: "/placeholder-blog-2.jpg",
    date: "3 مايو 2023",
    author: "سارة أحمد",
    authorImage: "/placeholder-author-2.jpg",
    slug: "employee-security-training",
    category: "التدريب الأمني",
  },
  {
    title: "التهديدات السيبرانية الناشئة في 2023",
    excerpt: "استعراض لأبرز التهديدات السيبرانية الناشئة هذا العام وكيفية الاستعداد لها",
    image: "/placeholder-blog-3.jpg",
    date: "20 أبريل 2023",
    author: "محمد علي",
    authorImage: "/placeholder-author-3.jpg",
    slug: "emerging-cyber-threats-2023",
    category: "التهديدات الناشئة",
  },
]

export async function BlogSection() {
  // Initialize with default blog posts
  let blogPosts = defaultBlogPosts;
  let hasMore = false;

  try {
    // Use fetch with cache: 'no-store' to ensure fresh data
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                   (typeof process !== 'undefined' && process.env.VERCEL_URL ?
                    `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const response = await fetch(`${baseUrl}/api/blog-posts?limit=3&offset=0`, {
      cache: 'no-store',
      next: { revalidate: 30 } // Revalidate every 30 seconds
    });

    if (response.ok) {
      const data = await response.json();

      if (data.success && data.posts && data.posts.length > 0) {
        blogPosts = data.posts;
        hasMore = data.hasMore;
      }
    } else {
      // If API fails, fallback to direct Supabase query
      const supabase = createClient();

      // Fetch blog posts from Supabase with cache-busting options
      const { data: blogPostsData, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true as any)
        .order("published_at", { ascending: false })
        .limit(3);

      // Log any errors for debugging
      if (error) {
        console.error("Error fetching blog posts for homepage:", error);
      } else if (blogPostsData && blogPostsData.length > 0) {
        // Transform Supabase data to match our component needs
        blogPosts = blogPostsData.map((post: any) => ({
          title: post.title || "عنوان المقال",
          excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + "..." : ""),
          image: post.featured_image || "/placeholder-blog-1.jpg",
          date: post.published_at ? new Date(post.published_at).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : "غير محدد",
          author: "فريق الأمن السيبراني", // Default author
          authorImage: "/placeholder-author-1.jpg",
          slug: post.slug || "blog-post",
          category: post.category || "الأمن السيبراني",
        }));

        // Check if there are more posts
        const { count } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true })
          .eq("published", true as any);

        hasMore = count ? count > 3 : false;
      }
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Unexpected error fetching blog posts for homepage:", error);
    // Use default blog posts in case of error
  }

  return (
    <section className="py-20 bg-[#1a1c3a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">آخر المقالات</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            اطلع على أحدث المقالات والأخبار في مجال الأمن السيبراني والتهديدات الناشئة وأفضل الممارسات
          </p>
        </div>

        {/* Dynamic Blog Posts List */}
        <BlogPostsList
          initialPosts={blogPosts}
          initialHasMore={hasMore}
          darkMode={true}
        />

        <div className="text-center mt-12">
          <Button asChild className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">
            <Link href="/blog">جميع المقالات <ArrowLeft className="mr-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
