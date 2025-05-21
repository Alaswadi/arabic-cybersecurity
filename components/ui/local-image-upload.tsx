"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { adminTheme } from "@/lib/admin-theme"

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

      // Create a direct API URL for the image
      const apiImageUrl = imageUrl.replace('/uploads/', '/api/image/');
      console.log('API image URL:', apiImageUrl);

      // Pre-load the image to verify it works
      const img = document.createElement('img');
      img.onload = () => {
        console.log('Image pre-loaded successfully');
        // Use the original URL for storage but display through API
        onChange(imageUrl);
        setPreview(apiImageUrl);
      };
      img.onerror = () => {
        console.error('Failed to pre-load image, falling back to direct URL');
        onChange(imageUrl);
        setPreview(imageUrl);
      };
      img.src = apiImageUrl;
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
      <Label htmlFor={`image-upload-${label}`} style={{ color: adminTheme.colors.text.primary }}>{label}</Label>

      <div className="flex flex-col gap-4">
        {preview ? (
          <div className="relative w-full h-48 rounded-md overflow-hidden" style={{
            backgroundColor: adminTheme.colors.background.card,
            border: `1px solid ${adminTheme.colors.border.light}`
          }}>
            {/* Use a regular img tag instead of Next.js Image component for more reliable previews */}
            <img
              src={`${preview}?t=${Date.now()}`} // Add cache-busting timestamp
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                console.error(`Error loading image: ${preview}`);
                // Try to load the image through our API route
                let apiPath;
                if (preview.startsWith('/uploads/')) {
                  // Convert /uploads/blog/file.jpg to /api/image/blog/file.jpg
                  apiPath = `/api/image/${preview.replace('/uploads/', '')}?t=${Date.now()}`;
                } else if (preview.startsWith('/api/image/')) {
                  // Already using API path, just add cache busting
                  apiPath = `${preview}?t=${Date.now()}`;
                } else {
                  // Direct path with origin
                  apiPath = `${window.location.origin}${preview}?t=${Date.now()}`;
                }

                console.log('Trying API path:', apiPath);

                // Set a fallback color
                e.currentTarget.style.backgroundColor = adminTheme.colors.background.card;
                e.currentTarget.style.display = 'flex';
                e.currentTarget.style.alignItems = 'center';
                e.currentTarget.style.justifyContent = 'center';

                // Try again with the API path
                e.currentTarget.src = apiPath;
              }}
              style={{ background: adminTheme.colors.background.card }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemoveImage}
              style={{
                backgroundColor: adminTheme.colors.status.danger,
                color: 'white'
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center" style={{
            borderColor: adminTheme.colors.border.light,
            backgroundColor: adminTheme.colors.background.card
          }}>
            <ImageIcon className="h-12 w-12 mb-2" style={{ color: adminTheme.colors.text.muted }} />
            <p className="text-sm mb-2" style={{ color: adminTheme.colors.text.secondary }}>اضغط لاختيار صورة أو اسحب الصورة هنا</p>
            <p className="text-xs" style={{ color: adminTheme.colors.text.muted }}>PNG, JPG, GIF حتى 5MB</p>
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
            style={{
              backgroundColor: adminTheme.colors.background.card,
              borderColor: adminTheme.colors.border.main,
              color: adminTheme.colors.text.primary
            }}
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
              style={{
                backgroundColor: adminTheme.colors.background.card,
                borderColor: adminTheme.colors.border.main,
                color: adminTheme.colors.text.primary
              }}
            />
          )}
        </div>

        {uploadError && <p className="text-sm" style={{ color: adminTheme.colors.status.danger }}>{uploadError}</p>}
        {helpText && <p className="text-sm" style={{ color: adminTheme.colors.text.muted }}>{helpText}</p>}
      </div>
    </div>
  )
}
