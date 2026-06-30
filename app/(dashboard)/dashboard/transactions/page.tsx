'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/app/contexts/I18nContext'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { getUserTransactions } from '@/app/actions/dashboard'
import { formatCurrency } from '@/app/lib/utils'
import {
  Search, FileText, Package
} from 'lucide-react'

interface Transaction {
  id: string
  service: string
  amount: number
  quantity: number
  status: string
  date: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
  payment_received: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
  partial: 'bg-orange-100 text-orange-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]',
}

export default function TransactionsPage() {
  const { t } = useI18n()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    setLoading(true)
    const data = await getUserTransactions()
    setTransactions(data)
    setLoading(false)
  }

  const filtered = searchQuery
    ? transactions.filter((tx) =>
        tx.service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transactions

  return (
    <>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <Input
              placeholder={t('transactions.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>
        </div>

        {loading ? (
          <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
            <div className="bg-[var(--color-bg)] border-b border-[var(--color-border)] px-6 py-3 flex gap-8">
              <div className="animate-pulse h-3 w-16 bg-[var(--color-border)] rounded" />
              <div className="animate-pulse h-3 w-12 bg-[var(--color-border)] rounded ml-auto" />
              <div className="animate-pulse h-3 w-16 bg-[var(--color-border)] rounded ml-auto" />
              <div className="animate-pulse h-3 w-14 bg-[var(--color-border)] rounded ml-auto" />
              <div className="animate-pulse h-3 w-12 bg-[var(--color-border)] rounded ml-auto" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--color-border)] last:border-0">
                <div className="animate-pulse h-4 w-32 bg-[var(--color-border)] rounded" />
                <div className="animate-pulse h-4 w-12 bg-[var(--color-border)] rounded ml-auto" />
                <div className="animate-pulse h-4 w-20 bg-[var(--color-border)] rounded ml-auto" />
                <div className="animate-pulse h-5 w-20 bg-[var(--color-border)] rounded-full ml-auto" />
                <div className="animate-pulse h-3 w-24 bg-[var(--color-border)] rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-muted)]">{t('common.noData')}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                      <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Service</th>
                      <th className="text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Qty</th>
                      <th className="text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Amount</th>
                      <th className="text-center text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-right text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {filtered.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[var(--color-bg)] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{tx.service}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm text-[var(--color-text-secondary)]">{tx.quantity.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{formatCurrency(tx.amount)}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[tx.status] || 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-xs text-[var(--color-text-muted)]">{new Date(tx.date).toLocaleDateString()}</p>
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
