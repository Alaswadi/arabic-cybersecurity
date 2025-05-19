import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ServiceForm } from "@/components/admin/service-form"

// Simple UUID validation regex
const isValidUUID = (uuid: string) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return regex.test(uuid)
}

export default async function EditServicePage(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  // If the slug is "new", redirect to the dedicated new page
  if (params.slug === "new") {
    redirect("/admin/services/new")
  }

  // Validate UUID format
  if (!isValidUUID(params.slug)) {
    notFound()
  }

  const supabase = createClient()

  try {
    const { data: service, error } = await supabase.from("services").select("*").eq("id", params.slug).single()

    if (error || !service) {
      console.error("Error fetching service:", error)
      notFound()
    }

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">تعديل الخدمة</h1>
        <ServiceForm service={service} />
      </div>
    )
  } catch (error) {
    console.error("Error in EditServicePage:", error)
    notFound()
  }
}
