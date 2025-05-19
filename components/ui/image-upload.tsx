"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { transformStorageUrl } from "@/lib/supabase/storage-url"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { StorageImage } from "@/components/ui/storage-image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
  folder: string
  helpText?: string
}

export function ImageUpload({
  value,
  onChange,
  label,
  folder,
  helpText,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("يرجى اختيار ملف صورة صالح")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) throw error

      // Store only the file path in the database
      onChange(filePath)

      // Get a signed URL for preview purposes only
      const { data: signedUrlData } = await supabase.storage
        .from("images")
        .createSignedUrl(filePath, 60 * 60) // 1 hour expiry for preview

      if (signedUrlData?.signedUrl) {
        // Use the signed URL for preview
        setPreview(signedUrlData.signedUrl)
      } else {
        // Fallback to public URL if signed URL fails
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath)

        // Set the preview
        setPreview(publicUrlData.publicUrl)
      }
    } catch (error: any) {
      console.error("Error uploading image:", error.message)
      setUploadError(error.message || "حدث خطأ أثناء رفع الصورة")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onChange("")
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`image-upload-${label}`}>{label}</Label>

      <div className="flex flex-col gap-4">
        {preview ? (
          <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
            <StorageImage
              src={preview}
              alt={label}
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">اضغط لاختيار صورة أو اسحب الصورة هنا</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF حتى 5MB</p>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            ref={fileInputRef}
            id={`image-upload-${label}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1"
          >
            {isUploading ? (
              <span>جاري الرفع...</span>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {preview ? "تغيير الصورة" : "اختيار صورة"}
              </>
            )}
          </Button>
          {preview && (
            <Input
              value={preview}
              onChange={(e) => onChange(e.target.value)}
              placeholder="رابط الصورة"
              className="flex-1"
            />
          )}
        </div>

        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
        {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      </div>
    </div>
  )
}
