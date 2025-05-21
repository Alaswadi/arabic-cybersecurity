"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { adminTheme } from "@/lib/admin-theme"

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]

export function BlogPostsTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const supabase = createClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      console.log("Deleting blog post with ID:", postToDelete.id);

      // Use the API route to delete the blog post
      const response = await fetch(`/api/admin/blog-posts/${postToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log("Delete response:", data);

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء حذف المقال");
      }

      toast({
        title: "تم الحذف",
        description: "تم حذف المقال بنجاح",
      });

      // Force a server refresh
      await fetch('/api/revalidate?path=/admin/blog', { method: 'POST' });

      // Add a small delay before refreshing
      setTimeout(() => {
        router.refresh();
        setPostToDelete(null);
      }, 500);
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف المقال",
        variant: "destructive",
      });
    }
  }

  const togglePublishStatus = async (post: BlogPost) => {
    const newStatus = !post.published

    try {
      // Use the API route to update the blog post
      const response = await fetch('/api/admin/blog-posts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: post.id,
          published: newStatus,
          published_at: newStatus ? new Date().toISOString() : null,
          // Include other required fields to avoid overwriting them with null
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          featured_image: post.featured_image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء تغيير حالة النشر");
      }

      toast({
        title: "تم التحديث",
        description: newStatus ? "تم نشر المقال بنجاح" : "تم إلغاء نشر المقال بنجاح",
      });

      router.refresh();
    } catch (error: any) {
      console.error("Error updating blog post publish status:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تغيير حالة النشر",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <div style={{
        borderRadius: adminTheme.borderRadius.md,
        border: `1px solid ${adminTheme.colors.border.light}`,
        overflow: 'hidden',
        boxShadow: adminTheme.shadows.sm
      }}>
        <Table>
          <TableHeader style={{ backgroundColor: adminTheme.colors.background.sidebar }}>
            <TableRow>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>العنوان</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الرابط</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الحالة</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>تاريخ الإنشاء</TableHead>
              <TableHead className="w-[100px]" style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{
                  textAlign: 'center',
                  color: adminTheme.colors.text.secondary,
                  padding: adminTheme.spacing.xl
                }}>
                  لا توجد مقالات
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} style={{
                  backgroundColor: adminTheme.colors.background.card,
                  borderBottom: `1px solid ${adminTheme.colors.border.light}`
                }}>
                  <TableCell style={{
                    fontWeight: adminTheme.typography.fontWeights.medium,
                    color: adminTheme.colors.text.primary
                  }}>
                    {post.title}
                  </TableCell>
                  <TableCell className="font-mono text-sm" style={{ color: adminTheme.colors.text.secondary }}>{post.slug}</TableCell>
                  <TableCell>
                    <Badge
                      variant={post.published ? "default" : "outline"}
                      style={{
                        backgroundColor: post.published ? adminTheme.colors.status.success : 'transparent',
                        color: post.published ? 'white' : adminTheme.colors.text.secondary,
                        borderColor: post.published ? 'transparent' : adminTheme.colors.border.main
                      }}
                    >
                      {post.published ? "منشور" : "مسودة"}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ color: adminTheme.colors.text.secondary }}>
                    {new Date(post.created_at).toLocaleDateString("ar-SA")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          style={{ color: adminTheme.colors.text.secondary }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">فتح القائمة</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        style={{
                          backgroundColor: adminTheme.colors.background.card,
                          border: `1px solid ${adminTheme.colors.border.light}`,
                          boxShadow: adminTheme.shadows.md
                        }}
                      >
                        <Link href={`/admin/blog/${post.id}`}>
                          <DropdownMenuItem style={{ color: adminTheme.colors.text.primary }}>
                            <Edit className="mr-2 h-4 w-4" style={{ color: adminTheme.colors.primary.main }} />
                            تعديل
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => togglePublishStatus(post)}
                          style={{ color: adminTheme.colors.text.primary }}
                        >
                          <Eye className="mr-2 h-4 w-4" style={{ color: adminTheme.colors.primary.main }} />
                          {post.published ? "إلغاء النشر" : "نشر"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPostToDelete(post)
                            setIsDeleteDialogOpen(true)
                          }}
                          style={{ color: adminTheme.colors.status.danger }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent style={{
          backgroundColor: adminTheme.colors.background.card,
          border: `1px solid ${adminTheme.colors.border.light}`,
          boxShadow: adminTheme.shadows.lg,
          borderRadius: adminTheme.borderRadius.lg
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: adminTheme.colors.text.primary }}>
              هل أنت متأكد من حذف هذا المقال؟
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: adminTheme.colors.text.secondary }}>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المقال نهائياً من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{
              borderColor: adminTheme.colors.border.main,
              color: adminTheme.colors.text.primary
            }}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              style={{
                backgroundColor: adminTheme.colors.status.danger,
                color: 'white'
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
