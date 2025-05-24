import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { CalendarDays, Tag } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { NewsletterSubscription } from "@/components/newsletter-subscription"

export async function BlogSidebar() {
  const supabase = createClient()

  // Fetch recent posts
  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(5)

  // In a real app, you would have a tags table and fetch them
  const tags = [
    "الأمن السيبراني",
    "التصيد الاحتيالي",
    "حماية البيانات",
    "الهندسة الاجتماعية",
    "أمن الشبكات",
    "الوعي الأمني",
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">أحدث المقالات</h3>
        {recentPosts && recentPosts.length > 0 ? (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                <h4 className="font-medium group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h4>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <CalendarDays className="h-3 w-3 ml-1" />
                  {formatDate(post.published_at)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">لا توجد مقالات حديثة</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">التصنيفات</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?search=${encodeURIComponent(tag)}`}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors flex items-center"
            >
              <Tag className="h-3 w-3 ml-1" />
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <NewsletterSubscription variant="sidebar" />
    </div>
  )
}
