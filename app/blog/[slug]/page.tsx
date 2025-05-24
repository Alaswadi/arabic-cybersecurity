import Link from "next/link"
import { CalendarDays, Clock, ChevronRight, Share2, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/server"
import { StorageImage } from "@/components/ui/storage-image"
import { NewsletterSubscription } from "@/components/newsletter-subscription"

// Make this page dynamic to fetch data from Supabase at request time
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Revalidate on every request

// Define blog post and related posts types
interface BlogPost {
  title: string;
  excerpt?: string;
  content: string;
  image: string;
  date: string;
  author: string;
  authorImage: string;
  category: string;
  slug: string;
  reading_time: number;
}

interface RelatedPost {
  title: string;
  excerpt?: string;
  image: string;
  date: string;
  slug: string;
}

export default async function BlogPostPage(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  // Dummy blog posts data for fallback
  const dummyBlogPosts: BlogPost[] = [
    {
      title: "كيفية حماية مؤسستك من هجمات التصيد الاحتيالي",
      excerpt: "تعرف على أحدث التقنيات والاستراتيجيات لحماية مؤسستك من هجمات التصيد الاحتيالي المتطورة وكيفية تدريب الموظفين على التعرف على هذه الهجمات وتجنبها.",
      content: `
        <p>تعتبر هجمات التصيد الاحتيالي من أكثر التهديدات السيبرانية انتشاراً وخطورة في عالم اليوم. تستهدف هذه الهجمات الموظفين والمستخدمين لخداعهم وجعلهم يكشفون عن معلومات حساسة أو تثبيت برمجيات خبيثة على أنظمتهم.</p>

        <h2>ما هي هجمات التصيد الاحتيالي؟</h2>
        <p>هجمات التصيد الاحتيالي هي محاولات خداع تستخدم رسائل البريد الإلكتروني أو الرسائل النصية أو المكالمات الهاتفية التي تبدو شرعية لسرقة بيانات المستخدم مثل كلمات المرور وأرقام بطاقات الائتمان والمعلومات الشخصية الأخرى.</p>
      `,
      image: "/placeholder-blog-1.jpg",
      date: "15 يونيو 2023",
      author: "أحمد محمد",
      authorImage: "/placeholder-author-1.jpg",
      category: "الأمن السيبراني",
      slug: "protect-from-phishing",
      reading_time: 5,
    },
    {
      title: "أهمية تدريب الموظفين على الأمن السيبراني",
      excerpt: "لماذا يعتبر تدريب الموظفين على الوعي الأمني أحد أهم خطوط الدفاع ضد الهجمات السيبرانية وكيف يمكن تطوير برنامج تدريبي فعال للموظفين.",
      content: `
        <p>يعتبر العنصر البشري أضعف حلقة في سلسلة الأمن السيبراني. لذلك، فإن تدريب الموظفين على الوعي الأمني يعد استثماراً ضرورياً لأي مؤسسة تسعى لحماية بياناتها وأنظمتها من التهديدات السيبرانية.</p>
      `,
      image: "/placeholder-blog-2.jpg",
      date: "3 مايو 2023",
      author: "سارة أحمد",
      authorImage: "/placeholder-author-2.jpg",
      category: "التدريب الأمني",
      slug: "employee-security-training",
      reading_time: 6,
    },
  ];

  let post: BlogPost;
  let relatedPosts: RelatedPost[] = [];

  try {
    const supabase = createClient();

    // Fetch blog post by slug
    const { data: postData, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug as any)
      .eq("published", true as any)
      .single();

    if (error || !postData) {
      console.error("Error fetching blog post:", error);

      // Find the post with the matching slug from dummy data
      const dummyPost = dummyBlogPosts.find(post => post.slug === params.slug);

      // If post not found in dummy data, use the first dummy post
      post = dummyPost || dummyBlogPosts[0];

      // Get related posts from dummy data
      relatedPosts = dummyBlogPosts
        .filter(p => p.slug !== params.slug)
        .map(p => ({
          title: p.title,
          excerpt: p.excerpt,
          image: p.image,
          date: p.date,
          slug: p.slug,
        }))
        .slice(0, 2);
    } else {
      // Format the post data from Supabase
      post = {
        title: (postData as any).title || "عنوان المقال",
        excerpt: (postData as any).excerpt || "",
        content: (postData as any).content || "<p>محتوى المقال غير متوفر</p>",
        image: (postData as any).featured_image || "/placeholder-blog-1.jpg",
        date: (postData as any).published_at
          ? new Date((postData as any).published_at).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : "غير محدد",
        author: "فريق الأمن السيبراني", // Default author
        authorImage: "/placeholder-author-1.jpg",
        category: "الأمن السيبراني", // Default category
        reading_time: Math.ceil(((postData as any).content?.length || 0) / 1000) || 5, // Rough estimate
        slug: (postData as any).slug,
      };

      // Fetch related posts
      const { data: relatedPostsData } = await supabase
        .from("blog_posts")
        .select("title, excerpt, featured_image, published_at, slug")
        .neq("slug", params.slug as any)
        .eq("published", true as any)
        .order("published_at", { ascending: false })
        .limit(2);

      // Format related posts
      if (relatedPostsData && relatedPostsData.length > 0) {
        relatedPosts = relatedPostsData.map((relatedPost: any) => ({
          title: relatedPost.title || "عنوان المقال",
          excerpt: relatedPost.excerpt || "",
          image: relatedPost.featured_image || "/placeholder-blog-1.jpg",
          date: relatedPost.published_at
            ? new Date(relatedPost.published_at).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : "غير محدد",
          slug: relatedPost.slug,
        }));
      }
    }
  } catch (error) {
    console.error("Error in blog post page:", error);

    // Fallback to first dummy post if error occurs
    post = dummyBlogPosts[0];

    // Get related posts from dummy data
    relatedPosts = dummyBlogPosts
      .filter(p => p.slug !== post.slug)
      .map(p => ({
        title: p.title,
        excerpt: p.excerpt,
        image: p.image,
        date: p.date,
        slug: p.slug,
      }))
      .slice(0, 2);
  }

  // Categories for sidebar
  const categories = [
    "الأمن السيبراني",
    "التدريب الأمني",
    "التهديدات الناشئة",
    "حماية البيانات",
    "التكنولوجيا المتقدمة",
    "العمل عن بعد",
    "الامتثال التنظيمي",
    "أمن الشبكات",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 flex items-center">
                <ChevronRight className="h-4 w-4 ml-1" />
                العودة إلى المدونة
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-gray-600 text-sm gap-6">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 ml-1" />
                <span>{post.date}</span>
              </div>
              {post.reading_time && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 ml-1" />
                  <span>{post.reading_time} دقائق للقراءة</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="text-purple-600">{post.category}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <div className="relative h-64 md:h-96 w-full">
                  {post.image ? (
                    <StorageImage
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">صورة المقال</span>
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8">
                  {post.excerpt && <p className="text-xl text-gray-700 mb-8 font-medium">{post.excerpt}</p>}

                  <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />

                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{post.author}</div>
                          <div className="text-sm text-gray-600">{post.category}</div>
                        </div>
                      </div>
                      <button className="flex items-center text-purple-600 hover:text-purple-800">
                        <Share2 className="h-4 w-4 ml-1" />
                        مشاركة
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {relatedPosts && relatedPosts.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">مقالات ذات صلة</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost, index) => (
                      <Link
                        key={index}
                        href={`/blog/${relatedPost.slug}`}
                        className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:border-purple-500 hover-card-effect"
                      >
                        <div className="relative h-48">
                          {relatedPost.image ? (
                            <StorageImage
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-2xl">صورة المقال</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{relatedPost.title}</h3>
                          <div className="text-sm text-gray-600 mb-2">{relatedPost.date}</div>
                          <p className="text-gray-700 line-clamp-2">{relatedPost.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">البحث</h3>
                <div className="relative">
                  <Input
                    placeholder="ابحث في المدونة..."
                    className="bg-white border-gray-300 text-gray-900 pr-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">التصنيفات</h3>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link
                        href={`/blog/category/${category.toLowerCase()}`}
                        className="text-gray-700 hover:text-purple-600 transition-colors"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">اشترك في النشرة الإخبارية</h3>
                <p className="text-gray-700 mb-4">احصل على آخر المقالات والتحديثات مباشرة إلى بريدك الإلكتروني</p>
                <NewsletterSubscription variant="blog-sidebar" />
              </div>
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  )
}
