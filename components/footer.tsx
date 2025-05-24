import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Linkedin, Github, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NewsletterSubscription } from "@/components/newsletter-subscription"

export function Footer() {
  return (
    <footer className="bg-[#1a1c3a] text-white border-t border-[#2f3365]">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-[#2f3365]">
          <NewsletterSubscription variant="footer" />
        </div>

        {/* Main Footer */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text">Phish Simulator</h3>
              <p className="text-sm text-gray-400 mb-4">
                شركة رائدة في مجال الأمن السيبراني متخصصة في حماية المؤسسات من الهجمات السيبرانية وتعزيز الأمن الرقمي
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <Link
                  href="#"
                  className="w-10 h-10 bg-[#242850] rounded-full flex items-center justify-center hover:bg-[#2f3365] transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-[#242850] rounded-full flex items-center justify-center hover:bg-[#2f3365] transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-[#242850] rounded-full flex items-center justify-center hover:bg-[#2f3365] transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-[#242850] rounded-full flex items-center justify-center hover:bg-[#2f3365] transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                    الأسعار
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                    تواصل معنا
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">
                    الأسئلة الشائعة
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">خدماتنا</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                    تقييم المخاطر السيبرانية
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                    تدريب الموظفين
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                    اختبار الاختراق
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                    الاستجابة للحوادث
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                    حماية البيانات
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">المدونة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                    أحدث التهديدات السيبرانية
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                    نصائح للأمان الرقمي
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                    دراسات حالة
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                    أخبار التكنولوجيا
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-[#2f3365] flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Phish Simulator. جميع الحقوق محفوظة.</p>
          <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              شروط الاستخدام
            </Link>
            <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
              سياسة ملفات تعريف الارتباط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
