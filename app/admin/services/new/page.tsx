import { ServiceForm } from "@/components/admin/service-form"

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إضافة خدمة جديدة</h1>
      <ServiceForm />
    </div>
  )
}
