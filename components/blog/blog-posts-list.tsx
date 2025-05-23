"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { StorageImage } from "@/components/ui/storage-image"
import { LoadMoreButton } from "./load-more-button"

// Define the blog post type
export interface BlogPost {
  id?: string
  title: string
  excerpt: string
  image: string
  date: string
  author: string
  authorImage: string
  slug: string
  category?: string
}

interface BlogPostsListProps {
  initialPosts: BlogPost[]
  initialHasMore: boolean
  className?: string
  darkMode?: boolean
}

export function BlogPostsList({
  initialPosts,
  initialHasMore,
  className = "",
  darkMode = true
}: BlogPostsListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [offset, setOffset] = useState(initialPosts.length)
  const [hasMore, setHasMore] = useState(initialHasMore)

  const loadMorePosts = async () => {
    try {
      // Use absolute URL to avoid issues with relative paths
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/blog-posts?limit=3&offset=${offset}`)
      const data = await response.json()

      if (data.success && data.posts) {
        setPosts([...posts, ...data.posts])
        setOffset(offset + data.posts.length)
        return { hasMore: data.hasMore }
      }

      return { hasMore: false }
    } catch (error) {
      console.error("Error loading more posts:", error)
      return { hasMore: false }
    }
  }

  // Determine the card and text classes based on dark mode
  const cardClass = darkMode
    ? "dark-card rounded-lg overflow-hidden transition-all duration-300 hover:purple-glow border border-[#2f3365] group"
    : "bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:border-purple-500 hover-card-effect"

  const titleClass = darkMode
    ? "text-xl font-bold mb-3 text-white"
    : "text-xl font-bold mb-3 text-gray-900"

  const excerptClass = darkMode
    ? "text-gray-300 mb-4"
    : "text-gray-700 mb-4"

  const borderClass = darkMode
    ? "border-t border-[#2f3365]/50"
    : "border-t border-gray-200/50"

  const readMoreClass = darkMode
    ? "text-purple-400 hover:text-purple-300"
    : "text-purple-600 hover:text-purple-800"

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <div key={`${post.slug}-${index}`} className={cardClass}>
            <div className="relative h-48">
              {darkMode && <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c3a] to-transparent z-10 opacity-50"></div>}
              <StorageImage
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-purple-600/80 text-white text-xs px-2 py-1 rounded-md z-20">
                {post.date}
              </div>
            </div>
            <div className={`p-6 ${darkMode ? 'border-t border-[#2f3365]' : ''}`}>
              <h3 className={titleClass}>
                <Link href={`/blog/${post.slug}`} className={darkMode ? "hover:text-purple-400 transition-colors" : "hover:text-purple-600 transition-colors"}>
                  {post.title}
                </Link>
              </h3>
              <p className={excerptClass}>{post.excerpt}</p>
              <div className={`flex items-center justify-between pt-4 ${borderClass}`}>
                <div className="flex items-center">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 border border-purple-500">
                    <StorageImage
                      src={post.authorImage}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className={darkMode ? "text-sm text-gray-300" : "text-sm text-gray-600"}>{post.author}</span>
                </div>
                <Link href={`/blog/${post.slug}`} className={`${readMoreClass} text-sm flex items-center`}>
                  قراءة المزيد <ArrowLeft className="mr-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <LoadMoreButton
          initialHasMore={hasMore}
          onLoadMore={loadMorePosts}
        />
      </div>
    </div>
  )
}
