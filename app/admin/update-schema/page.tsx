"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, Copy } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UpdateSchemaPage() {
  const [activeTab, setActiveTab] = useState("services")

  const servicesScript = `-- Add image column to services table if it doesn't exist
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

  const fixRlsScript = `-- This script completely resets and fixes the RLS policies for the contact_messages table
-- to allow anonymous insertions

-- First, disable RLS temporarily to ensure we can modify the table
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for the contact_messages table
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;

-- Create a policy that allows anyone (including anonymous users) to insert messages
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create a policy that allows only authenticated users to view messages
CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy that allows only authenticated users to update messages
CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create a policy that allows only authenticated users to delete messages
CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Re-enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;`

  const contactMessagesScript = `-- Add contact_messages table if it doesn't exist
DO $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'contact_messages'
  ) THEN
    -- Create the contact_messages table
    CREATE TABLE contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      read BOOLEAN DEFAULT false NOT NULL
    );

    -- Add comments
    COMMENT ON TABLE contact_messages IS 'Contact form submissions from website visitors';
    COMMENT ON COLUMN contact_messages.id IS 'Unique identifier for the contact message';
    COMMENT ON COLUMN contact_messages.name IS 'Name of the person submitting the contact form';
    COMMENT ON COLUMN contact_messages.email IS 'Email address of the person submitting the contact form';
    COMMENT ON COLUMN contact_messages.phone IS 'Optional phone number of the person submitting the contact form';
    COMMENT ON COLUMN contact_messages.subject IS 'Optional subject/topic of the contact message';
    COMMENT ON COLUMN contact_messages.message IS 'Content of the contact message';
    COMMENT ON COLUMN contact_messages.created_at IS 'Timestamp when the contact message was submitted';
    COMMENT ON COLUMN contact_messages.read IS 'Whether the contact message has been read by an admin';

    -- Add RLS policies
    ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

    -- Allow authenticated users to insert new messages
    CREATE POLICY "Anyone can insert contact messages" ON contact_messages
      FOR INSERT
      WITH CHECK (true);

    -- Allow authenticated admins to read, update, and delete messages
    CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
      FOR SELECT
      USING (auth.role() = 'authenticated');

    CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
      FOR UPDATE
      USING (auth.role() = 'authenticated');

    CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
      FOR DELETE
      USING (auth.role() = 'authenticated');

    RAISE NOTICE 'Created contact_messages table with RLS policies';
  ELSE
    RAISE NOTICE 'contact_messages table already exists';
  END IF;
END
$$;`

  const copyToClipboard = () => {
    let scriptToCopy = servicesScript

    if (activeTab === "contact") {
      scriptToCopy = contactMessagesScript
    } else if (activeTab === "fix-rls") {
      scriptToCopy = fixRlsScript
    }

    navigator.clipboard.writeText(scriptToCopy)
  }

  const [updateStatus, setUpdateStatus] = useState<{
    loading: boolean;
    success: boolean | null;
    message: string | null;
  }>({
    loading: false,
    success: null,
    message: null,
  })

  const handleAutomaticUpdate = async () => {
    setUpdateStatus({
      loading: true,
      success: null,
      message: "جاري تحديث قاعدة البيانات..."
    })

    try {
      let endpoint = "/api/db/update-schema"

      if (activeTab === "contact") {
        endpoint = "/api/db/update-contact-schema"
      } else if (activeTab === "fix-rls") {
        endpoint = "/api/db/fix-contact-rls"
      }

      const response = await fetch(endpoint, {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setUpdateStatus({
          loading: false,
          success: true,
          message: data.message || "تم تحديث قاعدة البيانات بنجاح"
        })
      } else {
        setUpdateStatus({
          loading: false,
          success: false,
          message: data.error || "حدث خطأ أثناء تحديث قاعدة البيانات"
        })
      }
    } catch (error) {
      console.error("Error updating schema:", error)
      setUpdateStatus({
        loading: false,
        success: false,
        message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
      })
    }
  }

  const handleDirectRlsUpdate = async () => {
    setUpdateStatus({
      loading: true,
      success: null,
      message: "جاري تحديث سياسات RLS بشكل مباشر..."
    })

    try {
      const response = await fetch("/api/db/fix-contact-rls-direct", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setUpdateStatus({
          loading: false,
          success: true,
          message: data.message || "تم تحديث سياسات RLS بنجاح"
        })
      } else {
        setUpdateStatus({
          loading: false,
          success: false,
          message: data.error || "حدث خطأ أثناء تحديث سياسات RLS"
        })
      }
    } catch (error) {
      console.error("Error updating RLS policies:", error)
      setUpdateStatus({
        loading: false,
        success: false,
        message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
      })
    }
  }

  const handleHardcodedKeyUpdate = async () => {
    setUpdateStatus({
      loading: true,
      success: null,
      message: "جاري تحديث سياسات RLS باستخدام المفتاح المضمن..."
    })

    try {
      const response = await fetch("/api/db/fix-rls-direct-key", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setUpdateStatus({
          loading: false,
          success: true,
          message: data.message || "تم تحديث سياسات RLS بنجاح"
        })
      } else {
        setUpdateStatus({
          loading: false,
          success: false,
          message: data.error || "حدث خطأ أثناء تحديث سياسات RLS"
        })
      }
    } catch (error) {
      console.error("Error updating RLS policies with hardcoded key:", error)
      setUpdateStatus({
        loading: false,
        success: false,
        message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
      })
    }
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
          <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="services">جدول الخدمات</TabsTrigger>
              <TabsTrigger value="contact">جدول رسائل التواصل</TabsTrigger>
              <TabsTrigger value="fix-rls">إصلاح سياسات RLS</TabsTrigger>
              <TabsTrigger value="fix-rls-direct">إصلاح RLS مباشر</TabsTrigger>
              <TabsTrigger value="fix-rls-hardcoded">إصلاح RLS بالمفتاح</TabsTrigger>
            </TabsList>

            <TabsContent value="services">
              <div className="space-y-6">
                {updateStatus.message && (
                  <Alert
                    variant={updateStatus.success === true ? "default" : updateStatus.success === false ? "destructive" : undefined}
                    className="mb-6"
                  >
                    {updateStatus.success === true ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : updateStatus.success === false ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : null}
                    <AlertTitle>
                      {updateStatus.success === true ? "تم التحديث" :
                       updateStatus.success === false ? "خطأ" : "جاري التحديث"}
                    </AlertTitle>
                    <AlertDescription>{updateStatus.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">تحديث جدول الخدمات</h3>
                  <Button
                    onClick={handleAutomaticUpdate}
                    disabled={updateStatus.loading}
                  >
                    {updateStatus.loading && activeTab === "services" ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                        جاري التحديث...
                      </>
                    ) : (
                      "تحديث تلقائي"
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4 max-h-80 overflow-y-auto">
                    <code>{servicesScript}</code>
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
            </TabsContent>

            <TabsContent value="contact">
              <div className="space-y-6">
                {updateStatus.message && (
                  <Alert
                    variant={updateStatus.success === true ? "default" : updateStatus.success === false ? "destructive" : undefined}
                    className="mb-6"
                  >
                    {updateStatus.success === true ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : updateStatus.success === false ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : null}
                    <AlertTitle>
                      {updateStatus.success === true ? "تم التحديث" :
                       updateStatus.success === false ? "خطأ" : "جاري التحديث"}
                    </AlertTitle>
                    <AlertDescription>{updateStatus.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">إنشاء جدول رسائل التواصل</h3>
                  <Button
                    onClick={handleAutomaticUpdate}
                    disabled={updateStatus.loading}
                  >
                    {updateStatus.loading && activeTab === "contact" ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                        جاري التحديث...
                      </>
                    ) : (
                      "تحديث تلقائي"
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4 max-h-80 overflow-y-auto">
                    <code>{contactMessagesScript}</code>
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
                    <li>إنشاء جدول جديد <code>contact_messages</code> لتخزين رسائل التواصل</li>
                    <li>إضافة الأعمدة اللازمة: الاسم، البريد الإلكتروني، رقم الهاتف، الموضوع، الرسالة، تاريخ الإرسال، حالة القراءة</li>
                    <li>إعداد سياسات أمان الصفوف (RLS) للجدول</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fix-rls">
              <div className="space-y-6">
                {updateStatus.message && (
                  <Alert
                    variant={updateStatus.success === true ? "default" : updateStatus.success === false ? "destructive" : undefined}
                    className="mb-6"
                  >
                    {updateStatus.success === true ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : updateStatus.success === false ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : null}
                    <AlertTitle>
                      {updateStatus.success === true ? "تم التحديث" :
                       updateStatus.success === false ? "خطأ" : "جاري التحديث"}
                    </AlertTitle>
                    <AlertDescription>{updateStatus.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">إصلاح سياسات RLS لجدول رسائل التواصل</h3>
                  <Button
                    onClick={handleAutomaticUpdate}
                    disabled={updateStatus.loading}
                  >
                    {updateStatus.loading && activeTab === "fix-rls" ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                        جاري التحديث...
                      </>
                    ) : (
                      "تحديث تلقائي"
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4 max-h-80 overflow-y-auto">
                    <code>{fixRlsScript}</code>
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
                    <li>تحديث سياسة RLS للسماح بإدخال رسائل التواصل من المستخدمين غير المسجلين</li>
                    <li>إصلاح مشكلة عدم القدرة على إرسال رسائل من نموذج التواصل</li>
                    <li>التأكد من وجود جميع سياسات RLS الأخرى للجدول</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fix-rls-direct">
              <div className="space-y-6">
                {updateStatus.message && (
                  <Alert
                    variant={updateStatus.success === true ? "default" : updateStatus.success === false ? "destructive" : undefined}
                    className="mb-6"
                  >
                    {updateStatus.success === true ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : updateStatus.success === false ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : null}
                    <AlertTitle>
                      {updateStatus.success === true ? "تم التحديث" :
                       updateStatus.success === false ? "خطأ" : "جاري التحديث"}
                    </AlertTitle>
                    <AlertDescription>{updateStatus.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">إصلاح مباشر لسياسات RLS لجدول رسائل التواصل</h3>
                  <Button
                    onClick={handleDirectRlsUpdate}
                    disabled={updateStatus.loading}
                  >
                    {updateStatus.loading && activeTab === "fix-rls-direct" ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                        جاري التحديث...
                      </>
                    ) : (
                      "تحديث مباشر"
                    )}
                  </Button>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>استخدم هذا الخيار إذا فشل خيار "إصلاح سياسات RLS" العادي.</p>
                  <p>هذا الخيار يستخدم طريقة مختلفة لتحديث سياسات RLS ولا يعتمد على وظيفة execute_sql.</p>

                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <h4 className="font-medium text-amber-800 mb-2">ملاحظة هامة</h4>
                    <p className="text-amber-700">
                      يتطلب هذا الخيار وجود مفتاح الخدمة (Service Role Key) لـ Supabase في متغيرات البيئة.
                      تأكد من إعداد متغير البيئة SUPABASE_SERVICE_ROLE_KEY قبل استخدام هذا الخيار.
                    </p>
                  </div>

                  <div className="mt-4">
                    <p>التغييرات التي سيتم إجراؤها:</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>تحديث سياسة RLS للسماح بإدخال رسائل التواصل من المستخدمين غير المسجلين</li>
                      <li>إصلاح مشكلة عدم القدرة على إرسال رسائل من نموذج التواصل</li>
                      <li>التأكد من وجود جميع سياسات RLS الأخرى للجدول</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fix-rls-hardcoded">
              <div className="space-y-6">
                {updateStatus.message && (
                  <Alert
                    variant={updateStatus.success === true ? "default" : updateStatus.success === false ? "destructive" : undefined}
                    className="mb-6"
                  >
                    {updateStatus.success === true ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : updateStatus.success === false ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : null}
                    <AlertTitle>
                      {updateStatus.success === true ? "تم التحديث" :
                       updateStatus.success === false ? "خطأ" : "جاري التحديث"}
                    </AlertTitle>
                    <AlertDescription>{updateStatus.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">إصلاح سياسات RLS باستخدام المفتاح المضمن</h3>
                  <Button
                    onClick={handleHardcodedKeyUpdate}
                    disabled={updateStatus.loading}
                  >
                    {updateStatus.loading && activeTab === "fix-rls-hardcoded" ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                        جاري التحديث...
                      </>
                    ) : (
                      "تحديث بالمفتاح"
                    )}
                  </Button>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>هذا الخيار يستخدم مفتاح الخدمة المضمن مباشرة في الكود بدلاً من استخدام متغيرات البيئة.</p>
                  <p>استخدم هذا الخيار إذا فشلت الخيارات الأخرى.</p>

                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="font-medium text-green-800 mb-2">ميزة هذا الخيار</h4>
                    <p className="text-green-700">
                      لا يتطلب هذا الخيار إعداد متغيرات البيئة، حيث أن مفتاح الخدمة مضمن مباشرة في الكود.
                    </p>
                  </div>

                  <div className="mt-4">
                    <p>التغييرات التي سيتم إجراؤها:</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>تحديث سياسة RLS للسماح بإدخال رسائل التواصل من المستخدمين غير المسجلين</li>
                      <li>إصلاح مشكلة عدم القدرة على إرسال رسائل من نموذج التواصل</li>
                      <li>التأكد من وجود جميع سياسات RLS الأخرى للجدول</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
