"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, FileText, LogOut, Menu, X, Database, TableProperties, MessageSquare } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const navItems = [
    {
      title: "لوحة التحكم",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "الخدمات",
      href: "/admin/services",
      icon: Settings,
    },
    {
      title: "المقالات",
      href: "/admin/blog",
      icon: FileText,
    },
    {
      title: "رسائل التواصل",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      title: "سياسة التخزين",
      href: "/admin/storage-policy",
      icon: Database,
    },
    {
      title: "تحديث قاعدة البيانات",
      href: "/admin/update-schema",
      icon: TableProperties,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0 border-r border-gray-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <h2 className="text-lg font-bold">لوحة التحكم</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t p-4">
            <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-100 hover:text-purple-700" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
