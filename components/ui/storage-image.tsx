"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

// Define our own props instead of extending ImageProps
interface StorageImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
}

export function StorageImage({
  src,
  fallbackSrc = "/placeholder.svg",
  alt,
  fill,
  className,
  width,
  height,
}: StorageImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc)
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function getImageUrl() {
      if (!src) {
        setImgSrc(fallbackSrc)
        setLoading(false)
        return
      }

      try {
        // Check if this is a full URL
        if (src.startsWith('http')) {
          // It's a full URL, use it directly
          setImgSrc(src)
          setLoading(false)
          return
        }

        // Check if it's a local upload path (starts with /uploads/)
        if (src.startsWith('/uploads/')) {
          // Convert to API route for better reliability
          const apiPath = `/api/image/${src.replace('/uploads/', '')}?t=${Date.now()}`;
          console.log('Using API path for image:', apiPath);
          setImgSrc(apiPath)
          setLoading(false)
          return
        }

        // Check if it's a file path for Supabase storage
        if (src.includes('/')) {
          // It looks like a file path, try to get a signed URL

          // Determine the bucket and path
          let bucket = 'images'
          let filePath = src

          // If the path starts with a bucket name, extract it
          if (src.startsWith('images/') || src.startsWith('blog/') || src.startsWith('services/')) {
            const parts = src.split('/')
            if (parts.length >= 2) {
              bucket = parts[0]
              filePath = parts.slice(1).join('/')
            }
          }

          try {
            // Get a signed URL from Supabase
            const supabase = createClient()
            const { data } = await supabase.storage.from(bucket).createSignedUrl(filePath, 60 * 60) // 1 hour

            if (data?.signedUrl) {
              setImgSrc(data.signedUrl)
            } else {
              // Fallback to public URL if signed URL fails
              const { data: publicUrlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

              setImgSrc(publicUrlData.publicUrl)
            }
          } catch (storageError) {
            console.error('Error getting Supabase URL:', storageError)
            // If Supabase storage fails, try treating it as a local path
            setImgSrc(src.startsWith('/') ? src : `/${src}`)
          }
        } else {
          // Not a recognizable path, use as is
          setImgSrc(src)
        }
      } catch (error) {
        console.error('Error processing image URL:', error)
        setImgSrc(fallbackSrc) // Fallback to the placeholder
      }

      setLoading(false)
    }

    setLoading(true)
    setError(false)
    getImageUrl()
  }, [src, fallbackSrc])

  const handleError = () => {
    setError(true)
    setImgSrc(fallbackSrc)
  }

  // Prepare style for fill mode
  const fillStyle = fill ? {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  } as React.CSSProperties : {};

  // Combine styles
  const imgStyle = {
    ...fillStyle,
  };

  return (
    <>
      {loading ? (
        <div className="animate-pulse bg-gray-200 w-full h-full" />
      ) : (
        <img
          src={error ? fallbackSrc : imgSrc}
          alt={alt}
          onError={handleError}
          className={className}
          width={width}
          height={height}
          style={imgStyle}
        />
      )}
    </>
  )
}
