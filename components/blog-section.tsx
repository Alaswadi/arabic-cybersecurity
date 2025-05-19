import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BlogSection() {
  const blogPosts = [
    {
      title: "كيفية حماية مؤسستك من هجمات التصيد الاحتيالي",
      excerpt: "تعرف على أحدث التقنيات والاستراتيجيات لحماية مؤسستك من هجمات التصيد الاحتيالي المتطورة",
      image: "/placeholder-blog-1.jpg",
      date: "15 يونيو 2023",
      author: "أحمد محمد",
      authorImage: "/placeholder-author-1.jpg",
      slug: "protect-from-phishing",
    },
    {
      title: "أهمية تدريب الموظفين على الأمن السيبراني",
      excerpt: "لماذا يعتبر تدريب الموظفين على الوعي الأمني أحد أهم خطوط الدفاع ضد الهجمات السيبرانية",
      image: "/placeholder-blog-2.jpg",
      date: "3 مايو 2023",
      author: "سارة أحمد",
      authorImage: "/placeholder-author-2.jpg",
      slug: "employee-security-training",
    },
    {
      title: "التهديدات السيبرانية الناشئة في 2023",
      excerpt: "استعراض لأبرز التهديدات السيبرانية الناشئة هذا العام وكيفية الاستعداد لها",
      image: "/placeholder-blog-3.jpg",
      date: "20 أبريل 2023",
      author: "محمد علي",
      authorImage: "/placeholder-author-3.jpg",
      slug: "emerging-cyber-threats-2023",
    },
  ]

  return (
    <section className="py-20 bg-[#1a1c3a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">آخر المقالات</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            اطلع على أحدث المقالات والأخبار في مجال الأمن السيبراني والتهديدات الناشئة وأفضل الممارسات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="dark-card rounded-lg overflow-hidden transition-all duration-300 hover:purple-glow border border-[#2f3365] group">
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c3a] to-transparent z-10 opacity-50"></div>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-purple-600/80 text-white text-xs px-2 py-1 rounded-md z-20">
                  {post.date}
                </div>
              </div>
              <div className="p-6 border-t border-[#2f3365]">
                <h3 className="text-xl font-bold mb-3 text-white">
                  <Link href={`/blog/${post.slug}`} className="hover:text-purple-400 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#2f3365]/50">
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 border border-purple-500">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-300">{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                    قراءة المزيد <ArrowLeft className="mr-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="gradient-bg hover:opacity-90 px-6 py-6 text-lg h-auto">
            <Link href="/blog">جميع المقالات <ArrowLeft className="mr-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
