"use client"

import type React from "react"

import {
  Shield,
  Lock,
  FileText,
  BarChart,
  Users,
  Bell,
  AlertTriangle,
  Database,
  Server,
  Wifi,
  Globe,
  Mail,
} from "lucide-react"

type IconProps = {
  iconName: string
  className?: string
}

export function ServiceIcon({ iconName, className = "w-6 h-6" }: IconProps) {
  // Map of icon names to components
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Shield: Shield,
    Lock: Lock,
    FileText: FileText,
    BarChart: BarChart,
    Users: Users,
    Bell: Bell,
    AlertTriangle: AlertTriangle,
    Database: Database,
    Server: Server,
    Wifi: Wifi,
    Globe: Globe,
    Mail: Mail,
    // Add more icons as needed
  }

  // Get the icon component or default to Shield
  const IconComponent = iconMap[iconName] || Shield

  return <IconComponent className={className} />
}
