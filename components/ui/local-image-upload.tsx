"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface LocalImageUploadProps {
  value: string
  onChange: (url: string) => void
  label: string
  folder: 'blog' | 'services'
  helpText?: string
}

export function LocalImageUpload({
  value,
  onChange,
  label,
  folder,
  helpText,
}: LocalImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      // Upload file to our API
      console.log('Uploading file to /api/upload...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const responseData = await response.json()
      console.log('Upload response:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || 'حدث خطأ أثناء رفع الصورة')
      }

      // Set the URL
      const imageUrl = responseData.url
      console.log('Image uploaded successfully:', imageUrl)
      onChange(imageUrl)
      setPreview(imageUrl)
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
            {/* Use a regular img tag instead of Next.js Image component for more reliable previews */}
            <img
              src={`${preview}?t=${Date.now()}`} // Add cache-busting timestamp
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                console.error(`Error loading image: ${preview}`);
                e.currentTarget.src = '/placeholder-image.jpg'; // Fallback image
              }}
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
