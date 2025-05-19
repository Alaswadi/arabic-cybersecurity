"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Copy } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StoragePolicyPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<string | null>(null)

  const sqlScript = `-- Allow public access to the images bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated users to upload files to the images bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update their own files" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete their own files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid() = owner
  );`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
  }

  const updatePolicy = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)
    setDetails(null)

    try {
      const response = await fetch("/api/storage-policy", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          setDetails(data.details)
        }
        throw new Error(data.error || "حدث خطأ أثناء تحديث سياسة التخزين")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث سياسة التخزين")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">إدارة سياسة التخزين</h1>
        <Link href="/admin">
          <Button variant="outline">العودة إلى لوحة التحكم</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تحديث سياسة التخزين</CardTitle>
          <CardDescription>
            استخدم هذه الصفحة لتحديث سياسة التخزين للسماح برفع الصور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="automatic">
            <TabsList className="mb-4">
              <TabsTrigger value="automatic">تحديث تلقائي</TabsTrigger>
              <TabsTrigger value="manual">تحديث يدوي</TabsTrigger>
            </TabsList>

            <TabsContent value="automatic">
              <p className="mb-4">
                إذا كنت تواجه مشكلة في رفع الصور مع رسالة خطأ تتعلق بسياسة الأمان (RLS)، يمكنك النقر على الزر أدناه لتحديث سياسة التخزين.
              </p>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطأ</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>تم بنجاح</AlertTitle>
                  <AlertDescription>تم تحديث سياسة التخزين بنجاح. يمكنك الآن رفع الصور.</AlertDescription>
                </Alert>
              )}

              <Button onClick={updatePolicy} disabled={loading} className="mb-4">
                {loading ? "جاري التحديث..." : "تحديث سياسة التخزين"}
              </Button>

              {details && (
                <div className="mt-4">
                  <p className="text-red-600 mb-2">فشل التحديث التلقائي. يرجى استخدام التحديث اليدوي.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="manual">
              <div className="mb-4">
                <p className="mb-4">
                  إذا فشل التحديث التلقائي، يمكنك تحديث سياسة التخزين يدويًا باتباع الخطوات التالية:
                </p>
                <ol className="list-decimal list-inside space-y-2 mb-4">
                  <li>انسخ النص البرمجي SQL أدناه</li>
                  <li>انتقل إلى لوحة تحكم Supabase</li>
                  <li>اذهب إلى قسم SQL Editor</li>
                  <li>الصق النص البرمجي وقم بتنفيذه</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4 max-h-80 overflow-y-auto">
                  <code>{sqlScript}</code>
                </pre>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 text-gray-400" />
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                هذا النص البرمجي سيقوم بإنشاء سياسات RLS تسمح للمستخدمين المصادق عليهم برفع الصور إلى مجلد التخزين.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
