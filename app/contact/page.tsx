import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, MessageSquare, Users } from "lucide-react"

export default function ContactPage() {
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

  const faqItems = [
    {
      question: "كيف يمكنني البدء باستخدام خدماتكم؟",
      answer: "يمكنك البدء بالتواصل معنا من خلال نموذج الاتصال أو الاتصال المباشر بفريق المبيعات. سنقوم بتحديد موعد لمناقشة احتياجاتك وتقديم عرض مخصص يناسب متطلبات مؤسستك.",
    },
    {
      question: "هل تقدمون خدمات للشركات الصغيرة والمتوسطة؟",
      answer: "نعم، نقدم باقات مخصصة للشركات الصغيرة والمتوسطة تناسب ميزانياتها واحتياجاتها الأمنية. نؤمن بأن جميع المؤسسات بغض النظر عن حجمها تحتاج إلى حماية من التهديدات السيبرانية.",
    },
    {
      question: "كم من الوقت يستغرق تنفيذ الحلول الأمنية؟",
      answer: "تختلف مدة التنفيذ حسب نوع الخدمة وحجم المؤسسة. عادة ما تستغرق عملية التقييم الأمني من 1-2 أسبوع، بينما قد يستغرق تنفيذ الحلول الشاملة من 4-8 أسابيع.",
    },
    {
      question: "هل تقدمون خدمات الدعم الفني بعد تنفيذ الحلول؟",
      answer: "نعم، نقدم خدمات دعم فني على مدار الساعة لجميع عملائنا. كما نوفر باقات صيانة دورية تشمل تحديثات الأنظمة ومراقبة الأداء وتقديم التقارير الدورية.",
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
              تواصل معنا
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              نحن هنا للإجابة على استفساراتك وتقديم المساعدة التي تحتاجها. لا تتردد في التواصل معنا.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                أرسل لنا رسالة
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الكامل
                    </label>
                    <Input
                      id="name"
                      placeholder="أدخل اسمك الكامل"
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الشركة
                  </label>
                  <Input
                    id="company"
                    placeholder="أدخل اسم شركتك"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    الموضوع
                  </label>
                  <Input
                    id="subject"
                    placeholder="أدخل موضوع الرسالة"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    الرسالة
                  </label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا..."
                    className="bg-white border-gray-300 text-gray-900 min-h-[150px]"
                  />
                </div>
                <Button className="gradient-bg hover:opacity-90 w-full py-6 text-lg h-auto">
                  إرسال الرسالة
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
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

              {/* Map Placeholder */}
              <div className="rounded-lg overflow-hidden border border-gray-200 h-64 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-2xl">خريطة الموقع</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              الأسئلة الشائعة
            </h2>
            <p className="text-gray-700">
              إليك بعض الإجابات على الأسئلة الأكثر شيوعًا. إذا لم تجد إجابة لسؤالك، لا تتردد في التواصل معنا.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-3 text-gray-900">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1a1c3a] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#242850] p-8 rounded-lg border border-[#2f3365] flex flex-col items-center text-center">
                <div className="bg-purple-600/20 p-4 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">تحتاج إلى مساعدة فورية؟</h3>
                <p className="text-gray-300 mb-6">فريق الدعم الفني متاح على مدار الساعة للإجابة على استفساراتك.</p>
                <Button className="gradient-bg hover:opacity-90 w-full">اتصل بالدعم الفني</Button>
              </div>
              <div className="bg-[#242850] p-8 rounded-lg border border-[#2f3365] flex flex-col items-center text-center">
                <div className="bg-purple-600/20 p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">تريد معرفة المزيد عن خدماتنا؟</h3>
                <p className="text-gray-300 mb-6">احجز موعدًا مع أحد مستشارينا لمناقشة احتياجاتك الأمنية.</p>
                <Button className="gradient-bg hover:opacity-90 w-full">احجز موعدًا</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
