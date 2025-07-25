'use client'

import { HeaderButtons } from '@/components/header/header-buttons'
import { usePathname } from 'next/navigation'

export default function PublicHeader() {
  const pathname = usePathname()

  if (!pathname.includes('/auth')) {
    return null
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b px-4 sticky top-0 bg-transparent z-10 backdrop-blur-sm">
      <HeaderButtons />
    </header>
  )
}
