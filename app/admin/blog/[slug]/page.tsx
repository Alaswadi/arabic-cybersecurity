import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { BlogPostForm } from "@/components/admin/blog-post-form"

// Simple UUID validation regex
const isValidUUID = (uuid: string) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return regex.test(uuid)
}

export default async function EditBlogPostPage(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  // If the slug is "new", redirect to the dedicated new page
  if (params.slug === "new") {
    redirect("/admin/blog/new")
  }

  // Validate UUID format
  if (!isValidUUID(params.slug)) {
    notFound()
  }

  const supabase = createClient()

  try {
    const { data: post, error } = await supabase.from("blog_posts").select("*").eq("id", params.slug).single()

    if (error || !post) {
      console.error("Error fetching blog post:", error)
      notFound()
    }

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">تعديل المقال</h1>
        <BlogPostForm post={post} />
      </div>
    )
  } catch (error) {
    console.error("Error in EditBlogPostPage:", error)
    notFound()
  }
}
