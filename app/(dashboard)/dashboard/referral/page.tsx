'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/app/contexts/I18nContext'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { getReferralDashboard, getMyReferralCode, type ReferralDashboardData } from '@/app/actions/referral-dashboard'
import { formatCurrency } from '@/app/lib/utils'
import { toast } from 'sonner'
import {
  Gift, Users, TrendingUp, Copy, Share2,
  ChevronRight, ExternalLink, DollarSign, UserPlus,
  Calendar,
} from 'lucide-react'

export default function ReferralPage() {
  const { t } = useI18n()
  const [data, setData] = useState<ReferralDashboardData | null>(null)
  const [myCode, setMyCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [dashboard, codeResult] = await Promise.all([
      getReferralDashboard(),
      getMyReferralCode(),
    ])
    setData(dashboard)
    setMyCode(codeResult.code)
    setLoading(false)
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    toast.success(t('common.copied'))
  }

  function handleShare(code: string) {
    const url = `${data?.shareLink || ''}${code}`
    if (navigator.share) {
      navigator.share({ title: 'Join SwiftVult', text: `Use my referral code ${code} to get a discount!`, url })
    } else {
      handleCopy(url)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-xl p-5 flex items-center gap-4">
              <div className="animate-pulse h-12 w-12 rounded-xl bg-[var(--color-border)]" />
              <div className="space-y-2">
                <div className="animate-pulse h-7 w-20 rounded bg-[var(--color-border)]" />
                <div className="animate-pulse h-3 w-24 rounded bg-[var(--color-border)]" />
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="animate-pulse h-5 w-36 mb-4 rounded bg-[var(--color-border)]" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border border-[var(--color-border)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="animate-pulse h-8 w-32 rounded-lg bg-[var(--color-border)]" />
                </div>
                <div className="animate-pulse h-3 w-48 mb-3 rounded bg-[var(--color-border)]" />
                <div className="flex gap-2">
                  <div className="animate-pulse h-8 w-24 rounded-lg bg-[var(--color-border)]" />
                  <div className="animate-pulse h-8 w-24 rounded-lg bg-[var(--color-border)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const hasCodes = data && data.referralCodes.length > 0

  return (
    <>
        {!hasCodes ? (
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-12 text-center">
              <Gift className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Referral Code Yet</h2>
              <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto mb-6">
                Referral codes are created by admins for influencers. If you're interested in becoming an influencer and earning commissions, contact our support team.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard/support'}
                >
                  Contact Support
                </Button>
                <Button
                  onClick={() => handleCopy(`${data?.shareLink || ''}`)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Invite Link
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {data.referralCodes.reduce((s, c) => s + c.times_used, 0)}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">Total Referrals</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-light)] rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{formatCurrency(data.totalEarned)}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Commission Earned</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{data.referralCodes.length}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Active Codes</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Share Your Codes</h2>
              <div className="space-y-3">
                {data.referralCodes.map((code) => (
                  <Card key={code.id} className="border border-[var(--color-border)]">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl font-mono font-bold text-lg tracking-wider">
                            {code.code}
                          </div>
                          <div className="text-xs text-[var(--color-text-muted)]">
                            <p>{code.discount_percent}% off for new users</p>
                            <p>{code.commission_percent}% commission for you</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-3">
                        <span className="flex items-center gap-1">
                          <UserPlus className="w-3 h-3" />
                          Used {code.times_used} times
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(code.total_commission)} earned
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(code.code)}
                        >
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Copy Code
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(`${data.shareLink}${code.code}`)}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          Copy Link
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleShare(code.code)}
                        >
                          <Share2 className="w-3.5 h-3.5 mr-1.5" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {data.referredUsers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Referred Users</h2>
                <Card className="border border-[var(--color-border)]">
                  <CardContent className="p-0">
                    <div className="divide-y divide-[var(--color-border)]">
                      {data.referredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{user.full_name || 'Unknown'}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                            <Calendar className="w-3 h-3" />
                            {new Date(user.joined_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {data.recentCommissions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Commission History</h2>
                <Card className="border border-[var(--color-border)]">
                  <CardContent className="p-0">
                    <div className="divide-y divide-[var(--color-border)]">
                      {data.recentCommissions.map((c) => (
                        <div key={c.id} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{c.description}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{new Date(c.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className="text-sm font-semibold text-[var(--color-accent)]">+{formatCurrency(c.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
    </>
  )
}
