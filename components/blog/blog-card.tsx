import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Database } from "@/lib/database.types"
import { StorageImage } from "@/components/ui/storage-image"

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"]

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full">
          {post.featured_image ? (
            <StorageImage
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-blue-100 flex items-center justify-center">
              <span className="text-blue-500 text-lg font-medium">فيش سيبراني</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          {post.excerpt && <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>}
          <div className="flex items-center text-sm text-gray-500">
            <CalendarDays className="h-4 w-4 ml-1" />
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
