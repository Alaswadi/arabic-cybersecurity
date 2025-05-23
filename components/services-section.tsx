import { Button } from "@/components/ui/button"
import { Shield, Users, Lock, Bell, FileText, Headphones, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

// Default services in case Supabase fetch fails
const defaultServices = [
  {
    icon: <Shield className="h-10 w-10 text-purple-500" />,
    title: "تقييم المخاطر السيبرانية",
    description: "تحليل شامل للمخاطر السيبرانية في مؤسستك وتحديد نقاط الضعف المحتملة",
    href: "/services/risk-assessment",
    slug: "risk-assessment",
  },
  {
    icon: <Users className="h-10 w-10 text-purple-500" />,
    title: "تدريب الموظفين",
    description: "برامج تدريبية متخصصة لرفع مستوى الوعي الأمني لدى الموظفين وتعزيز ثقافة الأمن السيبراني",
    href: "/services/employee-training",
    slug: "employee-training",
  },
  {
    icon: <Lock className="h-10 w-10 text-purple-500" />,
    title: "اختبار الاختراق",
    description: "اختبارات محاكاة للهجمات السيبرانية لتحديد نقاط الضعف في أنظمتك قبل استغلالها من قبل المهاجمين",
    href: "/services/penetration-testing",
    slug: "penetration-testing",
  },
  {
    icon: <Bell className="h-10 w-10 text-purple-500" />,
    title: "الاستجابة للحوادث",
    description: "خدمات استجابة سريعة للحوادث السيبرانية للحد من الأضرار واستعادة العمليات بسرعة",
    href: "/services/incident-response",
    slug: "incident-response",
  },
  {
    icon: <FileText className="h-10 w-10 text-purple-500" />,
    title: "حماية البيانات",
    description: "حلول متكاملة لحماية البيانات الحساسة والامتثال للمعايير التنظيمية",
    href: "/services/data-protection",
    slug: "data-protection",
  },
  {
    icon: <Headphones className="h-10 w-10 text-purple-500" />,
    title: "الدعم الفني المستمر",
    description: "دعم فني على مدار الساعة لضمان استمرارية الأعمال وحماية أنظمتك",
    href: "/services/technical-support",
    slug: "technical-support",
  },
]

// Map service slugs to icons
const serviceIcons: Record<string, JSX.Element> = {
  "risk-assessment": <Shield className="h-10 w-10 text-purple-500" />,
  "employee-training": <Users className="h-10 w-10 text-purple-500" />,
  "penetration-testing": <Lock className="h-10 w-10 text-purple-500" />,
  "incident-response": <Bell className="h-10 w-10 text-purple-500" />,
  "data-protection": <FileText className="h-10 w-10 text-purple-500" />,
  "technical-support": <Headphones className="h-10 w-10 text-purple-500" />,
}

export async function ServicesSection() {
  // Initialize with default services
  let services = defaultServices;

  try {
    // Use Supabase client directly in server component
    const supabase = createClient();

    // Fetch services from Supabase with cache-busting options
    const { data: servicesData, error } = await supabase
      .from("services")
      .select("*")
      .limit(6);

    // Log any errors for debugging
    if (error) {
      console.error("Error fetching services for homepage:", error);
    } else if (servicesData && servicesData.length > 0) {
      // Transform Supabase data to match our component needs
      services = servicesData.map((service: any) => {
        const slug = service.slug || "default-service";
        return {
          icon: serviceIcons[slug] || <Shield className="h-10 w-10 text-purple-500" />,
          title: service.title || "عنوان الخدمة",
          description: service.short_description ||
            (service.description ? service.description.replace(/<[^>]*>/g, '').substring(0, 150) + (service.description.length > 150 ? '...' : '') : "وصف الخدمة"),
          href: `/services/${service.slug}`,
          slug: service.slug,
        };
      });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Unexpected error fetching services for homepage:", error);
    // Use default services in case of error
  }

  return (
    <section className="py-20 bg-[#1a1c3a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white/90">خدماتنا</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات المصممة خصيصًا لتعزيز الأمن السيبراني لمؤسستك وحماية بياناتك من التهديدات المتطورة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="dark-card rounded-lg p-6 transition-all duration-300 hover:translate-y-[-5px] hover:purple-glow border border-[#2f3365] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
              <div className="mb-4 bg-[#242850] p-3 inline-block rounded-lg">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
              <p className="text-gray-300 mb-4">{service.description}</p>
              <Link href={service.href} className="text-purple-400 hover:text-purple-300 inline-flex items-center bg-[#242850] px-3 py-1 rounded-md">
                اقرأ المزيد <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">
            <Link href="/services">استكشاف جميع الخدمات</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
