import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavButtonProps {
  href: string
  className?: string
  children: React.ReactNode
}

export function NavButton({ href, className, children }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#1a1c3a] text-white hover:bg-[#242850] border border-[#2f3365]",
        className
      )}
    >
      {children}
    </Link>
  )
}
