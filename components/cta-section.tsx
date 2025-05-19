import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/placeholder-pattern.svg')] opacity-10"></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          استعد لمواجهة التحديات السيبرانية اليوم
        </h2>
        <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
          احمِ مؤسستك من التهديدات المتطورة مع حلولنا الشاملة للأمن السيبراني. ابدأ رحلتك نحو بيئة رقمية أكثر أمانًا الآن.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-white text-purple-900 hover:bg-gray-100 px-6 py-6 text-lg h-auto">
            <Link href="/contact">تواصل معنا</Link>
          </Button>
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-6 text-lg h-auto">
            <Link href="/demo">طلب عرض توضيحي</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
