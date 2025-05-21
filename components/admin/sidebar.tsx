"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, FileText, LogOut, Menu, X, Database, TableProperties, MessageSquare } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { adminTheme } from "@/lib/admin-theme"

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
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: adminTheme.colors.background.card,
            borderColor: adminTheme.colors.border.light,
            color: adminTheme.colors.text.primary
          }}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          backgroundColor: adminTheme.colors.background.sidebar,
          borderRight: `1px solid ${adminTheme.colors.border.light}`,
          boxShadow: adminTheme.shadows.sm
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6" style={{
            borderBottom: `1px solid ${adminTheme.colors.border.light}`
          }}>
            <h2 className="text-lg font-semibold" style={{
              color: adminTheme.colors.primary.main
            }}>لوحة التحكم</h2>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                    )}
                    style={{
                      backgroundColor: isActive ? adminTheme.colors.primary.lighter : 'transparent',
                      color: isActive ? adminTheme.colors.primary.main : adminTheme.colors.text.secondary
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" style={{
                      color: isActive ? adminTheme.colors.primary.main : adminTheme.colors.text.muted
                    }} />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4" style={{
            borderTop: `1px solid ${adminTheme.colors.border.light}`
          }}>
            <Button
              variant="outline"
              className="w-full justify-start"
              style={{
                color: adminTheme.colors.status.danger,
                borderColor: adminTheme.colors.border.light,
                backgroundColor: 'transparent'
              }}
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-5 w-5" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        />
      )}
    </>
  )
}
