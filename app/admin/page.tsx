import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, FileText, MessageSquare, Settings } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = createClient()

  // Fetch counts with error handling
  let servicesCount = 0
  let blogPostsCount = 0
  let publishedBlogPostsCount = 0
  let messagesCount = 0
  let unreadMessagesCount = 0

  try {
    const { count: sCount } = await supabase.from("services").select("*", { count: "exact", head: true })
    if (sCount !== null) servicesCount = sCount
  } catch (error) {
    console.error("Error fetching services count:", error)
  }

  try {
    const { count: bCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true })
    if (bCount !== null) blogPostsCount = bCount
  } catch (error) {
    console.error("Error fetching blog posts count:", error)
  }

  try {
    const { count: pbCount } = await supabase
      .from("blog_posts")
      .select("*", { count: "exact", head: true })
      .eq("published", true)
    if (pbCount !== null) publishedBlogPostsCount = pbCount
  } catch (error) {
    console.error("Error fetching published blog posts count:", error)
  }

  try {
    const { count: mCount } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
    if (mCount !== null) messagesCount = mCount
  } catch (error) {
    console.error("Error fetching contact messages count:", error)
  }

  try {
    const { count: umCount } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("read", false)
    if (umCount !== null) unreadMessagesCount = umCount
  } catch (error) {
    console.error("Error fetching unread contact messages count:", error)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1a1c3a] text-white border-[#2f3365]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">الخدمات</CardTitle>
            <Settings className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{servicesCount}</div>
            <p className="text-xs text-gray-400">إجمالي الخدمات</p>
            <div className="mt-4">
              <Link href="/admin/services">
                <Button size="sm" variant="outline" className="border-[#2f3365] text-white hover:bg-[#242850] hover:text-white">
                  إدارة الخدمات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1c3a] text-white border-[#2f3365]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">المقالات</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{blogPostsCount}</div>
            <p className="text-xs text-gray-400">إجمالي المقالات ({publishedBlogPostsCount} منشورة)</p>
            <div className="mt-4">
              <Link href="/admin/blog">
                <Button size="sm" variant="outline" className="border-[#2f3365] text-white hover:bg-[#242850] hover:text-white">
                  إدارة المقالات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1c3a] text-white border-[#2f3365]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">رسائل التواصل</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{messagesCount}</div>
            <p className="text-xs text-gray-400">إجمالي الرسائل ({unreadMessagesCount} غير مقروءة)</p>
            <div className="mt-4">
              <Link href="/admin/messages">
                <Button size="sm" variant="outline" className="border-[#2f3365] text-white hover:bg-[#242850] hover:text-white">
                  إدارة الرسائل
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-[#1a1c3a] text-white border-[#2f3365]">
          <CardHeader>
            <CardTitle className="text-white">مرحباً بك في لوحة التحكم</CardTitle>
            <CardDescription className="text-gray-400">يمكنك إدارة محتوى موقعك من هنا بما في ذلك الخدمات والمقالات</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">استخدم القائمة الجانبية للتنقل بين أقسام لوحة التحكم.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
