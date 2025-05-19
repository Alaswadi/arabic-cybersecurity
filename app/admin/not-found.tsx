import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - الصفحة غير موجودة</h1>
      <p className="mb-8 text-gray-600">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
      <Link href="/admin">
        <Button>العودة إلى لوحة التحكم</Button>
      </Link>
    </div>
  )
}
