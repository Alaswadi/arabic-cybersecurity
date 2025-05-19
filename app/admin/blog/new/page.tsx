import { BlogPostForm } from "@/components/admin/blog-post-form"

// Set dynamic to force-dynamic to prevent static generation
export const dynamic = 'force-dynamic'

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إضافة مقال جديد</h1>
      <BlogPostForm />
    </div>
  )
}
