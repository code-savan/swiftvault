'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { useI18n } from '@/app/contexts/I18nContext'
import { Breadcrumbs } from '@/app/components/ui/breadcrumbs'
import { ArrowLeft, Globe, Check } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ha', name: 'Hausa', native: 'Hausa' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', native: 'Igbo' },
  { code: 'pcm', name: 'Nigerian Pidgin', native: 'Naija' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
]

export default function LanguagePage() {
  const { locale, setLocale, dir, t } = useI18n()

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  return (
    <>
        <Breadcrumbs items={[
          { label: 'Settings', href: '/dashboard/settings' },
          { label: 'Language' },
        ]} />

        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-0 divide-y divide-[var(--color-border)]">
            {languages.map((lang) => {
              const isSelected = locale === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]'
                    }`}>
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{lang.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{lang.native}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-[var(--color-accent)] rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </CardContent>
        </Card>
    </>
  )
}
