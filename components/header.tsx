"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#1a1c3a] text-white border-b border-[#2f3365] sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="gradient-text">Phish Simulator</span>
          </Link>
        </div>

        <nav className="hidden lg:block">
          <ul className="flex space-x-8 space-x-reverse">
            <li>
              <Link href="/" className="px-2 py-1 text-sm hover:text-purple-400 transition-colors">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/services" className="px-2 py-1 text-sm hover:text-purple-400 transition-colors">
                الخدمات
              </Link>
            </li>
            <li>
              <Link href="/blog" className="px-2 py-1 text-sm hover:text-purple-400 transition-colors">
                المدونة
              </Link>
            </li>
            <li>
              <Link href="/about" className="px-2 py-1 text-sm hover:text-purple-400 transition-colors">
                من نحن
              </Link>
            </li>
            <li>
              <Link href="/contact" className="px-2 py-1 text-sm hover:text-purple-400 transition-colors">
                تواصل معنا
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="gradient-bg hover:opacity-90 hidden md:flex">
            <Link href="/demo">ابدأ الآن</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#242850] border-t border-[#2f3365] py-4">
          <nav className="container mx-auto px-4">
            <ul className="space-y-4">
              <li>
                <Link href="/" className="block py-2 hover:text-purple-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/services" className="block py-2 hover:text-purple-400 transition-colors">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link href="/blog" className="block py-2 hover:text-purple-400 transition-colors">
                  المدونة
                </Link>
              </li>
              <li>
                <Link href="/about" className="block py-2 hover:text-purple-400 transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block py-2 hover:text-purple-400 transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li className="pt-4 flex flex-col gap-2">
                <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                  تسجيل الدخول
                </Button>
                <Button className="w-full gradient-bg hover:opacity-90">
                  ابدأ الآن
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
