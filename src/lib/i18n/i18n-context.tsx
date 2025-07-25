// /lib/i18n/i18n-context.tsx

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import en from './en.json'
import es from './es.json'

type Language = 'en' | 'es'

type I18nContextType = {
  t: (key: string, params?: Record<string, string | number>) => string
  currentLanguage: Language
  setLanguage: (lang: Language) => void
}

const translations = {
  en,
  es,
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['en', 'es'].includes(savedLang)) {
      setCurrentLanguage(savedLang)
    }
  }, [])

  useEffect(() => {
    if (document.documentElement.lang !== currentLanguage) {
      document.documentElement.lang = currentLanguage
    }
  }, [currentLanguage])

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang)
    if (mounted) {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.')
    let value: any = translations[currentLanguage]

    for (const k of keys) {
      value = value?.[k]
      if (!value) break
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key not found: ${key}`)
      return key
    }

    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, key) =>
        String(params[key] ?? `{{${key}}}`)
      )
    }

    return value
  }

  return (
    <I18nContext.Provider value={{ t, currentLanguage, setLanguage }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
