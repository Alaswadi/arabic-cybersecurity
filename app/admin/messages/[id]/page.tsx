"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Mail, Phone, Trash, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ar } from "date-fns/locale"
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
import type { Database } from "@/lib/database.types"

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"]

export default function MessageDetailPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">تفاصيل الرسالة</h1>
        <Button asChild variant="outline">
          <Link href="/admin/messages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            العودة إلى قائمة الرسائل
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{message.subject || "رسالة بدون موضوع"}</CardTitle>
              <CardDescription>
                {formattedDate.relative} ({formattedDate.full})
              </CardDescription>
            </div>
            <Badge variant={message.read ? "outline" : "default"}>
              {message.read ? "مقروءة" : "غير مقروءة"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">الاسم</p>
                <p className="font-medium">{message.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                <p className="font-medium">{message.email}</p>
              </div>
            </div>
            {message.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                  <p className="font-medium">{message.phone}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-2">الرسالة</h3>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleToggleRead}
            disabled={isActionLoading}
          >
            {message.read ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                تحديد كغير مقروءة
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                تحديد كمقروءة
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isActionLoading}
          >
            <Trash className="mr-2 h-4 w-4" />
            حذف الرسالة
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الرسالة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الرسالة نهائياً من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleDelete}
              disabled={isActionLoading}
            >
              {isActionLoading ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
