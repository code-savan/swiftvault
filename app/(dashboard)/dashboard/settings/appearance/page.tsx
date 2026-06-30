'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { getUserProfile, updatePreferences } from '@/app/actions/settings'
import { Breadcrumbs } from '@/app/components/ui/breadcrumbs'
import { ArrowLeft, Moon, Sun, Monitor } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/app/contexts/I18nContext'

type Theme = 'light' | 'dark' | 'system'

const themes: { id: Theme; label: string; icon: React.ElementType }[] = [
  { id: 'light', label: 'settings.appearance.light', icon: Sun },
  { id: 'dark', label: 'settings.appearance.dark', icon: Moon },
  { id: 'system', label: 'settings.appearance.system', icon: Monitor },
]

export default function AppearancePage() {
  const { t } = useI18n()
  const [theme, setTheme] = useState<Theme>('light')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getUserProfile()
      .then((user) => {
        const saved = user.preferences?.appearance as { theme?: Theme } | undefined
        if (saved?.theme) {
          setTheme(saved.theme)
        }
      })
      .catch(() => toast.error(t('settings.appearance.loadFailed')))
      .finally(() => setLoaded(true))
  }, [])

  const selectTheme = (th: Theme) => {
    setTheme(th)
    if (loaded) {
      updatePreferences({
        appearance: { theme: th },
      }).catch(() => {
        toast.error(t('settings.appearance.saveFailed'))
      })
    }
  }

  return (
    <>
        <Breadcrumbs items={[
          { label: 'Settings', href: '/dashboard/settings' },
          { label: 'Appearance' },
        ]} />

        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[var(--color-text-primary)] mb-4">{t('settings.appearance.theme')}</p>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((th) => {
                const Icon = th.icon
                const isActive = theme === th.id
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => selectTheme(th.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                      {t(th.label)}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
    </>
  )
}
