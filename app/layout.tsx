import type React from "react"
import "@/styles/globals.css"
import "@/app/test.css"
import { Cairo } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { OrganizationStructuredData, WebsiteStructuredData } from "@/components/structured-data"

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: {
    default: "Phish Simulator - حماية من هجمات التصيد الاحتيالي",
    template: "%s | Phish Simulator"
  },
  description: "خدمات متكاملة لحماية مؤسستك من هجمات التصيد الاحتيالي وتعزيز الأمن السيبراني. نقدم حلول أمنية متطورة وتدريب متخصص للموظفين.",
  keywords: ["الأمن السيبراني", "التصيد الاحتيالي", "حماية المؤسسات", "تدريب الأمان", "الهجمات السيبرانية", "cybersecurity", "phishing protection", "security training"],
  authors: [{ name: "Phish Simulator Team" }],
  creator: "Phish Simulator",
  publisher: "Phish Simulator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://phishsimulator.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/',
      'ar-SA': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://phishsimulator.com',
    title: 'Phish Simulator - حماية من هجمات التصيد الاحتيالي',
    description: 'خدمات متكاملة لحماية مؤسستك من هجمات التصيد الاحتيالي وتعزيز الأمن السيبراني. نقدم حلول أمنية متطورة وتدريب متخصص للموظفين.',
    siteName: 'Phish Simulator',
    images: [
      {
        url: '/phishsim_logo.png',
        width: 1200,
        height: 630,
        alt: 'Phish Simulator - حماية من هجمات التصيد الاحتيالي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phish Simulator - حماية من هجمات التصيد الاحتيالي',
    description: 'خدمات متكاملة لحماية مؤسستك من هجمات التصيد الاحتيالي وتعزيز الأمن السيبراني.',
    images: ['/phishsim_logo.png'],
    creator: '@phishsimulator',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if the current path is admin
  const isAdmin = typeof window !== 'undefined' ? window.location.pathname.startsWith('/admin') : false;

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.className}>
        <OrganizationStructuredData />
        <WebsiteStructuredData />
        <ThemeProvider attribute="class" defaultTheme={isAdmin ? "light" : "dark"} enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
