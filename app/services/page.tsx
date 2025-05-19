import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServicesSection } from "@/components/services-section"
import { CTASection } from "@/components/cta-section"
import { Shield, Users, Lock, Bell, FileText, Headphones, ArrowLeft, Server, Database, Wifi, Globe, Mail, AlertTriangle, BarChart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NavButton } from "@/components/ui/nav-button"
import { createClient } from "@/lib/supabase/server"
import { StorageImage } from "@/components/ui/storage-image"

// Make this page dynamic to fetch data from Supabase at request time
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Revalidate on every request

// Map icon strings to Lucide React components
const iconMap: Record<string, React.ReactElement<any>> = {
  Shield: <Shield className="h-16 w-16 text-purple-600" />,
  Users: <Users className="h-16 w-16 text-purple-600" />,
  Lock: <Lock className="h-16 w-16 text-purple-600" />,
  Bell: <Bell className="h-16 w-16 text-purple-600" />,
  FileText: <FileText className="h-16 w-16 text-purple-600" />,
  Headphones: <Headphones className="h-16 w-16 text-purple-600" />,
  Server: <Server className="h-16 w-16 text-purple-600" />,
  Database: <Database className="h-16 w-16 text-purple-600" />,
  Wifi: <Wifi className="h-16 w-16 text-purple-600" />,
  Globe: <Globe className="h-16 w-16 text-purple-600" />,
  Mail: <Mail className="h-16 w-16 text-purple-600" />,
  AlertTriangle: <AlertTriangle className="h-16 w-16 text-purple-600" />,
  BarChart: <BarChart className="h-16 w-16 text-purple-600" />,
}

// Default services in case Supabase fetch fails
const defaultServices = [
  {
    id: "1",
    icon: "Shield",
    title: "تقييم المخاطر السيبرانية",
    description: "تحليل شامل للمخاطر السيبرانية في مؤسستك وتحديد نقاط الضعف المحتملة. نقوم بفحص البنية التحتية والأنظمة والتطبيقات لتحديد الثغرات الأمنية وتقييم مستوى الخطر.",
    features: [
      "تحليل البنية التحتية والشبكات",
      "فحص التطبيقات والأنظمة",
      "تقييم سياسات الأمان",
      "تحديد نقاط الضعف والثغرات",
      "تقارير مفصلة بالمخاطر والتوصيات",
    ],
    href: "/services/risk-assessment",
    featured: true,
  },
  {
    id: "2",
    icon: "Users",
    title: "تدريب الموظفين",
    description: "برامج تدريبية متخصصة لرفع مستوى الوعي الأمني لدى الموظفين وتعزيز ثقافة الأمن السيبراني. نقدم تدريبات تفاعلية ومحاكاة لهجمات التصيد الاحتيالي.",
    features: [
      "دورات توعية أمنية للموظفين",
      "محاكاة هجمات التصيد الاحتيالي",
      "اختبارات وتقييمات دورية",
      "منصة تعليمية تفاعلية",
      "تقارير أداء وتحليل النتائج",
    ],
    href: "/services/employee-training",
    featured: false,
  }
]

export default async function ServicesPage() {
  // Create Supabase client with error handling
  let services = defaultServices;

  try {
    const supabase = createClient()

    // Fetch services from Supabase
    const { data: servicesData, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })

    // Log any errors for debugging
    if (error) {
      console.error("Error fetching services:", error)
    } else if (servicesData && servicesData.length > 0) {
      // Transform Supabase data to match our component needs
      services = servicesData.map(service => ({
        id: service.id,
        icon: service.icon || "Shield", // Provide default icon
        title: service.title,
        description: service.description,
        image: service.image,
        features: service.description.split('\n').filter(line => line.trim().length > 0).slice(0, 5),
        href: `/services/${service.id}`,
        featured: false, // Set the first one as featured later
      }))
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Unexpected error fetching services:", error)
    // Use default services in case of error
    services = defaultServices
  }

  // Set the first service as featured if we have services
  if (services.length > 0) {
    services[0].featured = true
  }

  const categories = [
    "الكل",
    "تقييم المخاطر",
    "التدريب",
    "الاختبار",
    "الاستجابة للحوادث",
    "حماية البيانات",
    "الدعم الفني",
  ]

  const featuredService = services.find(service => service.featured)

  return (
    <div className="flex min-h-screen flex-col bg-white" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            خدمات الأمن السيبراني
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mb-8">
            نقدم مجموعة شاملة من الخدمات المتخصصة في مجال الأمن السيبراني لحماية مؤسستك من التهديدات المتطورة
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category, index) =>
              index === 0 ? (
                <Link
                  key={index}
                  href={`/services/category/${category === "الكل" ? "" : category.toLowerCase()}`}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
                >
                  {category}
                </Link>
              ) : (
                <NavButton
                  key={index}
                  href={`/services/category/${category === "الكل" ? "" : category.toLowerCase()}`}
                >
                  {category}
                </NavButton>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Service */}
      {featuredService && (
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">خدمة مميزة</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                {featuredService.image ? (
                  <img
                    src={featuredService.image.startsWith('/uploads/')
                      ? `/api/image/${featuredService.image.replace('/uploads/', '')}?t=${Date.now()}`
                      : featuredService.image}
                    alt={featuredService.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Error loading featured service image: ${featuredService.image}`);
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                      // Try direct path as fallback
                      if (featuredService.image.startsWith('/uploads/')) {
                        e.currentTarget.src = featuredService.image + '?t=' + Date.now();
                      }
                    }}
                  />
                ) : (
                  <div className="h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">صورة الخدمة</span>
                  </div>
                )}
              </div>
              <div>
                <div className="mb-4">
                  <div className="mb-6">{iconMap[featuredService.icon] || <Shield className="h-16 w-16 text-purple-600" />}</div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    <Link href={featuredService.href} className="hover:text-purple-600 transition-colors">
                      {featuredService.title}
                    </Link>
                  </h3>
                  <p className="text-gray-700 mb-4">{featuredService.description}</p>
                  <Link
                    href={featuredService.href}
                    className="inline-block gradient-bg hover:opacity-90 text-white font-medium py-3 px-6 rounded-md"
                  >
                    اكتشف المزيد
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">جميع الخدمات</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.filter(service => !service.featured).map((service, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:border-purple-500 hover-card-effect">
                {service.image && (
                  <div className="relative h-48 w-full">
                    <img
                      src={service.image.startsWith('/uploads/')
                        ? `/api/image/${service.image.replace('/uploads/', '')}?t=${Date.now()}`
                        : service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Error loading service image: ${service.image}`);
                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                        // Try direct path as fallback
                        if (service.image.startsWith('/uploads/')) {
                          e.currentTarget.src = service.image + '?t=' + Date.now();
                        }
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-4 bg-purple-100 inline-block p-3 rounded-lg">
                    {iconMap[service.icon] || <Shield className="h-16 w-16 text-purple-600" />}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    <Link href={service.href} className="hover:text-purple-600 transition-colors">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm line-clamp-3">{service.description}</p>
                  <Link
                    href={service.href}
                    className="inline-block text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    اكتشف المزيد
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Updates Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">تحديثات الخدمات</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm p-6 hover-card-effect">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-md">
                  تحديث خدمة
                </div>
                <span className="text-xs text-gray-500 mr-3">أبريل 2023</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">تحسينات في خدمة تقييم المخاطر السيبرانية</h3>
              <p className="text-gray-700 mb-4">
                قمنا بتحديث منهجية تقييم المخاطر لتشمل تحليلاً أكثر شمولاً للتهديدات الناشئة وتقنيات الذكاء الاصطناعي.
              </p>
              <Link href="/services/risk-assessment" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                اقرأ المزيد
              </Link>
            </div>

            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm p-6 hover-card-effect">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-md">
                  خدمة جديدة
                </div>
                <span className="text-xs text-gray-500 mr-3">مارس 2023</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">إطلاق خدمة تدريب الموظفين المتقدمة</h3>
              <p className="text-gray-700 mb-4">
                أطلقنا خدمة جديدة لتدريب الموظفين تتضمن محاكاة متقدمة لهجمات التصيد الاحتيالي وتقنيات الهندسة الاجتماعية.
              </p>
              <Link href="/services/employee-training" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                اقرأ المزيد
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">هل تحتاج إلى مساعدة في اختيار الخدمة المناسبة؟</h2>
          <p className="text-gray-700 mb-6">فريقنا من الخبراء جاهز لمساعدتك في اختيار الحلول المناسبة لاحتياجات مؤسستك</p>
          <Button className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">تواصل معنا</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
