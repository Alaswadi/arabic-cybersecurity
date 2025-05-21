import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ServicesTable } from "@/components/admin/services-table"
import { adminTheme } from "@/lib/admin-theme"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { createAdminClient } from "@/lib/supabase/admin"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Revalidate on every request

export default async function ServicesPage() {
  // Create a service role client to bypass RLS
  let services = [];

  try {
    // Create a service role client to bypass RLS
    let serviceRoleClient;
    try {
      serviceRoleClient = createAdminClient();
      console.log("Successfully created service role client for services page");
    } catch (error) {
      console.error("Error creating service role client:", error);

      // Fallback to regular client
      serviceRoleClient = createClient();
      console.log("Falling back to regular client for services page");
    }

    // Fetch services with cache-busting query parameter
    const { data, error } = await serviceRoleClient
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services:", error);
    } else {
      services = data || [];
    }
  } catch (error) {
    console.error("Unexpected error in services page:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6" style={{
        padding: adminTheme.spacing.lg,
        backgroundColor: adminTheme.colors.background.card,
        borderRadius: adminTheme.borderRadius.lg,
        boxShadow: adminTheme.shadows.sm,
        border: `1px solid ${adminTheme.colors.border.light}`
      }}>
        <h1 className="text-3xl font-bold" style={{ color: adminTheme.colors.primary.main }}>
          إدارة الخدمات
        </h1>
        <Link href="/admin/services/new">
          <Button style={{
            backgroundColor: adminTheme.colors.primary.main,
            color: 'white'
          }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة خدمة جديدة
          </Button>
        </Link>
      </div>

      <ServicesTable services={services || []} />
    </div>
  )
}
