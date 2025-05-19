import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function Hero() {
  return (
    <div className="relative min-h-[700px] overflow-hidden bg-[#1a1c3a]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-700 blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-700 blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">تقليل المخاطر السيبرانية</span>
            <br />
            بشكل فعال وعلى نطاق واسع
          </h1>

          <p className="text-lg md:text-xl mb-10 text-gray-300 leading-relaxed max-w-2xl mx-auto">
            منصتنا المتطورة تساعد المؤسسات على تعزيز الأمن السيبراني وحماية البيانات الحساسة من التهديدات المتطورة
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto purple-glow">
              ابدأ الآن مجاناً
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 px-6 py-6 text-lg h-auto">
              احجز عرضاً توضيحياً <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-24 text-center">
          <p className="text-sm text-gray-400 mb-8">يثق بنا العديد من المؤسسات الرائدة</p>
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
