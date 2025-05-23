"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface LoadMoreButtonProps {
  initialHasMore: boolean
  onLoadMore: () => Promise<{ hasMore: boolean }>
  className?: string
}

export function LoadMoreButton({ 
  initialHasMore, 
  onLoadMore, 
  className = "" 
}: LoadMoreButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await onLoadMore()
      setHasMore(result.hasMore)
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!initialHasMore) return null

  return (
    <Button 
      onClick={handleLoadMore}
      disabled={isLoading || !hasMore}
      className={`gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto ${className}`}
    >
      {isLoading ? "جاري التحميل..." : "عرض المزيد من المقالات"} 
      {!isLoading && <ArrowLeft className="mr-2 h-4 w-4" />}
    </Button>
  )
}
