import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Users, Lightbulb, Target, Award, ChevronRight } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "أحمد محمد",
      position: "المؤسس والرئيس التنفيذي",
      bio: "خبير في مجال الأمن السيبراني مع أكثر من 15 عامًا من الخبرة في حماية المؤسسات الكبرى من التهديدات السيبرانية.",
      image: "/placeholder-team-1.jpg",
    },
    {
      name: "سارة أحمد",
      position: "مديرة العمليات",
      bio: "متخصصة في إدارة العمليات الأمنية مع خبرة واسعة في تطوير استراتيجيات الأمن السيبراني للشركات.",
      image: "/placeholder-team-2.jpg",
    },
    {
      name: "محمد علي",
      position: "رئيس قسم الأبحاث",
      bio: "باحث متميز في مجال الأمن السيبراني مع العديد من المنشورات العلمية حول أحدث تقنيات الحماية.",
      image: "/placeholder-team-3.jpg",
    },
    {
      name: "فاطمة الزهراء",
      position: "مديرة تطوير الأعمال",
      bio: "خبيرة في تطوير الأعمال مع سجل حافل في بناء شراكات استراتيجية مع كبرى المؤسسات في المنطقة.",
      image: "/placeholder-team-4.jpg",
    },
  ]

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "الأمان",
      description: "نضع أمان عملائنا في مقدمة أولوياتنا، ونلتزم بتوفير أعلى مستويات الحماية لبياناتهم وأنظمتهم.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "التعاون",
      description: "نؤمن بأهمية العمل الجماعي والتعاون مع عملائنا لتطوير حلول أمنية تلبي احتياجاتهم الخاصة.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-purple-600" />,
      title: "الابتكار",
      description: "نسعى دائمًا لتطوير حلول مبتكرة تواكب التطورات المتسارعة في مجال التهديدات السيبرانية.",
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "التميز",
      description: "نلتزم بتقديم خدمات استثنائية تتجاوز توقعات عملائنا وتحقق أعلى معايير الجودة في الصناعة.",
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: "النزاهة",
      description: "نعمل بشفافية ونزاهة تامة مع عملائنا وشركائنا، ونلتزم بأعلى المعايير الأخلاقية في جميع تعاملاتنا.",
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
              من نحن
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              شركة رائدة في مجال الأمن السيبراني، نسعى لحماية المؤسسات من التهديدات الرقمية المتزايدة من خلال حلول متكاملة ومبتكرة.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                قصتنا
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  تأسست شركتنا في عام 2025 على يد مجموعة من خبراء الأمن السيبراني الذين أدركوا الحاجة المتزايدة لحلول أمنية متكاملة تحمي المؤسسات من التهديدات الرقمية المتطورة.
                </p>
                <p>
                  بدأنا رحلتنا بفريق صغير من المتخصصين، وسرعان ما نمت الشركة لتصبح واحدة من الشركات الرائدة في مجال الأمن السيبراني في المنطقة.
                </p>
                <p>
                  نفخر اليوم بخدمة عدد كبير من العملاء في مختلف القطاعات، بما في ذلك المؤسسات المالية والحكومية والشركات الكبرى، ونسعى دائمًا لتطوير حلولنا لمواكبة التحديات الأمنية المتجددة.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-lg overflow-hidden border border-gray-200 shadow-xl">
                <div className="h-80 bg-gray-100 flex items-center justify-center">
                  <img 
                    src="/phishsim_com.jpg" 
                    alt="صورة الشركة" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute top-8 -right-8 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg -z-10 opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              قيمنا
            </h2>
            <p className="text-gray-700">
              تعكس قيمنا التزامنا بتقديم أفضل الخدمات لعملائنا وبناء علاقات طويلة الأمد معهم.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-purple-500 transition-all duration-300 hover-card-effect">
                <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-[#1a1c3a] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              انضم إلى قائمة عملائنا المميزين
            </h2>
            <p className="text-gray-300 mb-8">
              نحن هنا لمساعدتك في حماية مؤسستك من التهديدات السيبرانية المتزايدة. تواصل معنا اليوم لمعرفة كيف يمكننا تقديم حلول أمنية مخصصة تناسب احتياجاتك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">
                <Link href="/contact">تواصل معنا</Link>
              </Button>
              <Button asChild variant="outline" className="border-[#2f3365] hover:bg-[#242850] px-6 py-6 text-lg h-auto">
                <Link href="/services">
                  <ChevronRight className="ml-2 h-5 w-5" />
                  استكشف خدماتنا
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
