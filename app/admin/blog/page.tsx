import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { BlogPostsTable } from "@/components/admin/blog-posts-table"

export default async function BlogPostsPage() {
  const supabase = createClient()

  const { data: posts, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">إدارة المقالات</h1>
        <Link href="/admin/blog/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة مقال جديد
          </Button>
        </Link>
      </div>

      <BlogPostsTable posts={posts || []} />
    </div>
  )
}
