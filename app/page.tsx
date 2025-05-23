import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { ServicesSection } from "@/components/services-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { BlogSection } from "@/components/blog-section"
import { CTASection } from "@/components/cta-section"

// Set dynamic rendering with frequent revalidation
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-20 bg-[#1a1c3a] border-t border-[#2f3365] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-purple-600/20 blur-[100px]"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-blue-600/20 blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              نتائج <span className="gradient-text">مثبتة</span> وموثوقة
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              أرقام حقيقية تعكس تأثير حلولنا في تعزيز الأمن السيبراني للمؤسسات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="dark-card p-8 rounded-xl border border-[#2f3365] relative overflow-hidden group hover:purple-glow transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-black mb-4 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white/90">85</span>
                  <span className="text-white/90 text-4xl">%+</span>
                </div>
                <p className="text-white font-semibold text-lg">انخفاض في معدل الاختراق</p>
                <p className="text-white/60 text-sm mt-2">مقارنة بالفترة السابقة</p>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-purple-500/10 rounded-tl-full"></div>
            </div>

            <div className="dark-card p-8 rounded-xl border border-[#2f3365] relative overflow-hidden group hover:purple-glow transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-black mb-4 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white/90">73</span>
                  <span className="text-white/90 text-4xl">%</span>
                </div>
                <p className="text-white font-semibold text-lg">انخفاض في معدل الضحايا</p>
                <p className="text-white/60 text-sm mt-2">للهجمات الإلكترونية</p>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/10 rounded-tl-full"></div>
            </div>

            <div className="dark-card p-8 rounded-xl border border-[#2f3365] relative overflow-hidden group hover:purple-glow transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-green-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-black mb-4 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white/90">200</span>
                  <span className="text-white/90 text-4xl">+</span>
                </div>
                <p className="text-white font-semibold text-lg">مؤسسة تم حمايتها</p>
                <p className="text-white/60 text-sm mt-2">عبر منطقة الشرق الأوسط</p>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-tl-full"></div>
            </div>

            <div className="dark-card p-8 rounded-xl border border-[#2f3365] relative overflow-hidden group hover:purple-glow transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-purple-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-black mb-4 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white/90">50K</span>
                  <span className="text-white/90 text-4xl">+</span>
                </div>
                <p className="text-white font-semibold text-lg">موظف تم تدريبهم</p>
                <p className="text-white/60 text-sm mt-2">على أفضل ممارسات الأمان</p>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-green-500/10 rounded-tl-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
