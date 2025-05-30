"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LocalImageUpload } from "@/components/ui/local-image-upload"
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminTheme } from "@/lib/admin-theme"

type Service = Database["public"]["Tables"]["services"]["Row"]

// List of available icons
const availableIcons = [
  "Shield",
  "Lock",
  "FileText",
  "BarChart",
  "Users",
  "Bell",
  "AlertTriangle",
  "Database",
  "Server",
  "Wifi",
  "Globe",
  "Mail",
]

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const isEditing = !!service

  const [title, setTitle] = useState(service?.title || "")
  const [description, setDescription] = useState(service?.description || "")
  const [icon, setIcon] = useState(service?.icon || "Shield")
  const [image, setImage] = useState(service?.image || "")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isEditing) {
        // Update existing service using the API route
        console.log("Updating service with data:", {
          id: service.id,
          title,
          description,
          icon,
          image,
        });

        const response = await fetch('/api/admin/services', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: service.id,
            title,
            description,
            icon,
            image,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "حدث خطأ أثناء تحديث الخدمة");
        }

        console.log("Service updated successfully:", data);

        toast({
          title: "تم التحديث",
          description: "تم تحديث الخدمة بنجاح",
        });
      } else {
        // Create new service using the API route
        console.log("Creating new service with data:", {
          title,
          description,
          icon,
          image,
        });

        const response = await fetch('/api/admin/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            icon,
            image,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "حدث خطأ أثناء إضافة الخدمة");
        }

        console.log("Service created successfully:", data);

        toast({
          title: "تمت الإضافة",
          description: "تم إضافة الخدمة بنجاح",
        });
      }

      // Force a server refresh before redirecting
      await fetch('/api/revalidate?path=/admin/services', { method: 'POST' });

      // Add a small delay before redirecting to ensure revalidation completes
      setTimeout(() => {
        router.push("/admin/services");
        router.refresh();
      }, 500);
    } catch (err: any) {
      console.error("Error saving service:", err);
      setError(err.message || "حدث خطأ أثناء حفظ الخدمة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card style={{
      backgroundColor: adminTheme.colors.background.card,
      boxShadow: adminTheme.shadows.sm,
      border: `1px solid ${adminTheme.colors.border.light}`,
      borderRadius: adminTheme.borderRadius.md
    }}>
      <CardContent className="pt-6" style={{ backgroundColor: '#FFFFFF' }}>
        {error && (
          <Alert
            variant="destructive"
            className="mb-6"
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: adminTheme.borderRadius.md
            }}
          >
            <AlertCircle className="h-4 w-4" style={{ color: adminTheme.colors.status.danger }} />
            <AlertDescription style={{ color: '#B91C1C' }}>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" style={{ color: adminTheme.colors.text.primary }}>عنوان الخدمة</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                backgroundColor: '#FFFFFF !important',
                borderColor: `${adminTheme.colors.border.main} !important`,
                color: `${adminTheme.colors.text.primary} !important`
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon" style={{ color: adminTheme.colors.text.primary }}>الأيقونة</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger style={{
                borderColor: `${adminTheme.colors.border.main} !important`,
                color: `${adminTheme.colors.text.primary} !important`,
                backgroundColor: '#FFFFFF !important'
              }}>
                <SelectValue placeholder="اختر أيقونة" />
              </SelectTrigger>
              <SelectContent style={{
                backgroundColor: '#FFFFFF !important',
                borderColor: `${adminTheme.colors.border.main} !important`
              }}>
                {availableIcons.map((iconName) => (
                  <SelectItem
                    key={iconName}
                    value={iconName}
                    style={{ color: adminTheme.colors.text.primary }}
                  >
                    {iconName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm" style={{ color: adminTheme.colors.text.muted }}>اختر الأيقونة المناسبة للخدمة</p>
          </div>

          <WysiwygEditor
            id="description"
            label="وصف الخدمة"
            value={description}
            onChange={setDescription}
            required={true}
            placeholder="اكتب وصف الخدمة هنا..."
            dir="rtl"
          />

          <LocalImageUpload
            value={image}
            onChange={(url) => {
              console.log("Service image URL updated:", url);

              // Store the original URL in the form data
              setImage(url);

              // Validate the image URL by trying to load it
              if (url) {
                // Try to load through the API route for better reliability
                const apiUrl = url.startsWith('/uploads/')
                  ? `/api/image/${url.replace('/uploads/', '')}`
                  : url;

                const img = document.createElement('img');
                img.onload = () => console.log("Service image loaded successfully:", apiUrl);
                img.onerror = () => console.error("Failed to load service image:", apiUrl);
                img.src = apiUrl;
              }
            }}
            label="صورة الخدمة"
            folder="services"
            helpText="صورة توضيحية للخدمة (اختياري)"
          />

          <div className="flex items-center justify-between">
            <Link href="/admin/services">
              <Button
                type="button"
                variant="outline"
                style={{
                  borderColor: adminTheme.colors.border.main,
                  color: adminTheme.colors.text.primary
                }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                رجوع
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: adminTheme.colors.primary.main,
                color: 'white'
              }}
            >
              {loading
                ? isEditing
                  ? "جاري التحديث..."
                  : "جاري الإضافة..."
                : isEditing
                  ? "تحديث الخدمة"
                  : "إضافة الخدمة"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
