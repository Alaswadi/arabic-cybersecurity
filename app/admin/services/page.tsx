import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ServicesTable } from "@/components/admin/services-table"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Revalidate on every request

export default async function ServicesPage() {
  const supabase = createClient()

  // Fetch services with cache-busting query parameter
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false })
    .throwOnError() // This will throw an error if the query fails

  if (error) {
    console.error("Error fetching services:", error)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">إدارة الخدمات</h1>
        <Link href="/admin/services/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة خدمة جديدة
          </Button>
        </Link>
      </div>

      <ServicesTable services={services || []} />
    </div>
  )
}
