'use client'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/i18n-context'
import { Globe, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function HeaderButtons() {
  const [mounted, setMounted] = useState(false)
  const { currentLanguage, setLanguage } = useI18n()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setLanguage(currentLanguage === 'en' ? 'es' : 'en')}
      >
        <Globe className="mr-2 h-4 w-4" />
        {currentLanguage}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
