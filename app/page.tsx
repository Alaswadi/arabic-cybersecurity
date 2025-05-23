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
      <section className="py-16 bg-[#1a1c3a] border-t border-[#2f3365]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="dark-card p-6 rounded-lg border border-[#2f3365] relative overflow-hidden group hover:purple-glow transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="relative z-10">
                <p className="gradient-text font-bold text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">+85%</p>
                <p className="text-white">انخفاض في معدل الاختراق</p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-tl-full"></div>
            </div>
            <div className="dark-card p-6 rounded-lg border border-[#2f3365] relative overflow-hidden group hover:purple-glow transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="relative z-10">
                <p className="gradient-text font-bold text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">73%</p>
                <p className="text-white">انخفاض في معدل الضحايا</p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-tl-full"></div>
            </div>
            <div className="dark-card p-6 rounded-lg border border-[#2f3365] relative overflow-hidden group hover:purple-glow transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="relative z-10">
                <p className="gradient-text font-bold text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">+200</p>
                <p className="text-white">مؤسسة تم حمايتها</p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-tl-full"></div>
            </div>
            <div className="dark-card p-6 rounded-lg border border-[#2f3365] relative overflow-hidden group hover:purple-glow transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="relative z-10">
                <p className="gradient-text font-bold text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">+50,000</p>
                <p className="text-white">موظف تم تدريبهم</p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-tl-full"></div>
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
