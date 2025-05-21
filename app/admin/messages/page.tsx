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
import { adminTheme } from "@/lib/admin-theme"

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"]

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Check authentication status silently
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth-test')
      const data = await response.json()

      console.log("Auth test result:", data)

      if (!data.authenticated) {
        setError("Authentication error: " + (data.message || data.error || "Not logged in"))
      }
    } catch (error) {
      console.error("Error checking auth:", error)
      setError("Error checking authentication")
    }
  }

  const fetchMessages = async (filter?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Fetching messages with filter:", filter || "none")
      const queryParams = filter === "read" ? "?read=true" : filter === "unread" ? "?read=false" : ""

      const response = await fetch(`/api/admin/messages${queryParams}`)

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Failed to fetch messages: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log("Received data:", data)

      if (Array.isArray(data.messages)) {
        setMessages(data.messages)
        console.log(`Loaded ${data.messages.length} messages`)
      } else {
        console.warn("Unexpected response format:", data)
        setMessages([])
        setError("Unexpected response format from server")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
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
    // Check authentication silently
    checkAuth();

    // Then fetch messages
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
      <div className="flex items-center justify-between mb-6" style={{
        padding: adminTheme.spacing.lg,
        backgroundColor: adminTheme.colors.background.card,
        borderRadius: adminTheme.borderRadius.lg,
        boxShadow: adminTheme.shadows.sm,
        border: `1px solid ${adminTheme.colors.border.light}`
      }}>
        <h1 className="text-3xl font-bold" style={{ color: adminTheme.colors.primary.main }}>
          رسائل التواصل
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            style={{
              borderColor: adminTheme.colors.border.main,
              color: adminTheme.colors.text.primary
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" style={{ color: adminTheme.colors.primary.main }} />
            تحديث
          </Button>
          <Link href="/admin">
            <Button
              variant="outline"
              style={{
                borderColor: adminTheme.colors.border.main,
                color: adminTheme.colors.text.primary
              }}
            >
              العودة إلى لوحة التحكم
            </Button>
          </Link>
        </div>
      </div>



      {/* Error display */}
      {error && (
        <div className="mb-4 p-4 rounded-md" style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FEE2E2',
          borderRadius: adminTheme.borderRadius.md
        }}>
          <h3 className="font-medium mb-2" style={{ color: adminTheme.colors.status.danger }}>خطأ</h3>
          <p style={{ color: '#B91C1C' }}>{error}</p>
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              style={{
                borderColor: '#FCA5A5',
                color: adminTheme.colors.status.danger
              }}
            >
              حاول مرة أخرى
            </Button>
          </div>
        </div>
      )}

      <Card className="mb-6" style={{
        backgroundColor: adminTheme.colors.background.card,
        boxShadow: adminTheme.shadows.sm,
        border: `1px solid ${adminTheme.colors.border.light}`,
        borderRadius: adminTheme.borderRadius.md
      }}>
        <CardHeader style={{
          borderBottom: `1px solid ${adminTheme.colors.border.light}`
        }}>
          <CardTitle style={{ color: adminTheme.colors.text.primary }}>إدارة رسائل التواصل</CardTitle>
          <CardDescription style={{ color: adminTheme.colors.text.secondary }}>
            عرض وإدارة الرسائل المرسلة من نموذج التواصل في الموقع
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <TabsList className="mb-4" style={{
              backgroundColor: adminTheme.colors.background.sidebar,
              padding: '2px'
            }}>
              <TabsTrigger
                value="all"
                style={{
                  color: 'all' === activeTab ? 'white' : adminTheme.colors.text.secondary,
                  backgroundColor: 'all' === activeTab ? adminTheme.colors.primary.main : 'transparent'
                }}
              >
                جميع الرسائل ({messages.length})
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                style={{
                  color: 'unread' === activeTab ? 'white' : adminTheme.colors.text.secondary,
                  backgroundColor: 'unread' === activeTab ? adminTheme.colors.primary.main : 'transparent'
                }}
              >
                غير مقروءة ({unreadCount})
              </TabsTrigger>
              <TabsTrigger
                value="read"
                style={{
                  color: 'read' === activeTab ? 'white' : adminTheme.colors.text.secondary,
                  backgroundColor: 'read' === activeTab ? adminTheme.colors.primary.main : 'transparent'
                }}
              >
                مقروءة ({messages.length - unreadCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: adminTheme.colors.primary.main }} />
                </div>
              ) : (
                <MessagesTable messages={messages} onRefresh={handleRefresh} />
              )}
            </TabsContent>
            <TabsContent value="unread">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: adminTheme.colors.primary.main }} />
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
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: adminTheme.colors.primary.main }} />
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
