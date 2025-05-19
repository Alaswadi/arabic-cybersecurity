import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NavButton } from "@/components/ui/nav-button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/server"
import { StorageImage } from "@/components/ui/storage-image"

export const revalidate = 3600 // Revalidate every hour

// Default blog posts in case Supabase fetch fails
const defaultBlogPosts = [
  {
    title: "كيفية حماية مؤسستك من هجمات التصيد الاحتيالي",
    excerpt: "تعرف على أحدث التقنيات والاستراتيجيات لحماية مؤسستك من هجمات التصيد الاحتيالي المتطورة وكيفية تدريب الموظفين على التعرف على هذه الهجمات وتجنبها.",
    image: "/placeholder-blog-1.jpg",
    date: "15 يونيو 2023",
    author: "أحمد محمد",
    authorImage: "/placeholder-author-1.jpg",
    category: "الأمن السيبراني",
    slug: "protect-from-phishing",
    featured: true,
  },
  {
    title: "أهمية تدريب الموظفين على الأمن السيبراني",
    excerpt: "لماذا يعتبر تدريب الموظفين على الوعي الأمني أحد أهم خطوط الدفاع ضد الهجمات السيبرانية وكيف يمكن تطوير برنامج تدريبي فعال للموظفين.",
    image: "/placeholder-blog-2.jpg",
    date: "3 مايو 2023",
    author: "سارة أحمد",
    authorImage: "/placeholder-author-2.jpg",
    category: "التدريب الأمني",
    slug: "employee-security-training",
    featured: false,
  }
]

export default async function BlogPage() {
  const supabase = createClient()

  // Fetch blog posts from Supabase
  const { data: blogPostsData, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true as any) // Type assertion to avoid TypeScript error
    .order("published_at", { ascending: false })

  // Log any errors for debugging
  if (error) {
    console.error("Error fetching blog posts:", error)
  }

  // Transform Supabase data to match our component needs
  const blogPosts = blogPostsData && blogPostsData.length > 0
    ? blogPostsData.map((post: any) => ({
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
        category: "الأمن السيبراني", // Default category
        slug: post.slug || "blog-post",
        featured: false, // Set the first one as featured later
      }))
    : defaultBlogPosts

  // Set the first post as featured if we have posts
  if (blogPosts.length > 0) {
    blogPosts[0].featured = true
  }

  const categories = [
    "الكل",
    "الأمن السيبراني",
    "التدريب الأمني",
    "التهديدات الناشئة",
    "حماية البيانات",
    "التكنولوجيا المتقدمة",
    "العمل عن بعد",
    "الامتثال التنظيمي",
    "أمن الشبكات",
  ]

  const featuredPost = blogPosts.find(post => post.featured)

  return (
    <div className="flex min-h-screen flex-col bg-white" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            أخبار الأمن السيبراني
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mb-8">
            اطلع على آخر أخبار الشركة والمنتجات، إلى جانب أخبار مجال الأمن السيبراني
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category, index) =>
              index === 0 ? (
                <Link
                  key={index}
                  href={`/blog/category/${category === "الكل" ? "" : category.toLowerCase()}`}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
                >
                  {category}
                </Link>
              ) : (
                <NavButton
                  key={index}
                  href={`/blog/category/${category === "الكل" ? "" : category.toLowerCase()}`}
                >
                  {category}
                </NavButton>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">مقال مميز</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                {featuredPost.image ? (
                  <StorageImage
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">صورة المقال</span>
                  </div>
                )}
              </div>
              <div>
                <div className="mb-4">
                  <span className="inline-block bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-md mb-2">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    <Link href={`/blog/${featuredPost.slug}`} className="hover:text-purple-600 transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-700 mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200"></div>
                      <span className="text-sm text-gray-600">{featuredPost.author} • {featuredPost.date}</span>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center text-purple-600 hover:text-purple-800"
                    >
                      اقرأ المقال كاملاً
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Input
                placeholder="ابحث في المدونة..."
                className="bg-white border-gray-300 text-gray-900 pr-10 py-6"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:border-purple-500 hover-card-effect">
                <div className="relative h-48">
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
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-purple-600 font-medium">{post.category}</span>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 line-clamp-2 text-gray-900">
                    <Link href={`/blog/${post.slug}`} className="hover:text-purple-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-block text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    اقرأ المزيد
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" className="border-[#2f3365] bg-[#1a1c3a] hover:bg-[#242850] text-white px-8 py-2">
              عرض المزيد من المقالات
            </Button>
          </div>

          {/* Categories Section */}
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">تصفح حسب الفئة</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.filter(cat => cat !== "الكل").map((category, index) => (
                <Link
                  key={index}
                  href={`/blog/category/${category.toLowerCase()}`}
                  className="bg-[#1a1c3a] border border-[#2f3365] hover:border-purple-500 rounded-lg p-4 text-center transition-colors shadow-sm hover-card-effect text-white"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">اشترك في النشرة الإخبارية</h2>
          <p className="text-gray-700 mb-6">احصل على آخر المقالات والتحديثات مباشرة إلى بريدك الإلكتروني</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="بريدك الإلكتروني"
              className="bg-white border-gray-300 text-gray-900 flex-grow py-6"
            />
            <Button className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">اشترك الآن</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
