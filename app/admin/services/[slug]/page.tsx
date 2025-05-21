import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ServiceForm } from "@/components/admin/service-form"
import { adminTheme } from "@/lib/admin-theme"
import { createAdminClient } from "@/lib/supabase/admin"

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

  try {
    // Create a service role client to bypass RLS
    let serviceRoleClient;
    try {
      serviceRoleClient = createAdminClient();
      console.log("Successfully created service role client for service detail page");
    } catch (error) {
      console.error("Error creating service role client:", error);

      // Fallback to regular client
      serviceRoleClient = createClient();
      console.log("Falling back to regular client for service detail page");
    }

    // Fetch the service
    const { data: service, error } = await serviceRoleClient
      .from("services")
      .select("*")
      .eq("id", params.slug)
      .single();

    if (error || !service) {
      console.error("Error fetching service:", error)
      notFound()
    }

    return (
      <div>
        <h1
          className="text-3xl font-bold mb-6"
          style={{ color: adminTheme.colors.primary.main }}
        >
          تعديل الخدمة
        </h1>
        <ServiceForm service={service} />
      </div>
    )
  } catch (error) {
    console.error("Error in EditServicePage:", error)
    notFound()
  }
}
