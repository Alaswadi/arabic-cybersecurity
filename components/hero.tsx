import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <div className="relative min-h-[700px] overflow-hidden bg-[#1a1c3a]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/40 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/40 blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-[150px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="gradient-text block mb-2">تقليل المخاطر السيبرانية</span>
            <span className="text-white font-extrabold">بشكل فعال وعلى نطاق واسع</span>
          </h1>

          <p className="text-lg md:text-xl mb-12 text-white/90 leading-relaxed max-w-2xl mx-auto font-medium">
            منصتنا المتطورة تساعد المؤسسات على تعزيز الأمن السيبراني وحماية البيانات الحساسة من التهديدات المتطورة
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="border-gray-700 text-white hover:bg-gray-800 px-6 py-6 text-lg h-auto">
              <Link href="/demo">احجز عرضاً توضيحياً <ArrowLeft className="mr-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-24 text-center">
          <p className="text-sm text-white/70 mb-8 font-medium">يثق بنا العديد من المؤسسات الرائدة</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="opacity-70 hover:opacity-100 transition-opacity">
              <Image src="/placeholder-logo.svg" alt="شركة 1" width={120} height={40} />
            </div>
            <div className="opacity-70 hover:opacity-100 transition-opacity">
              <Image src="/placeholder-logo.svg" alt="شركة 2" width={120} height={40} />
            </div>
            <div className="opacity-70 hover:opacity-100 transition-opacity">
              <Image src="/placeholder-logo.svg" alt="شركة 3" width={120} height={40} />
            </div>
            <div className="opacity-70 hover:opacity-100 transition-opacity">
              <Image src="/placeholder-logo.svg" alt="شركة 4" width={120} height={40} />
            </div>
            <div className="opacity-70 hover:opacity-100 transition-opacity">
              <Image src="/placeholder-logo.svg" alt="شركة 5" width={120} height={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
