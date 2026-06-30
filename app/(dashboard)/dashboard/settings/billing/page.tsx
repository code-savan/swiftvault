'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { getTransactions } from '@/app/actions/settings'
import { Breadcrumbs } from '@/app/components/ui/breadcrumbs'
import { ArrowLeft, FileText, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/app/lib/utils'
import { toast } from 'sonner'
import { useI18n } from '@/app/contexts/I18nContext'

interface Transaction {
  id: string
  amount: number
  type: string
  description: string | null
  status: string
  created_at: string
}

export default function BillingPage() {
  const { t } = useI18n()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTransactions()
      .then((res) => setTransactions(res.transactions))
      .catch(() => toast.error(t('settings.billing.loadFailed')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--color-border)] rounded w-48" />
          <div className="h-64 bg-[var(--color-border)] rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <>
        <Breadcrumbs items={[
          { label: 'Settings', href: '/dashboard/settings' },
          { label: 'Billing' },
        ]} />

        {transactions.length === 0 ? (
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('settings.billing.noTransactions')}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('settings.billing.emptyDesc')}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                      <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-4">{t('settings.billing.descriptionLabel')}</th>
                      <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-4">{t('settings.billing.date')}</th>
                      <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-4">{t('settings.billing.status')}</th>
                      <th className="text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-4">{t('settings.billing.amount')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[var(--color-bg)]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              tx.amount >= 0 ? 'bg-[var(--color-accent-light)]' : 'bg-[var(--color-bg)]'
                            }`}>
                              <FileText className={`w-5 h-5 ${tx.amount >= 0 ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`} />
                            </div>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">
                              {tx.description || tx.type}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === 'completed' ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]' :
                            tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className={`text-sm font-semibold ${tx.amount >= 0 ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
                            {tx.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
    </>
  )
}
