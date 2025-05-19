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

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]

export function BlogPostsTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const supabase = createClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!postToDelete) return

    const { error } = await supabase.from("blog_posts").delete().eq("id", postToDelete.id)

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المقال",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "تم الحذف",
      description: "تم حذف المقال بنجاح",
    })

    router.refresh()
    setPostToDelete(null)
  }

  const togglePublishStatus = async (post: BlogPost) => {
    const newStatus = !post.published
    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: newStatus,
        published_at: newStatus ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id)

    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تغيير حالة النشر",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "تم التحديث",
      description: newStatus ? "تم نشر المقال بنجاح" : "تم إلغاء نشر المقال بنجاح",
    })

    router.refresh()
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العنوان</TableHead>
              <TableHead>الرابط</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead className="w-[100px]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  لا توجد مقالات
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="font-mono text-sm">{post.slug}</TableCell>
                  <TableCell>
                    <Badge
                      variant={post.published ? "default" : "outline"}
                      className={post.published ? "bg-green-500" : ""}
                    >
                      {post.published ? "منشور" : "مسودة"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString("ar-SA")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">فتح القائمة</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/blog/${post.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => togglePublishStatus(post)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {post.published ? "إلغاء النشر" : "نشر"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setPostToDelete(post)
                            setIsDeleteDialogOpen(true)
                          }}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المقال؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المقال نهائياً من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
