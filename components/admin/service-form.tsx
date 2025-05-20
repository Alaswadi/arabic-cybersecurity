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
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
        // Update existing service
        const { error } = await supabase
          .from("services")
          .update({
            title,
            description,
            icon,
            image,
            updated_at: new Date().toISOString(),
          })
          .eq("id", service.id)

        if (error) throw error

        toast({
          title: "تم التحديث",
          description: "تم تحديث الخدمة بنجاح",
        })
      } else {
        // Create new service
        const { error } = await supabase.from("services").insert({
          title,
          description,
          icon,
          image,
        })

        if (error) throw error

        toast({
          title: "تمت الإضافة",
          description: "تم إضافة الخدمة بنجاح",
        })
      }

      // Force a server refresh before redirecting
      await fetch('/api/revalidate?path=/admin/services', { method: 'POST' })

      // Add a small delay before redirecting to ensure revalidation completes
      setTimeout(() => {
        router.push("/admin/services")
        router.refresh()
      }, 500)
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ الخدمة")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الخدمة</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">الأيقونة</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue placeholder="اختر أيقونة" />
              </SelectTrigger>
              <SelectContent>
                {availableIcons.map((iconName) => (
                  <SelectItem key={iconName} value={iconName}>
                    {iconName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">اختر الأيقونة المناسبة للخدمة</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الخدمة</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
            />
          </div>

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
              <Button type="button" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                رجوع
              </Button>
            </Link>

            <Button type="submit" disabled={loading}>
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
