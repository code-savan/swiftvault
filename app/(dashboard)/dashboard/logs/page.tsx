'use client'

import { useEffect, useState, useMemo } from 'react'
import { useI18n } from '@/app/contexts/I18nContext'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import {
  getAvailableAccounts, purchaseAccount, getAccountStats, getUserPurchasedAccounts,
  type SocialAccount, type PurchasedAccount,
} from '@/app/actions/social-accounts'
import { formatCurrency } from '@/app/lib/utils'
import { toast } from 'sonner'
import {
  Search, Users, CheckCircle, ShieldCheck,
  Eye, EyeOff, Copy, X, Package,
  Instagram, MessageCircle, Music, Video, Globe,
  MessageSquare,
} from 'lucide-react'

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  INSTAGRAM: Instagram,
  FACEBOOK: MessageCircle,
  TWITTER: MessageSquare,
  TIKTOK: Music,
  YOUTUBE: Video,
  TELEGRAM: MessageCircle,
  WHATSAPP: MessageCircle,
  SNAPCHAT: MessageCircle,
  LINKEDIN: Users,
}

type View = 'browse' | 'purchased'

export default function LogsPage() {
  const [view, setView] = useState<View>('browse')
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [purchasedAccounts, setPurchasedAccounts] = useState<PurchasedAccount[]>([])
  const [stats, setStats] = useState<{ totalAvailable: number; totalSold: number; byPlatform: { platform: string; count: number }[] }>({ totalAvailable: 0, totalSold: 0, byPlatform: [] })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<PurchasedAccount | null>(null)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const { t } = useI18n()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [accts, statsData, purchased] = await Promise.all([
      getAvailableAccounts(),
      getAccountStats(),
      getUserPurchasedAccounts(),
    ])
    setAccounts(accts)
    setStats(statsData)
    setPurchasedAccounts(purchased)
    setLoading(false)
  }

  const platforms = useMemo(() => {
    const set = new Set<string>()
    for (const a of accounts) {
      set.add(a.platform)
    }
    return Array.from(set).sort()
  }, [accounts])

  const filteredAccounts = useMemo(() => {
    let list = accounts
    if (selectedPlatform) {
      list = list.filter((a) => a.platform === selectedPlatform)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (a) =>
          a.platform.toLowerCase().includes(q) ||
          a.account_type.toLowerCase().includes(q) ||
          (a.details?.followers && String(a.details.followers).includes(q))
      )
    }
    return list
  }, [accounts, selectedPlatform, searchQuery])

  async function handlePurchase(accountId: string) {
    setPurchasing(accountId)
    const result = await purchaseAccount(accountId)
    if (result.success && result.account) {
      setPurchaseResult(result.account)
      toast.success('Account purchased!')
      loadData()
    } else {
      toast.error(result.error || 'Failed to purchase')
    }
    setPurchasing(null)
  }

  function getPlatformIcon(platform: string) {
    const Icon = PLATFORM_ICONS[platform.toUpperCase()]
    return Icon ? <Icon className="w-5 h-5" /> : <Globe className="w-5 h-5" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="animate-pulse h-10 w-48 bg-[var(--color-border)] rounded-lg ml-auto" />
          <div className="animate-pulse h-10 w-10 bg-[var(--color-border)] rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-xl p-5 flex items-center gap-4">
              <div className="animate-pulse h-12 w-12 rounded-xl bg-[var(--color-border)]" />
              <div className="space-y-2">
                <div className="animate-pulse h-7 w-16 bg-[var(--color-border)] rounded" />
                <div className="animate-pulse h-3 w-28 bg-[var(--color-border)] rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="animate-pulse h-9 w-20 rounded-xl bg-[var(--color-border)]" />
          <div className="animate-pulse h-9 w-24 rounded-xl bg-[var(--color-border)]" />
          <div className="animate-pulse h-9 w-28 rounded-xl bg-[var(--color-border)]" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-xl p-5">
              <div className="animate-pulse h-4 w-16 rounded-full bg-[var(--color-border)] mb-3" />
              <div className="animate-pulse h-4 w-28 bg-[var(--color-border)] rounded mb-3" />
              <div className="animate-pulse h-3 w-24 bg-[var(--color-border)] rounded mb-4" />
              <div className="flex items-center justify-between mt-4">
                <div className="animate-pulse h-5 w-16 bg-[var(--color-border)] rounded" />
                <div className="animate-pulse h-8 w-16 rounded-lg bg-[var(--color-border)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
        {/* Page controls */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <Input
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 w-48"
            />
          </div>
          <button
            onClick={() => setView(view === 'purchased' ? 'browse' : 'purchased')}
            className={`p-2.5 rounded-xl transition-colors ${
              view === 'purchased'
                ? 'bg-[var(--color-accent)] text-white'
                : 'hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)]'
            }`}
          >
            <Package className="w-5 h-5" />
          </button>
        </div>

        {purchaseResult && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border border-[var(--color-border)] shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Account Purchased!</h3>
                  <button onClick={() => setPurchaseResult(null)} className="p-1 hover:bg-[var(--color-bg)] rounded-lg">
                    <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
                <div className="bg-[var(--color-accent-light)] rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-[var(--color-accent)]">
                    {purchaseResult.platform} — {purchaseResult.account_type}
                  </p>
                  <p className="text-sm text-[var(--color-accent)]">{formatCurrency(purchaseResult.price)}</p>
                </div>
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Email / Username</p>
                    <div className="flex items-center justify-between p-3 bg-[var(--color-bg)] rounded-lg">
                      <code className="text-sm font-mono text-[var(--color-text-primary)] break-all">{purchaseResult.email}</code>
                      <button
                        onClick={() => { navigator.clipboard.writeText(purchaseResult.email || ''); toast.success('Copied') }}
                        className="p-1.5 hover:bg-[var(--color-border)] rounded-lg shrink-0 ml-2"
                      >
                        <Copy className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Password</p>
                    <div className="flex items-center justify-between p-3 bg-[var(--color-bg)] rounded-lg">
                      <code className="text-sm font-mono text-[var(--color-text-primary)] break-all">{purchaseResult.password}</code>
                      <button
                        onClick={() => { navigator.clipboard.writeText(purchaseResult.password || ''); toast.success('Copied') }}
                        className="p-1.5 hover:bg-[var(--color-border)] rounded-lg shrink-0 ml-2"
                      >
                        <Copy className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      </button>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => setPurchaseResult(null)}
                >
                  Done
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {view === 'browse' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.totalAvailable}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('logs.accountsAvailable')}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-light)] rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.totalSold}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('logs.verifiedAccounts')}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{platforms.length}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('logs.replacementWarranty')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedPlatform(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  !selectedPlatform
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
                }`}
              >
                <Globe className="w-4 h-4" />
                All
              </button>
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    selectedPlatform === p
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
                  }`}
                >
                  {getPlatformIcon(p)}
                  {p.slice(0, 1) + p.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Accounts grid */}
            {filteredAccounts.length === 0 ? (
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                  <p className="text-sm text-[var(--color-text-muted)]">{t('common.noData')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    purchasing={purchasing}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {view === 'purchased' && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">My Purchases</h2>
            {purchasedAccounts.length === 0 ? (
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                  <p className="text-sm text-[var(--color-text-muted)]">{t('common.noData')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {purchasedAccounts.map((acct) => (
                  <Card key={acct.id} className="border border-[var(--color-border)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(acct.platform)}
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{acct.platform} — {acct.account_type}</p>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">{new Date(acct.sold_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-3">
                        <span>{formatCurrency(acct.price)}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2.5 bg-[var(--color-bg)] rounded-lg">
                          <code className="text-xs font-mono text-[var(--color-text-primary)] break-all">
                            {revealedIds.has(acct.id) ? acct.email : '••••••••••'}
                          </code>
                          <button
                            onClick={() => {
                              const next = new Set(revealedIds)
                              if (next.has(acct.id)) next.delete(acct.id)
                              else next.add(acct.id)
                              setRevealedIds(next)
                            }}
                            className="p-1 hover:bg-[var(--color-border)] rounded shrink-0 ml-2"
                          >
                            {revealedIds.has(acct.id) ? <EyeOff className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> : <Eye className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-[var(--color-bg)] rounded-lg">
                          <code className="text-xs font-mono text-[var(--color-text-primary)] break-all">
                            {revealedIds.has(acct.id) ? acct.password : '••••••••••'}
                          </code>
                          <button
                            onClick={() => {
                              const next = new Set(revealedIds)
                              if (next.has(acct.id)) next.delete(acct.id)
                              else next.add(acct.id)
                              setRevealedIds(next)
                            }}
                            className="p-1 hover:bg-[var(--color-border)] rounded shrink-0 ml-2"
                          >
                            {revealedIds.has(acct.id) ? <EyeOff className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> : <Eye className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
    </>
  )
}

function AccountCard({
  account,
  purchasing,
  onPurchase,
}: {
  account: SocialAccount
  purchasing: string | null
  onPurchase: (id: string) => void
}) {
  const { t } = useI18n()
  const followers = account.details?.followers

  return (
    <Card className="border border-[var(--color-border)] hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
            {account.account_type}
          </span>
        </div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 truncate">
          {account.platform} Account
        </p>
        {followers && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-2">
            <Users className="w-3 h-3" />
            <span>{typeof followers === 'number' ? followers.toLocaleString() : followers} followers</span>
          </div>
        )}
        {account.details?.account_age && (
          <p className="text-xs text-[var(--color-text-muted)] mb-2">
            {t('logs.accountAge')}: {account.details.account_age}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{formatCurrency(account.price)}</p>
          <Button
            size="sm"
            onClick={() => onPurchase(account.id)}
            disabled={purchasing === account.id}
          >
            {purchasing === account.id ? (
              '...'
            ) : (
              t('logs.buy')
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
