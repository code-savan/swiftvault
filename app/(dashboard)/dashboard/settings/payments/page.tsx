'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Breadcrumbs } from '@/app/components/ui/breadcrumbs'
import { ArrowLeft, CreditCard, Plus } from 'lucide-react'
import { useI18n } from '@/app/contexts/I18nContext'

export default function PaymentsPage() {
  const { t } = useI18n()

  return (
    <>
        <Breadcrumbs items={[
          { label: 'Settings', href: '/dashboard/settings' },
          { label: 'Payments' },
        ]} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{t('settings.payments.savedCards')}</h2>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            {t('settings.payments.addCard')}
          </Button>
        </div>

        <div className="text-center py-16 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
          <CreditCard className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-sm text-[var(--color-text-muted)]">{t('common.noData')}</p>
        </div>
    </>
  )
}
