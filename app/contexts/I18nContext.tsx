'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { Translations } from '@/app/lib/i18n/types'
import { loadTranslations, t as translate } from '@/app/lib/i18n/index'
import { languages, defaultLocale } from '@/app/lib/i18n/config'
import { getUserProfile, updatePreferences } from '@/app/actions/settings'

interface I18nContextType {
  locale: string
  dir: 'ltr' | 'rtl'
  setLocale: (code: string) => void
  t: (key: string, fallback?: string) => string
  ready: boolean
}

const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  dir: 'ltr',
  setLocale: () => {},
  t: (key: string) => key,
  ready: false,
})

let cachedTranslations: Translations | null = null

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState(defaultLocale)
  const [ready, setReady] = useState(false)
  const translationsRef = useRef<Translations>({})
  const applying = useRef(false)

  const applyLocale = useCallback((code: string) => {
    const lang = languages.find((l) => l.code === code)
    const dir = lang?.dir ?? 'ltr'
    document.documentElement.lang = code
    document.documentElement.dir = dir
    const saved = localStorage.getItem('swiftvult-locale')
    if (saved !== code) {
      localStorage.setItem('swiftvult-locale', code)
    }
  }, [])

  useEffect(() => {
    const localLocale = localStorage.getItem('swiftvult-locale')
    if (localLocale && languages.some((l) => l.code === localLocale)) {
      applyLocale(localLocale)
      setLocaleState(localLocale)
    }

    getUserProfile()
      .then((user) => {
        const saved = user.preferences?.language as { code?: string } | undefined
        const code = saved?.code || localLocale || defaultLocale
        applyLocale(code)
        setLocaleState(code)
      })
      .catch(() => {
        applyLocale(localLocale || defaultLocale)
        setLocaleState(localLocale || defaultLocale)
      })
      .finally(() => {
        setReady(true)
      })
  }, [applyLocale])

  const getTranslations = useCallback((code: string): Translations => {
    if (!cachedTranslations) {
      cachedTranslations = loadTranslations(code)
    }
    return cachedTranslations
  }, [])

  translationsRef.current = getTranslations(locale)

  const tFn = useCallback(
    (key: string, fallback?: string) => {
      return translate(translationsRef.current, key, fallback)
    },
    []
  )

  const setLocale = useCallback(
    (code: string) => {
      if (applying.current) return
      applying.current = true

      applyLocale(code)
      setLocaleState(code)
      cachedTranslations = loadTranslations(code)
      translationsRef.current = cachedTranslations

      updatePreferences({ language: { code } }).catch(() => {})

      applying.current = false
    },
    [applyLocale]
  )

  const lang = languages.find((l) => l.code === locale)
  const dir = lang?.dir ?? 'ltr'

  return (
    <I18nContext.Provider value={{ locale, dir, setLocale, t: tFn, ready }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
