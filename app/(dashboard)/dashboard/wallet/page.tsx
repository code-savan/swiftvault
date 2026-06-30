'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useI18n } from '@/app/contexts/I18nContext'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { FundWalletModal } from '@/app/components/FundWalletModal'
import { getUserWallet } from '@/app/actions/dashboard'
import { formatCurrency } from '@/app/lib/utils'
import { getCachedData, setCachedData } from '@/app/lib/data-cache'
import {
  Wallet, CreditCard, Plus, Download, TrendingUp
} from 'lucide-react'

interface Activity {
  id: string
  service: string
  amount: number
  status: string
  date: string
}

export default function WalletPage() {
  const [fundWalletOpen, setFundWalletOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const { user } = useUser()
  const { t } = useI18n()

  useEffect(() => {
    const cached = getCachedData<{ balance: number; totalDeposits: number; totalSpent: number; recentActivity: Activity[] }>('wallet')
    if (cached) {
      setBalance(cached.balance)
      setTotalDeposits(cached.totalDeposits)
      setTotalSpent(cached.totalSpent)
      setRecentActivity(cached.recentActivity)
      setLoading(false)
    }
    loadWallet()
  }, [])

  async function loadWallet() {
    const data = await getUserWallet()
    if (data) {
      setBalance(data.wallet_balance)
      setTotalDeposits(data.totalDeposits)
      setTotalSpent(data.totalSpent)
      setRecentActivity(data.recentActivity)
      setCachedData('wallet', {
        balance: data.wallet_balance,
        totalDeposits: data.totalDeposits,
        totalSpent: data.totalSpent,
        recentActivity: data.recentActivity,
      })
    }
    setLoading(false)
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2 border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-accent)] to-green-700 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">{t('wallet.availableBalance')}</p>
                  <p className="text-3xl font-bold">
                    {loading && balance === 0 ? (
                      <span className="animate-pulse text-white/50">—</span>
                    ) : (
                      formatCurrency(balance)
                    )}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-white/20 text-sm">NGN</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/10">
                <p className="text-white/70 text-xs mb-1">{t('wallet.totalDeposits')}</p>
                <p className="text-xl font-semibold">
                  {loading && totalDeposits === 0 ? <span className="animate-pulse text-white/50">—</span> : formatCurrency(totalDeposits)}
                </p>
              </div>
              <div className="p-4 bg-white/10">
                <p className="text-white/70 text-xs mb-1">{t('wallet.totalSpent')}</p>
                <p className="text-xl font-semibold">
                  {loading && totalSpent === 0 ? <span className="animate-pulse text-white/50">—</span> : formatCurrency(totalSpent)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setFundWalletOpen(true)}
                className="flex-1 bg-white text-[var(--color-accent)] hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('wallet.addFunds')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">{t('wallet.quickActions')}</h3>
            <div className="space-y-3">
              <button
                onClick={() => setFundWalletOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg)] hover:bg-[var(--color-border)] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('wallet.fundWallet')}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t('wallet.fundWalletDesc')}</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg)] hover:bg-[var(--color-border)] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('wallet.savedCards')}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t('wallet.savedCardsDesc')}</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg)] hover:bg-[var(--color-border)] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('wallet.exportStatement')}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t('wallet.exportStatementDesc')}</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-[var(--color-border)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[var(--color-text-primary)]">{t('wallet.recentActivity')}</h3>
          </div>
          {loading && recentActivity.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center justify-between py-2 animate-pulse">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-40 bg-[var(--color-border)]" />
                    <div className="h-3 w-24 bg-[var(--color-border)]" />
                  </div>
                  <div className="text-right space-y-1.5">
                    <div className="h-3.5 w-20 bg-[var(--color-border)]" />
                    <div className="h-4 w-14 bg-[var(--color-border)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">{t('common.noData')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{a.service}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{new Date(a.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{formatCurrency(a.amount)}</p>
                    <span className={`text-xs ${
                      a.status === 'completed' ? 'text-[var(--color-accent)]' :
                      a.status === 'cancelled' ? 'text-red-500' : 'text-yellow-600'
                    }`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FundWalletModal
        open={fundWalletOpen}
        onOpenChange={setFundWalletOpen}
        userEmail={user?.emailAddresses?.[0]?.emailAddress || ''}
        balance={balance}
      />
    </>
  )
}
