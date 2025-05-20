import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Shield, Users, Lock, Bell, FileText, Headphones, Server, Database, Wifi, Globe, Mail, AlertTriangle, BarChart } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { StorageImage } from "@/components/ui/storage-image"
import { FallbackImage } from "@/components/ui/fallback-image"

export const revalidate = 3600 // Revalidate every hour

// Map icon strings to Lucide React components
const iconMap: Record<string, React.ReactElement<any>> = {
  Shield: <Shield className="h-8 w-8 text-white" />,
  Users: <Users className="h-8 w-8 text-white" />,
  Lock: <Lock className="h-8 w-8 text-white" />,
  Bell: <Bell className="h-8 w-8 text-white" />,
  FileText: <FileText className="h-8 w-8 text-white" />,
  Headphones: <Headphones className="h-8 w-8 text-white" />,
  Server: <Server className="h-8 w-8 text-white" />,
  Database: <Database className="h-8 w-8 text-white" />,
  Wifi: <Wifi className="h-8 w-8 text-white" />,
  Globe: <Globe className="h-8 w-8 text-white" />,
  Mail: <Mail className="h-8 w-8 text-white" />,
  AlertTriangle: <AlertTriangle className="h-8 w-8 text-white" />,
  BarChart: <BarChart className="h-8 w-8 text-white" />,
}

// Function to format service description as HTML
function formatServiceDescription(description: string): string {
  if (!description) return '';

  // Split the description into paragraphs
  const paragraphs = description.split('\n').filter(p => p.trim().length > 0);

  // If there are no paragraphs, return empty string
  if (paragraphs.length === 0) return '';

  // Create HTML structure
  let html = `
    <h2 class="text-2xl font-bold mb-4">نظرة عامة</h2>
    <p class="mb-6">${paragraphs[0]}</p>
  `;

  // Add more sections if we have more paragraphs
  if (paragraphs.length > 1) {
    html += `
      <h2 class="text-2xl font-bold mb-4">كيف نعمل</h2>
      <p class="mb-6">${paragraphs[1]}</p>
    `;
  }

  // Add features section
  const features = paragraphs.slice(2, 7);
  if (features.length > 0) {
    html += `
      <h2 class="text-2xl font-bold mb-4">المميزات الرئيسية</h2>
      <ul class="list-disc pr-6 mb-6 space-y-2">
        ${features.map(feature => `<li>${feature}</li>`).join('\n')}
      </ul>
    `;
  }

  // Add why choose us section
  if (paragraphs.length > 7) {
    html += `
      <h2 class="text-2xl font-bold mb-4">لماذا تختار خدمتنا</h2>
      <p class="mb-6">${paragraphs[7]}</p>
    `;
  }

  return html;
}

// Default service in case Supabase fetch fails
const defaultService = {
  id: "risk-assessment",
  title: "تقييم المخاطر السيبرانية",
  icon: "Shield",
  description: `
    <h2 class="text-2xl font-bold mb-4">نظرة عامة</h2>
    <p class="mb-6">تقييم المخاطر السيبرانية هو عملية تحليل شاملة للمخاطر السيبرانية في مؤسستك وتحديد نقاط الضعف المحتملة. نقوم بفحص البنية التحتية والأنظمة والتطبيقات لتحديد الثغرات الأمنية وتقييم مستوى الخطر.</p>

    <h2 class="text-2xl font-bold mb-4">كيف نعمل</h2>
    <p class="mb-6">يقوم فريقنا من الخبراء المتخصصين بإجراء تقييم شامل للمخاطر السيبرانية في مؤسستك باستخدام منهجيات متقدمة ومعايير عالمية. نقوم بتحليل البنية التحتية والشبكات والأنظمة والتطبيقات لتحديد نقاط الضعف والثغرات الأمنية المحتملة.</p>

    <h2 class="text-2xl font-bold mb-4">المميزات الرئيسية</h2>
    <ul class="list-disc pr-6 mb-6 space-y-2">
      <li>تحليل البنية التحتية والشبكات</li>
      <li>فحص التطبيقات والأنظمة</li>
      <li>تقييم سياسات الأمان</li>
      <li>تحديد نقاط الضعف والثغرات</li>
      <li>تقارير مفصلة بالمخاطر والتوصيات</li>
    </ul>

    <h2 class="text-2xl font-bold mb-4">لماذا تختار خدمتنا</h2>
    <p class="mb-6">نحن نتميز بفريق من الخبراء المتخصصين في مجال الأمن السيبراني مع خبرة واسعة في تقييم المخاطر السيبرانية للمؤسسات من مختلف الأحجام والقطاعات. نستخدم أحدث التقنيات والمنهجيات لضمان تقييم شامل ودقيق للمخاطر السيبرانية في مؤسستك.</p>
  `,
};

export default async function ServiceDetailPage(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  const supabase = createClient();

  let service;
  let otherServices = [];

  try {
    // Try to fetch service by ID or slug
    let serviceData;
    let error;

    // First try to fetch by ID
    const { data, error: idError } = await supabase
      .from("services")
      .select("*")
      .eq("id", params.slug)
      .maybeSingle();

    if (data) {
      serviceData = data;
    } else {
      // If not found by ID, try to fetch by slug-friendly ID
      // This handles cases where the ID might be a string like "data-protection"
      const { data: slugData, error: slugError } = await supabase
        .from("services")
        .select("*")
        .ilike("id", params.slug)
        .maybeSingle();

      if (slugData) {
        serviceData = slugData;
      } else {
        error = slugError || idError;
      }
    }

    if (error || !serviceData) {
      console.error("Error fetching service:", error);
      notFound();
    }

    // Format the service data
    service = {
      id: serviceData.id,
      title: serviceData.title,
      icon: serviceData.icon || "Shield",
      image: serviceData.image || null,
      description: serviceData.description ? formatServiceDescription(serviceData.description) : defaultService.description,
    };

    // Fetch other services for "Other Services" section
    const { data: otherServicesData } = await supabase
      .from("services")
      .select("*")
      .neq("id", params.slug)
      .limit(3);

    // Format other services
    otherServices = otherServicesData?.map(s => ({
      slug: s.id,
      title: s.title,
      icon: s.icon || "Shield",
    })) || [];
  } catch (error) {
    console.error("Error in service detail page:", error);
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-white" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/services" className="text-gray-600 hover:text-gray-900 flex items-center">
              <ChevronRight className="h-4 w-4 ml-1" />
              العودة إلى الخدمات
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
              {iconMap[service.icon] || <Shield className="h-8 w-8 text-white" />}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{service.title}</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {service.image && (
                  <div className="relative h-64 w-full">
                    <FallbackImage
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: service.description }} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">هل تريد معرفة المزيد؟</h2>
                <p className="text-gray-700 mb-6">
                  فريقنا جاهز لتقديم المزيد من المعلومات والإجابة على استفساراتك حول كيفية الاستفادة من هذه الخدمة.
                </p>
                <div className="space-y-3">
                  <Button className="w-full gradient-bg hover:opacity-90">تواصل معنا</Button>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                    طلب عرض سعر
                  </Button>
                </div>
              </div>

              {/* Other Services */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">خدمات أخرى</h2>
                <div className="space-y-4">
                  {otherServices.map((otherService, index) => (
                    <Link
                      key={index}
                      href={`/services/${otherService.slug}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {iconMap[otherService.icon] ? React.cloneElement(iconMap[otherService.icon], { className: "h-5 w-5 text-purple-600" }) : <Shield className="h-5 w-5 text-purple-600" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-md text-gray-900">{otherService.title}</h3>
                        <p className="text-purple-600 text-sm mt-1">عرض التفاصيل</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">محتوى ذو صلة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:border-purple-500 shadow-sm hover-card-effect">
              <div className="p-6">
                <span className="inline-block bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-md mb-4">
                  مقال
                </span>
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    كيفية حماية مؤسستك من هجمات التصيد الاحتيالي
                  </Link>
                </h3>
                <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                  تعرف على أحدث التقنيات والاستراتيجيات لحماية مؤسستك من هجمات التصيد الاحتيالي المتطورة.
                </p>
                <Link href="#" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  اقرأ المزيد
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:border-purple-500 shadow-sm hover-card-effect">
              <div className="p-6">
                <span className="inline-block bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-md mb-4">
                  دليل
                </span>
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    أفضل الممارسات لتأمين البنية التحتية الرقمية
                  </Link>
                </h3>
                <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                  دليل شامل لأفضل الممارسات والاستراتيجيات لتأمين البنية التحتية الرقمية في مؤسستك.
                </p>
                <Link href="#" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  اقرأ المزيد
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:border-purple-500 shadow-sm hover-card-effect">
              <div className="p-6">
                <span className="inline-block bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-md mb-4">
                  ندوة
                </span>
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  <Link href="#" className="hover:text-purple-600 transition-colors">
                    ندوة عبر الإنترنت: مستقبل الأمن السيبراني
                  </Link>
                </h3>
                <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                  انضم إلينا في ندوة عبر الإنترنت لمناقشة مستقبل الأمن السيبراني والتحديات الناشئة.
                </p>
                <Link href="#" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  سجل الآن
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Services */}
          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 text-gray-700">
                <ChevronRight className="ml-2 h-4 w-4" />
                العودة إلى جميع الخدمات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
