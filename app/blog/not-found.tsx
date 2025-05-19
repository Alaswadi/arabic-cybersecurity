import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">المقال غير موجود</h2>
        <p className="text-gray-600 mb-8">عذراً، المقال الذي تبحث عنه غير موجود أو تم نقله أو حذفه.</p>
        <Link href="/blog">
          <Button>العودة إلى المدونة</Button>
        </Link>
      </div>
    </div>
  )
}
