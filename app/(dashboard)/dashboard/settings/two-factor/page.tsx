'use client'

import Link from 'next/link'
import { UserProfile } from '@clerk/nextjs'
import { Card, CardContent } from '@/app/components/ui/card'
import { ArrowLeft, Shield, Smartphone, Key } from 'lucide-react'
import { useI18n } from '@/app/contexts/I18nContext'

export default function TwoFactorPage() {
  const { t } = useI18n()
  return (
    <>
    <div className="space-y-6">
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[var(--color-bg)] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-[var(--color-text-secondary)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{t('settings.twofactor.authenticatorApp')}</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {t('settings.twofactor.info')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)] overflow-hidden">
          <CardContent className="p-0">
            <UserProfile routing="hash" />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
