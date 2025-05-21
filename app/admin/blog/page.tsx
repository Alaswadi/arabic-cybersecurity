import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { BlogPostsTable } from "@/components/admin/blog-posts-table"
import { adminTheme } from "@/lib/admin-theme"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Revalidate on every request

export default async function BlogPostsPage() {
  const supabase = createClient()

  // Fetch blog posts with cache-busting query parameter
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .throwOnError() // This will throw an error if the query fails

  return (
    <div>
      <div className="flex items-center justify-between mb-6" style={{
        padding: adminTheme.spacing.lg,
        backgroundColor: adminTheme.colors.background.card,
        borderRadius: adminTheme.borderRadius.lg,
        boxShadow: adminTheme.shadows.sm,
        border: `1px solid ${adminTheme.colors.border.light}`
      }}>
        <h1 className="text-3xl font-bold" style={{ color: adminTheme.colors.primary.main }}>
          إدارة المقالات
        </h1>
        <Link href="/admin/blog/new">
          <Button style={{
            backgroundColor: adminTheme.colors.primary.main,
            color: 'white'
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة مقال جديد
          </Button>
        </Link>
      </div>

      <BlogPostsTable posts={posts || []} />
    </div>
  )
}
