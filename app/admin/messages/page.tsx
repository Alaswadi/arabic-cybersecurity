"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessagesTable } from "@/components/admin/messages-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/lib/database.types"

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"]

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const fetchMessages = async (filter?: string) => {
    setIsLoading(true)
    try {
      const queryParams = filter === "read" ? "?read=true" : filter === "unread" ? "?read=false" : ""
      const response = await fetch(`/api/admin/messages${queryParams}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }
      
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الرسائل. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages(activeTab !== "all" ? activeTab : undefined)
  }, [activeTab])

  const handleRefresh = () => {
    fetchMessages(activeTab !== "all" ? activeTab : undefined)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const unreadCount = messages.filter(message => !message.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">رسائل التواصل</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            تحديث
          </Button>
          <Link href="/admin">
            <Button variant="outline">العودة إلى لوحة التحكم</Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>إدارة رسائل التواصل</CardTitle>
          <CardDescription>
            عرض وإدارة الرسائل المرسلة من نموذج التواصل في الموقع
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">جميع الرسائل ({messages.length})</TabsTrigger>
              <TabsTrigger value="unread">غير مقروءة ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">مقروءة ({messages.length - unreadCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <MessagesTable messages={messages} onRefresh={handleRefresh} />
              )}
            </TabsContent>
            <TabsContent value="unread">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <MessagesTable 
                  messages={messages.filter(message => !message.read)} 
                  onRefresh={handleRefresh} 
                />
              )}
            </TabsContent>
            <TabsContent value="read">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <MessagesTable 
                  messages={messages.filter(message => message.read)} 
                  onRefresh={handleRefresh} 
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
