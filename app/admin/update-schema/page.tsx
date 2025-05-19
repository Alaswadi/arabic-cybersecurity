"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, Copy } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UpdateSchemaPage() {
  const sqlScript = `-- Add image column to services table if it doesn't exist
DO $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'services'
    AND column_name = 'image'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE services ADD COLUMN image VARCHAR(255);

    -- Add comment
    COMMENT ON COLUMN services.image IS 'URL path to the service image';

    RAISE NOTICE 'Added image column to services table';
  ELSE
    RAISE NOTICE 'Image column already exists in services table';
  END IF;
END
$$;`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">تحديث قاعدة البيانات</h1>
        <Link href="/admin">
          <Button variant="outline">العودة إلى لوحة التحكم</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تحديث هيكل قاعدة البيانات</CardTitle>
          <CardDescription>
            استخدم هذه الصفحة لتحديث هيكل قاعدة البيانات وإضافة الأعمدة المطلوبة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>تحديث يدوي مطلوب</AlertTitle>
            <AlertDescription>
              يجب تحديث هيكل قاعدة البيانات يدويًا باستخدام محرر SQL في Supabase. يرجى اتباع التعليمات أدناه.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">خطوات تحديث قاعدة البيانات:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>انسخ النص البرمجي SQL أدناه</li>
                <li>انتقل إلى <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">لوحة تحكم Supabase</a></li>
                <li>اختر مشروعك</li>
                <li>انتقل إلى قسم <strong>SQL Editor</strong></li>
                <li>الصق النص البرمجي في محرر SQL</li>
                <li>انقر على زر <strong>RUN</strong> لتنفيذ الاستعلام</li>
                <li>تحقق من الرسائل للتأكد من نجاح العملية</li>
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

            <div className="mt-4 text-sm text-gray-500">
              <p>التغييرات التي سيتم إجراؤها:</p>
              <ul className="list-disc list-inside mt-2">
                <li>إضافة عمود <code>image</code> من نوع <code>VARCHAR(255)</code> إلى جدول <code>services</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
