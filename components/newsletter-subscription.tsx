"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, CheckCircle, AlertCircle } from "lucide-react"

interface NewsletterSubscriptionProps {
  variant?: "footer" | "sidebar" | "inline" | "blog-sidebar"
  className?: string
}

export function NewsletterSubscription({ variant = "footer", className = "" }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("يرجى إدخال البريد الإلكتروني")
      return
    }

    setIsSubmitting(true)
    setStatus("idle")

    try {
      // Use our API route to handle the subscription
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("success")
        setMessage("تم الاشتراك بنجاح! شكراً لك.")
        setEmail("")
      } else {
        throw new Error(data.error || "فشل في الاشتراك")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      setStatus("error")
      setMessage("حدث خطأ أثناء الاشتراك. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Footer variant (horizontal layout)
  if (variant === "footer") {
    return (
      <div className={`max-w-4xl mx-auto text-center ${className}`}>
        <h3 className="text-2xl font-bold mb-4 gradient-text">اشترك في نشرتنا الإخبارية</h3>
        <p className="text-white/70 mb-6">
          احصل على أحدث الأخبار والتحديثات حول الأمن السيبراني والتهديدات الجديدة مباشرة إلى بريدك الإلكتروني
        </p>

        {status === "success" && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center text-green-300">
            <CheckCircle className="ml-2 h-5 w-5" />
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center text-red-300">
            <AlertCircle className="ml-2 h-5 w-5" />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            className="bg-[#242850] border-[#2f3365] text-white placeholder:text-white/50"
            required
          />
          <Button
            type="submit"
            className="gradient-bg hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الاشتراك..." : "اشترك"} <Send className="mr-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    )
  }

  // Sidebar variant (vertical layout)
  if (variant === "sidebar") {
    return (
      <div className={`bg-blue-800 text-white rounded-lg shadow-sm p-6 ${className}`}>
        <h3 className="text-xl font-bold mb-4">اشترك في النشرة البريدية</h3>
        <p className="mb-4 text-blue-100">
          احصل على آخر المقالات والنصائح حول الأمن السيبراني مباشرة إلى بريدك الإلكتروني.
        </p>

        {status === "success" && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center text-green-300 text-sm">
            <CheckCircle className="ml-2 h-4 w-4" />
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center text-red-300 text-sm">
            <AlertCircle className="ml-2 h-4 w-4" />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="w-full px-4 py-2 rounded-md bg-blue-700 text-white placeholder-blue-300 border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-blue-800 font-medium py-2 px-4 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "جاري الاشتراك..." : "اشتراك"}
          </button>
        </form>
      </div>
    )
  }

  // Blog sidebar variant (white background)
  if (variant === "blog-sidebar") {
    return (
      <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
        {status === "success" && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm">
            <CheckCircle className="ml-2 h-4 w-4" />
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="ml-2 h-4 w-4" />
            {message}
          </div>
        )}

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="بريدك الإلكتروني"
          className="bg-white border-gray-300 text-gray-900"
          required
        />
        <Button
          type="submit"
          className="w-full gradient-bg hover:opacity-90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الاشتراك..." : "اشترك الآن"}
        </Button>
      </form>
    )
  }

  // Inline variant (simple horizontal form)
  return (
    <div className={`max-w-3xl text-center ${className}`}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">اشترك في النشرة الإخبارية</h2>
      <p className="text-gray-700 mb-6">احصل على آخر المقالات والتحديثات مباشرة إلى بريدك الإلكتروني</p>

      {status === "success" && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center text-green-700">
          <CheckCircle className="ml-2 h-5 w-5" />
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center text-red-700">
          <AlertCircle className="ml-2 h-5 w-5" />
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="بريدك الإلكتروني"
          className="bg-white border-gray-300 text-gray-900 flex-grow py-6"
          required
        />
        <Button
          type="submit"
          className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "جاري الاشتراك..." : "اشترك الآن"}
        </Button>
      </form>
    </div>
  )
}
