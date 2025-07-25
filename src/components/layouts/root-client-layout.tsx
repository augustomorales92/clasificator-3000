'use client'

import { I18nProvider } from '@/lib/i18n/i18n-context'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import PublicHeader from '../header/public-header'

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        {mounted && <PublicHeader />}
        {children}
      </I18nProvider>
    </NextThemesProvider>
  )
}
