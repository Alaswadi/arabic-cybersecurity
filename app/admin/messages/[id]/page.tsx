"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Mail, Phone, Reply, Send, Trash, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
import { adminTheme } from "@/lib/admin-theme"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Database } from "@/lib/database.types"

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"]

export default function MessageDetailPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchMessage = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/messages?id=${params.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch message")
      }

      const data = await response.json()

      if (data.messages && data.messages.length > 0) {
        setMessage(data.messages[0])
      } else {
        setError("الرسالة غير موجودة")
      }
    } catch (error) {
      console.error("Error fetching message:", error)
      setError("حدث خطأ أثناء جلب الرسالة. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessage()

    // Mark as read when viewing details
    if (params.id) {
      markAsRead()
    }
  }, [params.id])

  const markAsRead = async () => {
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.id,
          read: true,
        }),
      })
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const handleToggleRead = async () => {
    if (!message) return

    setIsActionLoading(true)
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
        })
        setMessage(data.message)
      } else {
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
      setIsActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!message) return

    setIsActionLoading(true)
    try {
      const response = await fetch(`/api/admin/messages?id=${message.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "تم الحذف",
          description: "تم حذف الرسالة بنجاح",
        })
        setIsDeleteDialogOpen(false)
        router.push("/admin/messages")
      } else {
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
      setIsActionLoading(false)
    }
  }

  const handleSendReply = async () => {
    if (!message) return
    if (!replyContent.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال محتوى الرد",
        variant: "destructive",
      })
      return
    }

    setIsReplying(true)
    try {
      const response = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: message.id,
          replyContent: replyContent,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "تم الإرسال",
          description: "تم إرسال الرد بنجاح",
        })
        setReplyContent("")
        setShowReplyForm(false)
        // Update the message with the reply data
        if (data.data) {
          setMessage(data.data)
        } else {
          // Refresh the message data
          fetchMessage()
        }
      } else {
        toast({
          title: "خطأ",
          description: data.error || "حدث خطأ أثناء إرسال الرد",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsReplying(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return {
        relative: formatDistanceToNow(date, { addSuffix: true, locale: ar }),
        full: date.toLocaleDateString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
    } catch (error) {
      return {
        relative: dateString,
        full: dateString,
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/admin/messages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            العودة إلى قائمة الرسائل
          </Link>
        </Button>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>الرسالة غير موجودة</AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/admin/messages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            العودة إلى قائمة الرسائل
          </Link>
        </Button>
      </div>
    )
  }

  const formattedDate = formatDate(message.created_at)

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
          تفاصيل الرسالة
        </h1>
        <Button
          asChild
          variant="outline"
          style={{
            borderColor: adminTheme.colors.primary.lighter,
            color: adminTheme.colors.primary.main,
            backgroundColor: 'transparent'
          }}
        >
          <Link href="/admin/messages">
            <ArrowLeft className="mr-2 h-5 w-5" />
            العودة إلى قائمة الرسائل
          </Link>
        </Button>
      </div>

      <Card style={{
        backgroundColor: adminTheme.colors.background.card,
        boxShadow: adminTheme.shadows.sm,
        border: `1px solid ${adminTheme.colors.border.light}`,
        borderRadius: adminTheme.borderRadius.md
      }}>
        <CardHeader style={{
          backgroundColor: adminTheme.colors.background.sidebar,
          borderBottom: `1px solid ${adminTheme.colors.border.light}`
        }}>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl" style={{ color: adminTheme.colors.text.primary }}>
                {message.subject || "رسالة بدون موضوع"}
              </CardTitle>
              <CardDescription style={{ color: adminTheme.colors.text.secondary, marginTop: '0.25rem' }}>
                <span style={{ fontWeight: adminTheme.typography.fontWeights.medium }}>
                  {formattedDate.relative}
                </span> ({formattedDate.full})
              </CardDescription>
            </div>
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
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 rounded-md" style={{
              backgroundColor: adminTheme.colors.background.sidebar,
              border: `1px solid ${adminTheme.colors.border.light}`,
              padding: adminTheme.spacing.md,
              borderRadius: adminTheme.borderRadius.md
            }}>
              <User className="h-6 w-6" style={{ color: adminTheme.colors.primary.main }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: adminTheme.colors.text.secondary }}>الاسم</p>
                <p className="font-medium" style={{ color: adminTheme.colors.text.primary }}>{message.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md" style={{
              backgroundColor: adminTheme.colors.background.sidebar,
              border: `1px solid ${adminTheme.colors.border.light}`,
              padding: adminTheme.spacing.md,
              borderRadius: adminTheme.borderRadius.md
            }}>
              <Mail className="h-6 w-6" style={{ color: adminTheme.colors.primary.main }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: adminTheme.colors.text.secondary }}>البريد الإلكتروني</p>
                <p className="font-medium" style={{ color: adminTheme.colors.text.primary }}>{message.email}</p>
              </div>
            </div>
            {message.phone && (
              <div className="flex items-center gap-3 rounded-md" style={{
                backgroundColor: adminTheme.colors.background.sidebar,
                border: `1px solid ${adminTheme.colors.border.light}`,
                padding: adminTheme.spacing.md,
                borderRadius: adminTheme.borderRadius.md
              }}>
                <Phone className="h-6 w-6" style={{ color: adminTheme.colors.primary.main }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: adminTheme.colors.text.secondary }}>رقم الهاتف</p>
                  <p className="font-medium" style={{ color: adminTheme.colors.text.primary }}>{message.phone}</p>
                </div>
              </div>
            )}
          </div>

          <Separator style={{ backgroundColor: adminTheme.colors.border.light }} />

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <span style={{
                backgroundColor: adminTheme.colors.primary.lighter,
                color: adminTheme.colors.primary.main,
                padding: `${adminTheme.spacing.xs} ${adminTheme.spacing.md}`,
                borderRadius: adminTheme.borderRadius.md,
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <Mail className="h-4 w-4 mr-1" />
                الرسالة
              </span>
            </h3>
            <div style={{
              backgroundColor: adminTheme.colors.background.card,
              padding: adminTheme.spacing.lg,
              borderRadius: adminTheme.borderRadius.md,
              whiteSpace: 'pre-wrap',
              color: adminTheme.colors.text.primary,
              border: `1px solid ${adminTheme.colors.border.light}`,
              minHeight: '150px',
              fontSize: adminTheme.typography.fontSizes.md,
              boxShadow: adminTheme.shadows.sm
            }}>
              {message.message}
            </div>
          </div>
        </CardContent>
        {/* Reply section */}
        {message.replied && (
          <div className="px-6 py-4" style={{
            backgroundColor: adminTheme.colors.background.sidebar,
            borderTop: `1px solid ${adminTheme.colors.border.light}`
          }}>
            <div className="mb-2 flex items-center">
              <Badge
                style={{
                  backgroundColor: adminTheme.colors.status.success,
                  color: 'white'
                }}
              >
                تم الرد
              </Badge>
              {message.replied_at && (
                <span className="mr-2 text-sm" style={{ color: adminTheme.colors.text.secondary }}>
                  {formatDate(message.replied_at).relative}
                </span>
              )}
            </div>
            <div style={{
              backgroundColor: adminTheme.colors.background.card,
              padding: adminTheme.spacing.md,
              borderRadius: adminTheme.borderRadius.md,
              whiteSpace: 'pre-wrap',
              color: adminTheme.colors.text.primary,
              border: `1px solid ${adminTheme.colors.border.light}`,
              fontSize: adminTheme.typography.fontSizes.md,
            }}>
              {message.reply_content}
            </div>
          </div>
        )}

        {/* Reply form */}
        {showReplyForm && !message.replied && (
          <div className="px-6 py-4" style={{
            backgroundColor: adminTheme.colors.background.sidebar,
            borderTop: `1px solid ${adminTheme.colors.border.light}`
          }}>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <span style={{
                backgroundColor: adminTheme.colors.primary.lighter,
                color: adminTheme.colors.primary.main,
                padding: `${adminTheme.spacing.xs} ${adminTheme.spacing.md}`,
                borderRadius: adminTheme.borderRadius.md,
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <Reply className="h-4 w-4 mr-1" />
                الرد على الرسالة
              </span>
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="replyContent">محتوى الرد</Label>
                <Textarea
                  id="replyContent"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  rows={6}
                  style={{
                    backgroundColor: adminTheme.colors.background.card,
                    border: `1px solid ${adminTheme.colors.border.main}`,
                    borderRadius: adminTheme.borderRadius.md,
                    color: adminTheme.colors.text.primary,
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReplyForm(false)
                    setReplyContent("")
                  }}
                  disabled={isReplying}
                  style={{
                    borderColor: adminTheme.colors.border.main,
                    color: adminTheme.colors.text.primary,
                  }}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSendReply}
                  disabled={isReplying || !replyContent.trim()}
                  style={{
                    backgroundColor: adminTheme.colors.primary.main,
                    color: 'white',
                  }}
                >
                  {isReplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      إرسال الرد
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <CardFooter className="flex justify-between p-4" style={{
          backgroundColor: adminTheme.colors.background.sidebar,
          borderTop: message.replied || showReplyForm ? 'none' : `1px solid ${adminTheme.colors.border.light}`
        }}>
          <div className="flex space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={handleToggleRead}
              disabled={isActionLoading}
              size="lg"
              style={{
                borderColor: adminTheme.colors.border.main,
                color: adminTheme.colors.text.primary,
                fontWeight: adminTheme.typography.fontWeights.medium
              }}
            >
              {message.read ? (
                <>
                  <EyeOff className="mr-2 h-5 w-5" style={{ color: adminTheme.colors.primary.main }} />
                  تحديد كغير مقروءة
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-5 w-5" style={{ color: adminTheme.colors.primary.main }} />
                  تحديد كمقروءة
                </>
              )}
            </Button>

            {!message.replied && !showReplyForm && (
              <Button
                variant="default"
                onClick={() => setShowReplyForm(true)}
                disabled={isActionLoading}
                size="lg"
                style={{
                  backgroundColor: adminTheme.colors.primary.main,
                  color: 'white',
                  fontWeight: adminTheme.typography.fontWeights.medium
                }}
              >
                <Reply className="mr-2 h-5 w-5" />
                الرد على الرسالة
              </Button>
            )}
          </div>

          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isActionLoading}
            size="lg"
            style={{
              backgroundColor: adminTheme.colors.status.danger,
              color: 'white'
            }}
          >
            <Trash className="mr-2 h-5 w-5" />
            حذف الرسالة
          </Button>
        </CardFooter>
      </Card>

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
              disabled={isActionLoading}
              style={{
                backgroundColor: adminTheme.colors.status.danger,
                color: 'white'
              }}
            >
              {isActionLoading ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
