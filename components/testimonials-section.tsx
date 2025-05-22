import Image from "next/image"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      content:
        "منصة Phish Simulator غيرت طريقة تعامل فريقنا مع الأمن السيبراني. التدريب التفاعلي ساعد في رفع مستوى الوعي الأمني لدى الموظفين بشكل كبير.",
      author: "محمد العتيبي",
      position: "مدير تكنولوجيا المعلومات",
      company: "شركة الاتصالات المتقدمة",
      image: "/placeholder-testimonial-1.jpg",
      rating: 5,
    },
    {
      content:
        "بفضل خدمات Phish Simulator، تمكنا من تحديد وإصلاح العديد من نقاط الضعف في أنظمتنا قبل أن يتم استغلالها. فريق الدعم الفني ممتاز ويستجيب بسرعة لاستفساراتنا.",
      author: "سارة الخالدي",
      position: "رئيس قسم الأمن السيبراني",
      company: "بنك الاستثمار الوطني",
      image: "/placeholder-testimonial-2.jpg",
      rating: 5,
    },
    {
      content:
        "نحن نستخدم منصة Phish Simulator منذ أكثر من عام، وقد لاحظنا انخفاضًا كبيرًا في حوادث الأمن السيبراني. التقارير التحليلية المفصلة تساعدنا في اتخاذ قرارات أفضل.",
      author: "أحمد الشمري",
      position: "المدير التنفيذي",
      company: "مجموعة الخليج للتأمين",
      image: "/placeholder-testimonial-3.jpg",
      rating: 4,
    },
  ]

  return (
    <section className="py-20 bg-[#1a1c3a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">ماذا يقول عملاؤنا</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            نفتخر بثقة عملائنا ونسعى دائمًا لتقديم أفضل الحلول والخدمات التي تلبي احتياجاتهم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="dark-card rounded-lg p-6 transition-all duration-300 hover:translate-y-[-5px] border border-[#2f3365] relative"
            >
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%] rotate-45 bg-gradient-to-r from-purple-600 to-blue-600 text-white w-24 h-24"></div>
              </div>
              <div className="flex mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <div className="bg-[#242850] p-4 rounded-lg mb-6 relative">
                <div className="absolute bottom-0 left-6 transform translate-y-[50%] rotate-45 bg-[#242850] w-4 h-4"></div>
                <p className="text-white mb-0 italic">"{testimonial.content}"</p>
              </div>
              <div className="flex items-center mt-8">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-500">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.author}</h4>
                  <p className="text-sm text-purple-300">
                    {testimonial.position}, <span className="text-gray-300">{testimonial.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
