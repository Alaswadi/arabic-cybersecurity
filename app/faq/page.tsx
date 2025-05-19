import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function FAQPage() {
  const faqCategories = [
    {
      name: "عام",
      questions: [
        {
          question: "ما هو Phish Simulator؟",
          answer: "Phish Simulator هي منصة متكاملة للأمن السيبراني متخصصة في محاكاة هجمات التصيد الاحتيالي وتدريب الموظفين على التعرف عليها وتجنبها. نقدم مجموعة شاملة من الخدمات الأمنية التي تساعد المؤسسات على حماية بياناتها وأنظمتها من التهديدات السيبرانية المختلفة."
        },
        {
          question: "كيف يمكنني البدء باستخدام خدماتكم؟",
          answer: "يمكنك البدء بالتواصل معنا من خلال نموذج الاتصال أو الاتصال المباشر بفريق المبيعات. سنقوم بتحديد موعد لمناقشة احتياجاتك وتقديم عرض مخصص يناسب متطلبات مؤسستك. بعد الموافقة على العرض، سنبدأ في تنفيذ الخدمات المطلوبة وفقًا للجدول الزمني المتفق عليه."
        },
        {
          question: "هل تقدمون خدمات للشركات الصغيرة والمتوسطة؟",
          answer: "نعم، نقدم باقات مخصصة للشركات الصغيرة والمتوسطة تناسب ميزانياتها واحتياجاتها الأمنية. نؤمن بأن جميع المؤسسات بغض النظر عن حجمها تحتاج إلى حماية من التهديدات السيبرانية. لدينا حلول مرنة يمكن تكييفها لتناسب احتياجات وميزانية أي مؤسسة."
        },
      ]
    },
    {
      name: "الخدمات",
      questions: [
        {
          question: "ما هي خدمات الأمن السيبراني التي تقدمونها؟",
          answer: "نقدم مجموعة واسعة من خدمات الأمن السيبراني، بما في ذلك: تقييم المخاطر السيبرانية، محاكاة هجمات التصيد الاحتيالي، تدريب الموظفين على الوعي الأمني، اختبار الاختراق، الاستجابة للحوادث، حماية البيانات، والدعم الفني المستمر. يمكنك الاطلاع على تفاصيل كل خدمة في صفحة الخدمات على موقعنا."
        },
        {
          question: "كم من الوقت يستغرق تنفيذ الحلول الأمنية؟",
          answer: "تختلف مدة التنفيذ حسب نوع الخدمة وحجم المؤسسة. عادة ما تستغرق عملية التقييم الأمني من 1-2 أسبوع، بينما قد يستغرق تنفيذ الحلول الشاملة من 4-8 أسابيع. نقوم بتحديد جدول زمني مفصل لكل مشروع بعد تقييم احتياجات العميل ونطاق العمل المطلوب."
        },
        {
          question: "هل تقدمون خدمات الدعم الفني بعد تنفيذ الحلول؟",
          answer: "نعم، نقدم خدمات دعم فني على مدار الساعة لجميع عملائنا. كما نوفر باقات صيانة دورية تشمل تحديثات الأنظمة ومراقبة الأداء وتقديم التقارير الدورية. نلتزم بضمان استمرارية عمل الحلول الأمنية بكفاءة وفعالية على المدى الطويل."
        },
      ]
    },
    {
      name: "التدريب",
      questions: [
        {
          question: "كيف تتم عملية تدريب الموظفين على الوعي الأمني؟",
          answer: "تتضمن عملية تدريب الموظفين عدة مراحل: تقييم مستوى الوعي الحالي، تصميم برنامج تدريبي مخصص، تنفيذ التدريب (عبر الإنترنت أو في الموقع)، محاكاة هجمات التصيد الاحتيالي لاختبار المعرفة المكتسبة، تقييم النتائج وتقديم التوصيات. نقدم أيضًا تدريبات تنشيطية دورية لضمان استمرارية الوعي الأمني."
        },
        {
          question: "هل التدريب متاح باللغة العربية؟",
          answer: "نعم، نقدم جميع برامجنا التدريبية باللغة العربية والإنجليزية. نحرص على توفير محتوى تدريبي عالي الجودة يناسب الثقافة المحلية ويتضمن أمثلة واقعية من بيئة العمل في المنطقة العربية. يمكن أيضًا تخصيص المحتوى ليتناسب مع احتياجات محددة للمؤسسة."
        },
        {
          question: "كم مرة يجب تدريب الموظفين على الوعي الأمني؟",
          answer: "نوصي بإجراء تدريب شامل للموظفين مرة واحدة على الأقل سنويًا، مع تدريبات تنشيطية قصيرة كل 3-4 أشهر. كما نوصي بإجراء تدريبات إضافية عند ظهور تهديدات جديدة أو عند تغيير السياسات الأمنية للمؤسسة. التدريب المستمر ضروري لمواكبة التطور المستمر في تقنيات الهجمات السيبرانية."
        },
      ]
    },
    {
      name: "محاكاة التصيد الاحتيالي",
      questions: [
        {
          question: "ما هي محاكاة هجمات التصيد الاحتيالي؟",
          answer: "محاكاة هجمات التصيد الاحتيالي هي عملية إرسال رسائل بريد إلكتروني مشابهة لهجمات التصيد الحقيقية (ولكن آمنة) إلى موظفي المؤسسة لاختبار مدى وعيهم الأمني وقدرتهم على التعرف على هذه الهجمات. الهدف هو تحديد نقاط الضعف في الوعي الأمني للموظفين وتوجيه التدريب بناءً على النتائج."
        },
        {
          question: "هل محاكاة هجمات التصيد الاحتيالي آمنة؟",
          answer: "نعم، جميع عمليات المحاكاة التي نقوم بها آمنة تمامًا ولا تشكل أي خطر على أنظمة المؤسسة أو بياناتها. نستخدم بيئة محاكاة معزولة ونتبع بروتوكولات أمنية صارمة لضمان عدم تسرب أي بيانات حساسة. كما نقوم بالتنسيق الكامل مع فريق تكنولوجيا المعلومات في المؤسسة قبل إجراء أي محاكاة."
        },
        {
          question: "كيف تساعد محاكاة هجمات التصيد الاحتيالي في تحسين الأمن السيبراني؟",
          answer: "تساعد محاكاة هجمات التصيد الاحتيالي في تحسين الأمن السيبراني من خلال: تحديد الموظفين الذين يحتاجون إلى تدريب إضافي، قياس فعالية برامج التوعية الأمنية، تعزيز ثقافة الأمن السيبراني في المؤسسة، تقليل مخاطر الاختراق الناتجة عن الهندسة الاجتماعية، وتوفير بيانات قابلة للقياس لتتبع التحسن في الوعي الأمني مع مرور الوقت."
        },
      ]
    },
    {
      name: "الاشتراكات والأسعار",
      questions: [
        {
          question: "ما هي خطط الاشتراك المتاحة؟",
          answer: "نقدم ثلاث خطط اشتراك رئيسية: الأساسية، المتقدمة، والاحترافية. تختلف كل خطة في نطاق الخدمات المقدمة وعدد المستخدمين المدعومين. كما نقدم خططًا مخصصة للمؤسسات الكبيرة التي لديها احتياجات خاصة. يمكنك الاطلاع على تفاصيل كل خطة والأسعار من خلال التواصل مع فريق المبيعات."
        },
        {
          question: "هل هناك فترة تجريبية مجانية؟",
          answer: "نعم، نقدم فترة تجريبية مجانية لمدة 14 يومًا للمؤسسات التي ترغب في تجربة خدماتنا قبل الاشتراك. خلال الفترة التجريبية، يمكنك الوصول إلى مجموعة محددة من الميزات والخدمات لتقييم مدى ملاءمتها لاحتياجات مؤسستك. للاستفادة من الفترة التجريبية، يرجى التواصل مع فريق المبيعات."
        },
        {
          question: "هل يمكنني تغيير خطة الاشتراك لاحقًا؟",
          answer: "نعم، يمكنك ترقية أو تخفيض خطة الاشتراك في أي وقت وفقًا لاحتياجات مؤسستك المتغيرة. عند الترقية، سيتم احتساب الفرق في السعر بشكل تناسبي للفترة المتبقية من الاشتراك الحالي. نحن نؤمن بأهمية المرونة ونسعى دائمًا لتلبية احتياجات عملائنا المتطورة."
        },
      ]
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
              الأسئلة الشائعة
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              إجابات على الأسئلة الأكثر شيوعًا حول خدماتنا وكيفية عملنا
            </p>
            <div className="max-w-xl mx-auto relative">
              <Input
                placeholder="ابحث عن سؤال..."
                className="bg-[#242850] border-[#2f3365] text-white pr-10 py-6"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Categories */}
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {faqCategories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className={index === 0 ? "gradient-bg hover:opacity-90" : "border-[#2f3365] bg-[#1a1c3a] text-white hover:bg-[#242850]"}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-6">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 border-r-4 border-purple-600 pr-4">
                    {category.name}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item, itemIndex) => (
                      <div key={itemIndex} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-white p-6">
                          <div className="flex justify-between items-center cursor-pointer">
                            <h3 className="text-lg font-bold text-gray-900">{item.question}</h3>
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="mt-4 text-gray-700">
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              لم تجد إجابة لسؤالك؟
            </h2>
            <p className="text-gray-700 mb-8">
              فريقنا جاهز للإجابة على جميع استفساراتك. تواصل معنا وسنرد عليك في أقرب وقت ممكن.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">
                <Link href="/contact">تواصل معنا</Link>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-6 text-lg h-auto">
                <Link href="/contact">
                  الدعم الفني
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
