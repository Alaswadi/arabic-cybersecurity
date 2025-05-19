"use client"

import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

// Import the config to apply dynamic rendering to all admin pages
import "./config"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use usePathname to check the current path
  const pathname = usePathname()
  const isAuthRoute = pathname === "/admin/login" || pathname === "/admin/register"

  return (
    <AuthProvider>
      {isAuthRoute ? (
        // Auth routes don't need the sidebar
        (<>
          {children}
          <Toaster />
        </>)
      ) : (
        // Admin routes need the sidebar
        (<div className="flex min-h-screen bg-[#f5f5f7]" dir="ltr">
          <AdminSidebar />
          <div className="flex-1">
            <div className="container mx-auto py-6 px-4">{children}</div>
          </div>
          <Toaster />
        </div>)
      )}
    </AuthProvider>
  );
}
