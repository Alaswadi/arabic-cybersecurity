import Link from "next/link"
import { ServiceIcon } from "@/components/services/service-icon"
import type { Database } from "@/lib/database.types"

type Service = Database["public"]["Tables"]["services"]["Row"]

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services/${service.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <ServiceIcon
                iconName={service.icon}
                className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors"
              />
            </div>
            <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{service.title}</h2>
          </div>
          <p className="text-gray-600 line-clamp-3">{service.description}</p>
          <div className="mt-4 text-blue-600 font-medium text-sm">عرض التفاصيل</div>
        </div>
      </div>
    </Link>
  )
}
