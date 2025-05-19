import type React from "react"
import "@/styles/globals.css"
import "@/app/test.css"
import { Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: " Phish Simulator - حماية من هجمات التصيد الاحتيالي",
  description: "خدمات متكاملة لحماية مؤسستك من هجمات التصيد الاحتيالي وتعزيز الأمن السيبراني",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
