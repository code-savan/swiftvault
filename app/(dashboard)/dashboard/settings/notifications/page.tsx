'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { Separator } from '@/app/components/ui/separator'
import { getUserProfile, updatePreferences } from '@/app/actions/settings'
import { Breadcrumbs } from '@/app/components/ui/breadcrumbs'
import {
  ArrowLeft, Bell, Mail, Smartphone, MessageCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/app/contexts/I18nContext'

interface Prefs {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
  security: boolean
}

const defaults: Prefs = {
  email: true,
  push: true,
  sms: false,
  marketing: false,
  security: true,
}

interface ToggleRowProps {
  label: string
  description: string
  icon: React.ElementType
  enabled: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, icon: Icon, enabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--color-bg)] rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
          <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

export default function NotificationsPage() {
  const { t } = useI18n()
  const [prefs, setPrefs] = useState<Prefs>(defaults)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getUserProfile()
      .then((user) => {
        if (user.preferences && typeof user.preferences.notifications === 'object') {
          const saved = user.preferences.notifications as Partial<Prefs>
          setPrefs({ ...defaults, ...saved })
        }
      })
      .catch(() => toast.error(t('settings.appearance.loadFailed')))
      .finally(() => setLoaded(true))
  }, [])

  const toggle = (key: keyof Prefs) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    updatePreferences({
      ...(loaded ? {} : {}),
      notifications: next,
    }).catch(() => {
      setPrefs(prefs)
      toast.error(t('settings.notifications.saveFailed'))
    })
  }

  return (
    <>
        <Breadcrumbs items={[
          { label: 'Settings', href: '/dashboard/settings' },
          { label: 'Notifications' },
        ]} />

        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-6 divide-y divide-[var(--color-border)]">
            <ToggleRow
              label={t('settings.notifications.email')}
              description={t('settings.notifications.emailDesc')}
              icon={Mail}
              enabled={prefs.email}
              onChange={(v) => { setPrefs(p => ({...p, email: v})); toggle('email') }}
            />
            <ToggleRow
              label={t('settings.notifications.push')}
              description={t('settings.notifications.pushDesc')}
              icon={Bell}
              enabled={prefs.push}
              onChange={(v) => { setPrefs(p => ({...p, push: v})); toggle('push') }}
            />
            <ToggleRow
              label={t('settings.notifications.sms')}
              description={t('settings.notifications.smsDesc')}
              icon={Smartphone}
              enabled={prefs.sms}
              onChange={(v) => { setPrefs(p => ({...p, sms: v})); toggle('sms') }}
            />
            <Separator className="my-2" />
            <ToggleRow
              label={t('settings.notifications.marketing')}
              description={t('settings.notifications.marketingDesc')}
              icon={MessageCircle}
              enabled={prefs.marketing}
              onChange={(v) => { setPrefs(p => ({...p, marketing: v})); toggle('marketing') }}
            />
            <ToggleRow
              label={t('settings.notifications.security')}
              description={t('settings.notifications.securityDesc')}
              icon={Mail}
              enabled={prefs.security}
              onChange={(v) => { setPrefs(p => ({...p, security: v})); toggle('security') }}
            />
          </CardContent>
        </Card>
    </>
  )
}
