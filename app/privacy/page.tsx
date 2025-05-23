import React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-[#1a1c3a] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              سياسة الخصوصية
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              نلتزم بحماية خصوصية بياناتك الشخصية ونسعى لضمان الشفافية في كيفية جمعها واستخدامها
            </p>
            <div className="text-sm text-gray-400">
              آخر تحديث: 1 يونيو 2023
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">مقدمة</h2>
              <p>
                نحن في Phish Simulator ("الشركة"، "نحن"، "لنا") نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. تصف سياسة الخصوصية هذه كيفية جمعنا واستخدامنا للمعلومات الشخصية التي تقدمها لنا عند استخدام موقعنا الإلكتروني وخدماتنا.
              </p>
              <p>
                نرجو قراءة سياسة الخصوصية هذه بعناية لفهم نهجنا ومماراساتنا المتعلقة ببياناتك الشخصية وكيفية تعاملنا معها. باستخدامك لموقعنا وخدماتنا، فإنك توافق على جمع واستخدام المعلومات وفقًا لهذه السياسة.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">المعلومات التي نجمعها</h2>
              <p>
                قد نقوم بجمع أنواع مختلفة من المعلومات منك، بما في ذلك:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  <strong>المعلومات الشخصية:</strong> مثل الاسم وعنوان البريد الإلكتروني ورقم الهاتف وعنوان الشركة وغيرها من المعلومات التي تقدمها طواعية عند التسجيل في خدماتنا أو ملء النماذج على موقعنا.
                </li>
                <li>
                  <strong>معلومات الاستخدام:</strong> نجمع معلومات حول كيفية استخدامك لموقعنا وخدماتنا، بما في ذلك عنوان IP الخاص بك ونوع المتصفح وإعدادات المنطقة الزمنية والصفحات التي تزورها.
                </li>
                <li>
                  <strong>معلومات الجهاز:</strong> قد نجمع معلومات حول الجهاز الذي تستخدمه للوصول إلى موقعنا، بما في ذلك نوع الجهاز ونظام التشغيل والمعرفات الفريدة للجهاز.
                </li>
                <li>
                  <strong>ملفات تعريف الارتباط:</strong> نستخدم ملفات تعريف الارتباط وتقنيات مماثلة لتحسين تجربة المستخدم وتحليل استخدام الموقع.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">كيف نستخدم معلوماتك</h2>
              <p>
                نستخدم المعلومات التي نجمعها للأغراض التالية:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>توفير وإدارة وتحسين خدماتنا.</li>
                <li>إرسال معلومات حول خدماتنا والتحديثات والعروض الترويجية (يمكنك إلغاء الاشتراك في أي وقت).</li>
                <li>الاستجابة لاستفساراتك وطلباتك وتقديم الدعم الفني.</li>
                <li>تحليل استخدام الموقع وتحسين تجربة المستخدم.</li>
                <li>الامتثال للالتزامات القانونية والتنظيمية.</li>
                <li>منع الاحتيال وحماية أمن موقعنا وخدماتنا.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">مشاركة المعلومات</h2>
              <p>
                لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  <strong>مقدمي الخدمات:</strong> قد نشارك معلوماتك مع مقدمي الخدمات الذين يساعدوننا في تشغيل موقعنا وتقديم خدماتنا، مثل مزودي خدمات الاستضافة ومعالجة المدفوعات.
                </li>
                <li>
                  <strong>الامتثال القانوني:</strong> قد نكشف عن معلوماتك إذا كان ذلك مطلوبًا بموجب القانون أو في إطار إجراءات قانونية.
                </li>
                <li>
                  <strong>حماية الحقوق:</strong> قد نكشف عن معلوماتك لحماية حقوقنا أو ممتلكاتنا أو سلامة مستخدمينا أو الجمهور.
                </li>
                <li>
                  <strong>عمليات نقل الأعمال:</strong> في حالة الاندماج أو الاستحواذ أو بيع الأصول، قد يتم نقل معلوماتك كجزء من تلك المعاملة.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">أمن البيانات</h2>
              <p>
                نتخذ تدابير أمنية معقولة لحماية معلوماتك الشخصية من الفقدان أو سوء الاستخدام أو الوصول غير المصرح به أو الإفصاح أو التعديل أو الإتلاف. ومع ذلك، لا يمكن ضمان أمان المعلومات المرسلة عبر الإنترنت بنسبة 100٪.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">حقوقك</h2>
              <p>
                اعتمادًا على موقعك، قد يكون لديك حقوق معينة فيما يتعلق بمعلوماتك الشخصية، بما في ذلك:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>الوصول إلى معلوماتك الشخصية وتصحيحها.</li>
                <li>حذف معلوماتك الشخصية.</li>
                <li>تقييد معالجة معلوماتك الشخصية.</li>
                <li>نقل معلوماتك الشخصية.</li>
                <li>الاعتراض على معالجة معلوماتك الشخصية.</li>
              </ul>
              <p>
                لممارسة أي من هذه الحقوق، يرجى التواصل معنا باستخدام معلومات الاتصال المقدمة أدناه.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">ملفات تعريف الارتباط</h2>
              <p>
                نستخدم ملفات تعريف الارتباط وتقنيات مماثلة لتحسين تجربة المستخدم وتحليل استخدام الموقع. يمكنك ضبط إعدادات متصفحك لرفض جميع ملفات تعريف الارتباط أو للإشارة عندما يتم إرسال ملف تعريف ارتباط. ومع ذلك، إذا قمت بعدم قبول ملفات تعريف الارتباط، فقد لا تتمكن من استخدام بعض أجزاء من موقعنا.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">التغييرات على سياسة الخصوصية</h2>
              <p>
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث" في أعلى هذه السياسة. نشجعك على مراجعة سياسة الخصوصية هذه بشكل دوري للبقاء على اطلاع بكيفية حمايتنا لمعلوماتك.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">اتصل بنا</h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا على:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>البريد الإلكتروني:</strong> privacy@phishsimulator.com</li>
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
              هل لديك أسئلة حول سياسة الخصوصية؟
            </h2>
            <p className="text-gray-700 mb-8">
              فريقنا جاهز للإجابة على جميع استفساراتك المتعلقة بكيفية تعاملنا مع بياناتك الشخصية.
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
