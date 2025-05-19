import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export function FeaturesSection() {
  const features = [
    "تقييم شامل للمخاطر السيبرانية",
    "تدريب متقدم للموظفين على الوعي الأمني",
    "حماية متكاملة من هجمات التصيد الاحتيالي",
    "مراقبة مستمرة للتهديدات على مدار الساعة",
    "استجابة سريعة للحوادث السيبرانية",
    "تقارير تحليلية مفصلة عن أداء الأمن",
  ]

  return (
    <section className="py-20 bg-[#1a1c3a]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              كل ما تحتاجه لحماية <span className="gradient-text">مؤسستك</span> بفعالية
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              نقدم حلولاً متكاملة للأمن السيبراني تساعد المؤسسات على تحديد المخاطر ومنع الهجمات وحماية البيانات الحساسة. منصتنا المتطورة تجمع بين التكنولوجيا المتقدمة والخبرة البشرية لتوفير حماية شاملة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start bg-[#242850] p-3 rounded-lg border border-[#2f3365] hover:border-purple-500 transition-colors">
                  <CheckCircle className="h-6 w-6 text-purple-500 mt-0.5 ml-2 flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>

            <Button asChild className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">
              <Link href="/features">اكتشف المزيد من المميزات</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-lg overflow-hidden border border-[#2f3365] shadow-xl">
              <Image
                src="/placeholder-dashboard.png"
                alt="لوحة تحكم الأمن السيبراني"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute top-8 -right-8 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg -z-10 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
