import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Shield, Users } from "lucide-react"
import { DemoRequestForm } from "@/components/demo-request-form"

export default function DemoPage() {
  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-purple-600" />,
      title: "العنوان",
      details: "شارع الملك فهد، برج المملكة، الطابق 20، الرياض، المملكة العربية السعودية",
    },
    {
      icon: <Phone className="h-6 w-6 text-purple-600" />,
      title: "الهاتف",
      details: "+966 12 345 6789",
    },
    {
      icon: <Mail className="h-6 w-6 text-purple-600" />,
      title: "البريد الإلكتروني",
      details: "info@phishsimulator.com",
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "ساعات العمل",
      details: "الأحد - الخميس: 9:00 صباحًا - 5:00 مساءً",
    },
  ]

  const demoFeatures = [
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "تقييم شامل للمخاطر",
      details: "تعرف على نقاط الضعف في بنيتك التحتية وكيفية معالجتها بفعالية.",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "تدريب الموظفين",
      details: "شاهد كيف يمكن لمنصتنا تحسين وعي موظفيك بالأمن السيبراني.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-[#1a1c3a] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              احجز عرضاً توضيحياً
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              شاهد كيف يمكن لحلولنا المتطورة أن تساعد مؤسستك على مواجهة التحديات السيبرانية بفعالية.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Request Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Demo Request Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                احجز عرضك التوضيحي الآن
              </h2>
              <DemoRequestForm />
            </div>

            {/* Demo Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                ماذا ستشاهد في العرض التوضيحي
              </h2>
              <div className="grid grid-cols-1 gap-6 mb-8">
                {demoFeatures.map((item, index) => (
                  <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="bg-purple-100 p-3 rounded-lg ml-4">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-700">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-6 text-gray-900 mt-10">
                معلومات الاتصال
              </h2>
              <div className="grid grid-cols-1 gap-6 mb-8">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="bg-purple-100 p-3 rounded-lg ml-4">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-700">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
