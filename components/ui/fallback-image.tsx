"use client"

import { useState } from "react"

interface FallbackImageProps {
  src: string
  alt: string
  className?: string
  fallbackColor?: string
}

export function FallbackImage({
  src,
  alt,
  className = "",
  fallbackColor = "#f0f0f0"
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [hasError, setHasError] = useState(false)

  // Process the source URL to use API route if needed
  const processedSrc = (() => {
    // Add cache-busting timestamp
    const timestamp = Date.now()
    
    // If it's a local upload path, use the API route
    if (src.startsWith('/uploads/')) {
      return `/api/image/${src.replace('/uploads/', '')}?t=${timestamp}`
    }
    
    // Otherwise use the source directly with timestamp
    return `${imgSrc}?t=${timestamp}`
  })()

  const handleError = () => {
    console.error(`Error loading image: ${src}`)
    setHasError(true)
    
    // Try direct path as fallback if using API route
    if (imgSrc.startsWith('/api/image/') && src.startsWith('/uploads/')) {
      setImgSrc(src)
    }
  }

  return (
    <img
      src={processedSrc}
      alt={alt}
      className={className}
      onError={handleError}
      style={{ 
        backgroundColor: hasError ? fallbackColor : undefined,
        objectFit: "cover"
      }}
    />
  )
}
