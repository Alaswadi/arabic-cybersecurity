import { BlogPostForm } from "@/components/admin/blog-post-form"
import { adminTheme } from "@/lib/admin-theme"

// Set dynamic to force-dynamic to prevent static generation
export const dynamic = 'force-dynamic'

export default function NewBlogPostPage() {
  return (
    <div>
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: adminTheme.colors.primary.main }}
      >
        إضافة مقال جديد
      </h1>
      <BlogPostForm />
    </div>
  )
}
