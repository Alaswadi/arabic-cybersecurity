'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false} 
      disableTransitionOnChange
      forcedTheme="light"
    >
      {children}
    </ThemeProvider>
  )
}
