"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LocalImageUpload } from "@/components/ui/local-image-upload"
import Link from "next/link"

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [content, setContent] = useState(post?.content || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "")
  const [published, setPublished] = useState(post?.published || false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()
  const { toast } = useToast()

  const generateSlug = () => {
    const slugified = title
      .toLowerCase()
      .replace(/[^\u0621-\u064A\u0660-\u0669a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    setSlug(slugified)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isEditing) {
        // Update existing post
        const { error } = await supabase
          .from("blog_posts")
          .update({
            title,
            slug,
            content,
            excerpt,
            featured_image: featuredImage,
            published,
            published_at: published ? post?.published_at || new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id)

        if (error) throw error

        toast({
          title: "تم التحديث",
          description: "تم تحديث المقال بنجاح",
        })
      } else {
        // Create new post
        const { error } = await supabase.from("blog_posts").insert({
          title,
          slug,
          content,
          excerpt,
          featured_image: featuredImage,
          published,
          published_at: published ? new Date().toISOString() : null,
        })

        if (error) throw error

        toast({
          title: "تمت الإضافة",
          description: "تم إضافة المقال بنجاح",
        })
      }

      // Force a server refresh before redirecting
      await fetch('/api/revalidate?path=/admin/blog', { method: 'POST' })

      // Add a small delay before redirecting to ensure revalidation completes
      setTimeout(() => {
        router.push("/admin/blog")
        router.refresh()
      }, 500)
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ المقال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان المقال</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if (!isEditing || slug === "") {
                  generateSlug()
                }
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">الرابط (Slug)</Label>
            <div className="flex gap-2">
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="flex-1" />
              <Button type="button" variant="outline" onClick={generateSlug}>
                إنشاء تلقائي
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">مقتطف المقال</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
            <p className="text-sm text-gray-500">ملخص قصير للمقال يظهر في صفحة المقالات (اختياري)</p>
          </div>

          <LocalImageUpload
            value={featuredImage}
            onChange={(url) => {
              console.log("Blog image URL updated:", url);
              setFeaturedImage(url);

              // Validate the image URL by trying to load it
              if (url) {
                const img = new Image();
                img.onload = () => console.log("Blog image loaded successfully:", url);
                img.onerror = () => console.error("Failed to load blog image:", url);
                img.src = url;
              }
            }}
            label="الصورة الرئيسية"
            folder="blog"
            helpText="الصورة الرئيسية للمقال (اختياري)"
          />

          <div className="space-y-2">
            <Label htmlFor="content">محتوى المقال</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={10} />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch id="published" checked={published} onCheckedChange={setPublished} />
            <Label htmlFor="published">نشر المقال</Label>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/admin/blog">
              <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                رجوع
              </Button>
            </Link>

            <Button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "جاري التحديث..."
                  : "جاري الإضافة..."
                : isEditing
                  ? "تحديث المقال"
                  : "إضافة المقال"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
