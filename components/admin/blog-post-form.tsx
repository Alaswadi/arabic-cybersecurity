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
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor"
import Link from "next/link"
import { adminTheme } from "@/lib/admin-theme"

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
        // Update existing post using the API route
        const response = await fetch('/api/admin/blog-posts', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: post.id,
            title,
            slug,
            content,
            excerpt,
            featured_image: featuredImage,
            published,
            published_at: published ? post?.published_at || new Date().toISOString() : null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "حدث خطأ أثناء تحديث المقال");
        }

        console.log("Blog post updated successfully:", data);

        toast({
          title: "تم التحديث",
          description: "تم تحديث المقال بنجاح",
        });
      } else {
        // Create new post using the API route
        console.log("Creating new blog post with data:", {
          title,
          slug,
          content,
          excerpt,
          featured_image: featuredImage,
          published,
        });

        const response = await fetch('/api/admin/blog-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            slug,
            content,
            excerpt,
            featured_image: featuredImage,
            published,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "حدث خطأ أثناء إضافة المقال");
        }

        console.log("Blog post created successfully:", data);

        toast({
          title: "تمت الإضافة",
          description: "تم إضافة المقال بنجاح",
        });
      }

      // Force a server refresh before redirecting
      await fetch('/api/revalidate?path=/admin/blog', { method: 'POST' });

      // Add a small delay before redirecting to ensure revalidation completes
      setTimeout(() => {
        router.push("/admin/blog");
        router.refresh();
      }, 500);
    } catch (err: any) {
      console.error("Error saving blog post:", err);
      setError(err.message || "حدث خطأ أثناء حفظ المقال");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={{
      backgroundColor: adminTheme.colors.background.card,
      boxShadow: adminTheme.shadows.sm,
      border: `1px solid ${adminTheme.colors.border.light}`,
      borderRadius: adminTheme.borderRadius.md
    }}>
      <CardContent className="pt-6" style={{ backgroundColor: '#FFFFFF' }}>
        {error && (
          <Alert
            variant="destructive"
            className="mb-6"
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: adminTheme.borderRadius.md
            }}
          >
            <AlertCircle className="h-4 w-4" style={{ color: adminTheme.colors.status.danger }} />
            <AlertDescription style={{ color: '#B91C1C' }}>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" style={{ color: adminTheme.colors.text.primary }}>عنوان المقال</Label>
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
              style={{
                backgroundColor: '#FFFFFF !important',
                borderColor: `${adminTheme.colors.border.main} !important`,
                color: `${adminTheme.colors.text.primary} !important`
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" style={{ color: adminTheme.colors.text.primary }}>الرابط (Slug)</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="flex-1"
                style={{
                  backgroundColor: '#FFFFFF !important',
                  borderColor: `${adminTheme.colors.border.main} !important`,
                  color: `${adminTheme.colors.text.primary} !important`
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateSlug}
                style={{
                  borderColor: adminTheme.colors.border.main,
                  color: adminTheme.colors.text.primary
                }}
              >
                إنشاء تلقائي
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" style={{ color: adminTheme.colors.text.primary }}>مقتطف المقال</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              style={{
                backgroundColor: '#FFFFFF !important',
                borderColor: `${adminTheme.colors.border.main} !important`,
                color: `${adminTheme.colors.text.primary} !important`
              }}
            />
            <p className="text-sm" style={{ color: adminTheme.colors.text.muted }}>ملخص قصير للمقال يظهر في صفحة المقالات (اختياري)</p>
          </div>

          <LocalImageUpload
            value={featuredImage}
            onChange={(url) => {
              console.log("Blog image URL updated:", url);

              // Store the original URL in the form data
              setFeaturedImage(url);

              // Validate the image URL by trying to load it
              if (url) {
                // Try to load through the API route for better reliability
                const apiUrl = url.startsWith('/uploads/')
                  ? `/api/image/${url.replace('/uploads/', '')}`
                  : url;

                const img = document.createElement('img');
                img.onload = () => console.log("Blog image loaded successfully:", apiUrl);
                img.onerror = () => console.error("Failed to load blog image:", apiUrl);
                img.src = apiUrl;
              }
            }}
            label="الصورة الرئيسية"
            folder="blog"
            helpText="الصورة الرئيسية للمقال (اختياري)"
          />

          <WysiwygEditor
            id="content"
            label="محتوى المقال"
            value={content}
            onChange={setContent}
            required={true}
            placeholder="اكتب محتوى المقال هنا..."
            dir="rtl"
          />

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
              style={{
                backgroundColor: published ? adminTheme.colors.primary.main : undefined
              }}
            />
            <Label htmlFor="published" style={{ color: adminTheme.colors.text.primary }}>نشر المقال</Label>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/admin/blog">
              <Button
                type="button"
                variant="outline"
                style={{
                  borderColor: adminTheme.colors.border.main,
                  color: adminTheme.colors.text.primary
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                رجوع
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: adminTheme.colors.primary.main,
                color: 'white'
              }}
            >
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
