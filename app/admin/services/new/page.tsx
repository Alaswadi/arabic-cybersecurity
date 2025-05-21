import { ServiceForm } from "@/components/admin/service-form"
import { adminTheme } from "@/lib/admin-theme"

export default function NewServicePage() {
  return (
    <div>
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: adminTheme.colors.primary.main }}
      >
        إضافة خدمة جديدة
      </h1>
      <ServiceForm />
    </div>
  )
}
