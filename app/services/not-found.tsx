import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ServicesNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">الخدمة غير موجودة</h2>
        <p className="text-gray-600 mb-8">عذراً، الخدمة التي تبحث عنها غير موجودة أو تم نقلها أو حذفها.</p>
        <Link href="/services">
          <Button>العودة إلى الخدمات</Button>
        </Link>
      </div>
    </div>
  )
}
