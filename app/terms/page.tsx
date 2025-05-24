import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-[#1a1c3a] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              شروط الاستخدام
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              يرجى قراءة شروط الاستخدام هذه بعناية قبل استخدام خدماتنا
            </p>
            <div className="text-sm text-gray-400">
              آخر تحديث: 1 يونيو 2023
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">مقدمة</h2>
              <p>
                مرحبًا بك في Phish Simulator. تحكم شروط الاستخدام هذه ("الشروط") استخدامك لموقعنا الإلكتروني وخدماتنا المقدمة من خلاله.
              </p>
              <p>
                باستخدامك لموقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على أي جزء من هذه الشروط، فيرجى عدم استخدام موقعنا أو خدماتنا.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">تعريفات</h2>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  <strong>"الشركة"، "نحن"، "لنا"</strong> تشير إلى Phish Simulator.
                </li>
                <li>
                  <strong>"الموقع"</strong> يشير إلى موقع Phish Simulator الإلكتروني.
                </li>
                <li>
                  <strong>"الخدمات"</strong> تشير إلى جميع الخدمات التي تقدمها Phish Simulator، بما في ذلك على سبيل المثال لا الحصر، محاكاة هجمات التصيد الاحتيالي، تدريب الموظفين، تقييم المخاطر السيبرانية، وغيرها.
                </li>
                <li>
                  <strong>"المستخدم"، "أنت"، "الخاص بك"</strong> تشير إلى الشخص أو المؤسسة التي تستخدم الموقع أو الخدمات.
                </li>
                <li>
                  <strong>"المحتوى"</strong> يشير إلى جميع المعلومات والبيانات والنصوص والصور والرسومات والفيديوهات والمواد الأخرى التي يتم عرضها على الموقع أو من خلال الخدمات.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">استخدام الخدمات</h2>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. حقوق الاستخدام</h3>
              <p>
                نمنحك ترخيصًا محدودًا وغير حصري وغير قابل للتحويل لاستخدام الخدمات وفقًا لهذه الشروط والاتفاقيات الأخرى المبرمة بينك وبين الشركة.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">2. قيود الاستخدام</h3>
              <p>
                أنت توافق على عدم:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>استخدام الخدمات لأي غرض غير قانوني أو محظور بموجب هذه الشروط.</li>
                <li>انتهاك أي قوانين أو لوائح محلية أو وطنية أو دولية.</li>
                <li>محاولة الوصول غير المصرح به إلى أنظمتنا أو شبكاتنا.</li>
                <li>استخدام الخدمات بطريقة قد تضر بالموقع أو تعطل توفر الخدمات.</li>
                <li>نسخ أو تعديل أو توزيع أو بيع أو تأجير أي جزء من الخدمات دون إذن كتابي صريح منا.</li>
                <li>استخدام الخدمات لإرسال محتوى غير مرغوب فيه أو مسيء أو تشهيري أو غير قانوني.</li>
              </ul>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">3. حسابات المستخدمين</h3>
              <p>
                قد تتطلب بعض الخدمات إنشاء حساب. أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تحدث تحت حسابك. يجب عليك إخطارنا فورًا بأي استخدام غير مصرح به لحسابك.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">المحتوى والملكية الفكرية</h2>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. محتوى المستخدم</h3>
              <p>
                قد تسمح لك بعض الخدمات بتقديم محتوى. أنت تحتفظ بجميع حقوق الملكية الفكرية في المحتوى الذي تقدمه، ولكنك تمنحنا ترخيصًا عالميًا وغير حصري وخاليًا من حقوق الملكية لاستخدام هذا المحتوى لأغراض تقديم الخدمات.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">2. محتوى الشركة</h3>
              <p>
                جميع المحتوى المقدم من خلال الخدمات، باستثناء محتوى المستخدم، هو ملك للشركة أو مرخصيها ومحمي بموجب قوانين حقوق النشر والعلامات التجارية وغيرها من قوانين الملكية الفكرية.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">الاشتراكات والمدفوعات</h2>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. الرسوم والفواتير</h3>
              <p>
                قد تتطلب بعض الخدمات دفع رسوم. ستكون الرسوم المطبقة موضحة في الاتفاقية المبرمة بينك وبين الشركة. أنت توافق على دفع جميع الرسوم المستحقة في الوقت المحدد.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">2. التغييرات في الرسوم</h3>
              <p>
                نحتفظ بالحق في تغيير رسومنا في أي وقت. سنقدم إشعارًا معقولًا بأي تغييرات في الرسوم قبل أن تصبح سارية المفعول.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">3. الإلغاء والاسترداد</h3>
              <p>
                يمكنك إلغاء اشتراكك في أي وقت. تخضع سياسات الاسترداد للشروط المحددة في الاتفاقية المبرمة بينك وبين الشركة.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">إخلاء المسؤولية والتعويض</h2>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. إخلاء المسؤولية</h3>
              <p>
                يتم تقديم الخدمات "كما هي" و"كما هي متاحة" دون أي ضمانات من أي نوع، صريحة أو ضمنية. لا نقدم أي ضمانات بأن الخدمات ستكون غير منقطعة أو خالية من الأخطاء أو آمنة.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">2. حدود المسؤولية</h3>
              <p>
                لن تكون الشركة مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، بما في ذلك خسارة الأرباح أو البيانات، الناشئة عن استخدامك للخدمات.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">3. التعويض</h3>
              <p>
                أنت توافق على تعويض الشركة وحمايتها من أي مطالبات أو مسؤوليات أو نفقات تنشأ عن استخدامك للخدمات أو انتهاكك لهذه الشروط.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">التغييرات والإنهاء</h2>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. التغييرات في الشروط</h3>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطارك بأي تغييرات جوهرية قبل أن تصبح سارية المفعول. استمرارك في استخدام الخدمات بعد نشر التغييرات يشكل قبولًا لهذه التغييرات.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">2. الإنهاء</h3>
              <p>
                يمكننا إنهاء أو تعليق وصولك إلى الخدمات فورًا، دون إشعار مسبق أو مسؤولية، لأي سبب، بما في ذلك على سبيل المثال لا الحصر، انتهاكك لهذه الشروط.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">أحكام عامة</h2>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. القانون الحاكم</h3>
              <p>
                تخضع هذه الشروط لقوانين المملكة العربية السعودية وتفسر وفقًا لها، دون اعتبار لمبادئ تنازع القوانين.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">2. تسوية النزاعات</h3>
              <p>
                أي نزاع ينشأ عن هذه الشروط أو يتعلق بها سيتم حله أولاً من خلال المفاوضات الودية. إذا تعذر حل النزاع وديًا، فسيتم إحالته إلى التحكيم وفقًا لقواعد مركز التحكيم السعودي.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4">3. الانفصال</h3>
              <p>
                إذا تبين أن أي حكم من أحكام هذه الشروط غير قانوني أو باطل أو غير قابل للتنفيذ لأي سبب، فسيتم فصل هذا الحكم عن هذه الشروط ولن يؤثر على صحة وقابلية تنفيذ أي من الأحكام المتبقية.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">اتصل بنا</h2>
              <p>
                إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى التواصل معنا على:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>البريد الإلكتروني:</strong> legal@phishsimulator.com</li>
                <li><strong>الهاتف:</strong> +968 12 345 6789</li>
                <li><strong>العنوان:</strong>عمان - مسقط</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              هل لديك أسئلة حول شروط الاستخدام؟
            </h2>
            <p className="text-gray-700 mb-8">
              فريقنا القانوني جاهز للإجابة على جميع استفساراتك المتعلقة بشروط استخدام خدماتنا.
            </p>
            <Button asChild className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">
              <Link href="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
