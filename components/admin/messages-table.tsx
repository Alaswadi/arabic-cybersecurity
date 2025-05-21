"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, MoreHorizontal, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import { adminTheme } from "@/lib/admin-theme"

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"]

interface MessagesTableProps {
  messages: ContactMessage[]
  onRefresh: () => void
}

export function MessagesTable({ messages, onRefresh }: MessagesTableProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleToggleRead = async (message: ContactMessage) => {
    setIsLoading(true)

    // Show immediate feedback toast
    const loadingToastId = toast({
      title: "جاري التحديث...",
      description: message.read ? "جاري تحديد الرسالة كغير مقروءة" : "جاري تحديد الرسالة كمقروءة",
    })

    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: message.id,
          read: !message.read,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: message.read ? "تم تحديد الرسالة كغير مقروءة" : "تم تحديد الرسالة كمقروءة",
          description: "تم تحديث حالة الرسالة بنجاح",
          variant: "success",
        })

        // Refresh the messages list to show the updated status
        onRefresh()
      } else {
        console.error("Error response:", data)
        toast({
          title: "خطأ",
          description: data.error || "حدث خطأ أثناء تحديث حالة الرسالة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling message read status:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!messageToDelete) return

    setIsLoading(true)

    // Show immediate feedback toast
    const loadingToastId = toast({
      title: "جاري الحذف...",
      description: "جاري حذف الرسالة",
    })

    try {
      console.log(`Deleting message with ID: ${messageToDelete.id}`);
      const response = await fetch(`/api/admin/messages?id=${messageToDelete.id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      console.log("Delete response:", data);

      if (response.ok && data.success) {
        toast({
          title: "تم الحذف",
          description: "تم حذف الرسالة بنجاح",
          variant: "success",
        })
        setMessageToDelete(null)
        setIsDeleteDialogOpen(false)

        // Refresh the messages list to remove the deleted message
        onRefresh()
      } else {
        console.error("Error response:", data);
        toast({
          title: "خطأ",
          description: data.error || "حدث خطأ أثناء حذف الرسالة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ar,
      })
    } catch (error) {
      return dateString
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
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
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الاسم</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>البريد الإلكتروني</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الموضوع</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الرسالة</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>التاريخ</TableHead>
              <TableHead style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الحالة</TableHead>
              <TableHead className="w-[100px]" style={{ color: adminTheme.colors.text.primary, fontWeight: adminTheme.typography.fontWeights.medium }}>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} style={{
                  textAlign: 'center',
                  color: adminTheme.colors.text.secondary,
                  padding: adminTheme.spacing.xl
                }}>
                  لا توجد رسائل
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow
                  key={message.id}
                  style={{
                    backgroundColor: message.read ? adminTheme.colors.background.card : adminTheme.colors.primary.lighter,
                    borderBottom: `1px solid ${adminTheme.colors.border.light}`
                  }}
                >
                  <TableCell style={{
                    fontWeight: adminTheme.typography.fontWeights.medium,
                    color: adminTheme.colors.text.primary
                  }}>
                    {message.name}
                  </TableCell>
                  <TableCell style={{ color: adminTheme.colors.text.secondary }}>{message.email}</TableCell>
                  <TableCell style={{ color: adminTheme.colors.text.secondary }}>{message.subject || "-"}</TableCell>
                  <TableCell style={{ color: adminTheme.colors.text.secondary }}>{truncateText(message.message, 50)}</TableCell>
                  <TableCell style={{ color: adminTheme.colors.text.secondary }}>{formatDate(message.created_at)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={message.read ? "outline" : "default"}
                      style={{
                        backgroundColor: message.read ? 'transparent' : adminTheme.colors.primary.main,
                        color: message.read ? adminTheme.colors.text.secondary : 'white',
                        borderColor: message.read ? adminTheme.colors.border.main : 'transparent'
                      }}
                    >
                      {message.read ? "مقروءة" : "غير مقروءة"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLoading}
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
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/messages/${message.id}`)}
                          style={{ color: adminTheme.colors.text.primary }}
                        >
                          <Eye className="mr-2 h-4 w-4" style={{ color: adminTheme.colors.primary.main }} />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleRead(message)}
                          style={{ color: adminTheme.colors.text.primary }}
                        >
                          {message.read ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" style={{ color: adminTheme.colors.primary.main }} />
                              تحديد كغير مقروءة
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" style={{ color: adminTheme.colors.primary.main }} />
                              تحديد كمقروءة
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setMessageToDelete(message)
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
              هل أنت متأكد من حذف هذه الرسالة؟
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: adminTheme.colors.text.secondary }}>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الرسالة نهائياً من قاعدة البيانات.
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
              disabled={isLoading}
              style={{
                backgroundColor: adminTheme.colors.status.danger,
                color: 'white'
              }}
            >
              {isLoading ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
