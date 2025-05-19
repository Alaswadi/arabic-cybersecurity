"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log("Attempting to register with:", { email, fullName })

      // Register the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        console.error("Registration error:", signUpError.message)
        setError(signUpError.message)
        setLoading(false)
        return
      }

      console.log("Registration successful:", data)

      if (data.user) {
        // Add user to admin_users table
        const { error: profileError } = await supabase.from("admin_users").insert({
          id: data.user.id,
          email,
          full_name: fullName,
        })

        if (profileError) {
          console.error("Profile creation error:", profileError.message)
          setError(profileError.message)
          setLoading(false)
          return
        }

        router.push("/admin")
        router.refresh()
      } else {
        setError("تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("حدث خطأ أثناء إنشاء الحساب")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
          <CardDescription>قم بإنشاء حساب للوصول إلى لوحة التحكم</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
              </div>
              <Button type="submit" className="w-full gradient-bg hover:opacity-90" disabled={loading}>
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            لديك حساب بالفعل؟{" "}
            <Link href="/admin/login" className="text-blue-600 hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
