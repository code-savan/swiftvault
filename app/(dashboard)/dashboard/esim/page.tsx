'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useI18n } from '@/app/contexts/I18nContext'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { getPlans, purchasePlan, getUserOrders } from '@/app/actions/esim'
import { finalPrice, COUNTRY_MAP } from '@/app/lib/esim'
import { formatCurrency } from '@/app/lib/utils'
import { toast } from 'sonner'
import {
  Search, Globe, Zap, Wifi, Signal,
  ChevronRight, Smartphone, CheckCircle, Copy, Loader2,
  ArrowLeft, Package, Gift
} from 'lucide-react'

import type { ESIMPlan, ESIMOrder, CountryGroup } from '@/app/lib/esim'

type View = 'countries' | 'plans' | 'orders'

const GROUP_LABELS: Record<CountryGroup | 'Global', string> = {
  Africa: 'Africa',
  Asia: 'Asia',
  Europe: 'Europe',
  'North America': 'North America',
  'South America': 'South America',
  Oceania: 'Oceania',
  'Middle East': 'Middle East',
  Global: 'Global',
}

export default function ESIMPage() {
  const [view, setView] = useState<View>('countries')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [plans, setPlans] = useState<ESIMPlan[]>([])
  const [orders, setOrders] = useState<ESIMOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [referralApplied, setReferralApplied] = useState(false)
  const [referralDiscount, setReferralDiscount] = useState(0)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [purchasedOrder, setPurchasedOrder] = useState<{
    orderId: string
    planName: string
    qrCode: string | null
    activationCode: string | null
  } | null>(null)
  const { user } = useUser()
  const { t } = useI18n()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [loadedPlans, loadedOrders] = await Promise.all([
      getPlans(),
      getUserOrders(),
    ])
    setPlans(loadedPlans)
    setOrders(loadedOrders)
    setLoading(false)
  }

  const filteredPlans = searchQuery
    ? plans.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : plans

  const groupedCountries = COUNTRY_MAP.reduce((acc, c) => {
    if (!acc[c.group]) acc[c.group] = []
    acc[c.group].push(c)
    return acc
  }, {} as Record<CountryGroup, typeof COUNTRY_MAP>)

  const plansByCountry = selectedCountry
    ? filteredPlans.filter(
        (p) =>
          p.country.toLowerCase() === selectedCountry.toLowerCase() ||
          p.region.toLowerCase() === selectedCountry.toLowerCase()
      )
    : []

  const globalPlans = filteredPlans.filter((p) => p.plan_type === 'global' || p.plan_type === 'regional')

  function handleCountryClick(name: string) {
    setSelectedCountry(name)
    setView('plans')
    setSearchQuery('')
  }

  function handleBack() {
    setView('countries')
    setSelectedCountry(null)
    setPurchasedOrder(null)
  }

  async function handleApplyReferral() {
    if (!referralCode.trim()) return
    try {
      const res = await fetch(`/api/referral/validate?code=${referralCode}`)
      const data = await res.json()
      if (data.valid) {
        setReferralDiscount(data.discount_percent)
        setReferralApplied(true)
        toast.success(`${data.discount_percent}% discount applied!`)
      } else {
        toast.error('Invalid referral code')
      }
    } catch {
      toast.error('Failed to validate code')
    }
  }

  async function handlePurchase(plan: ESIMPlan) {
    setPurchasing(plan.id)
    try {
      const result = await purchasePlan(plan.id, referralApplied ? referralCode : undefined)
      if (result.success && result.orderId) {
        setPurchasedOrder({
          orderId: result.orderId,
          planName: plan.name,
          qrCode: plan.id,
          activationCode: plan.id,
        })
        toast.success('eSIM purchased!')
        loadData()
      } else {
        toast.error(result.error || 'Failed to purchase')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setPurchasing(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="animate-pulse h-10 w-56 bg-[var(--color-border)] rounded-lg ml-auto" />
        </div>
        <div className="space-y-8">
          {['Africa', 'Europe', 'Asia'].map((group) => (
            <div key={group}>
              <div className="animate-pulse h-5 w-28 mb-3 bg-[var(--color-border)] rounded" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-[var(--color-border)] rounded-xl p-4">
                    <div className="animate-pulse h-5 w-5 bg-[var(--color-border)] rounded mb-2" />
                    <div className="animate-pulse h-4 w-24 bg-[var(--color-border)] rounded mb-1" />
                    <div className="animate-pulse h-3 w-16 bg-[var(--color-border)] rounded" />
                  </div>
                ))}
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
          {view !== 'countries' && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-[var(--color-bg)] rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          )}
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <Input
              placeholder={t('esim.searchDestinations')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 w-48"
            />
          </div>
          <button
            onClick={() => setView(view === 'orders' ? 'countries' : 'orders')}
            className={`p-2.5 rounded-xl transition-colors ${
              view === 'orders'
                ? 'bg-[var(--color-accent)] text-white'
                : 'hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)]'
            }`}
          >
            <Package className="w-5 h-5" />
          </button>
        </div>

        {/* Referral code bar */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-purple-50 rounded-xl border border-purple-100">
          <Gift className="w-5 h-5 text-purple-500 shrink-0" />
          <div className="flex items-center gap-2 flex-1">
            <input
              placeholder="Referral code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              disabled={referralApplied}
              className="flex-1 h-9 px-3 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              onClick={handleApplyReferral}
              disabled={referralApplied || !referralCode.trim()}
              className="h-9 px-4 text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg)] disabled:opacity-50"
            >
              {referralApplied ? `${referralDiscount}% Off` : 'Apply'}
            </button>
            {referralApplied && (
              <button
                onClick={() => { setReferralApplied(false); setReferralDiscount(0); setReferralCode('') }}
                className="text-xs text-red-500 hover:underline shrink-0"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {view === 'countries' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{COUNTRY_MAP.length}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('esim.destinations')}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--color-accent-light)] rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">&lt;60s</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('esim.instantActivation')}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">4G/5G</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('esim.highSpeed')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {searchQuery ? (
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                    {t('common.searchResults')}
                  </h2>
                  {filteredPlans.length === 0 ? (
                    <Card className="border border-[var(--color-border)]">
                      <CardContent className="p-12 text-center">
                        <Signal className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                        <p className="text-sm text-[var(--color-text-muted)]">{t('common.noData')}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPlans.map((plan) => (
                        <PlanCard
                          key={plan.id}
                          plan={plan}
                          purchasing={purchasing}
                          onPurchase={handlePurchase}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {Object.entries(groupedCountries).map(([group, countries]) => (
                    <div key={group}>
                      <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                        {GROUP_LABELS[group as CountryGroup]}
                      </h2>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {countries
                          .filter((c) =>
                            !searchQuery ||
                            c.name.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((c) => (
                            <button
                              key={c.code}
                              onClick={() => handleCountryClick(c.name)}
                              className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-text-muted)] hover:shadow-sm transition-all text-left"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{c.flag}</span>
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{c.name}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}

                  {globalPlans.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                        {t('esim.regionalAndGlobal')}
                      </h2>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {globalPlans.map((plan) => (
                          <PlanCard
                            key={plan.id}
                            plan={plan}
                            purchasing={purchasing}
                            onPurchase={handlePurchase}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {view === 'plans' && selectedCountry && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              {selectedCountry} {t('esim.plans')}
            </h2>
            {plansByCountry.length === 0 ? (
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-12 text-center">
                  <Signal className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                  <p className="text-sm text-[var(--color-text-muted)]">{t('common.noData')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plansByCountry.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    purchasing={purchasing}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'orders' && (
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              {t('esim.myOrders')}
            </h2>
            {orders.length === 0 ? (
              <Card className="border border-[var(--color-border)]">
                <CardContent className="p-12 text-center">
                  <Package className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                  <p className="text-sm text-[var(--color-text-muted)]">{t('common.noData')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id} className="border border-[var(--color-border)]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{order.plan_name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{order.iccid}</p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                        <span>{t('common.charged')}: {formatCurrency(order.charge)}</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      {order.activation_code && (
                        <div className="mt-3 p-3 bg-[var(--color-bg)] rounded-lg">
                          <p className="text-xs text-[var(--color-text-muted)] mb-1">{t('esim.activationCode')}</p>
                          <div className="flex items-center justify-between">
                            <code className="text-xs font-mono text-[var(--color-text-primary)] break-all">
                              {order.activation_code}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(order.activation_code!)
                                toast.success(t('common.copied'))
                              }}
                              className="p-1.5 hover:bg-[var(--color-border)] rounded-lg shrink-0 ml-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                            </button>
                          </div>
                        </div>
                      )}
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

function PlanCard({
  plan,
  purchasing,
  onPurchase,
}: {
  plan: ESIMPlan
  purchasing: string | null
  onPurchase: (plan: ESIMPlan) => void
}) {
  const { t } = useI18n()
  const displayPrice = finalPrice(plan)
  const countryInfo = COUNTRY_MAP.find(
    (c) => c.name.toLowerCase() === plan.country.toLowerCase()
  )

  return (
    <Card className="border border-[var(--color-border)] hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {countryInfo && <span className="text-lg">{countryInfo.flag}</span>}
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">{plan.name}</span>
          </div>
          {plan.plan_type !== 'single' && (
            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
              {plan.plan_type}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">{plan.description}</p>
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mb-4">
          <span className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            {plan.data_amount}
          </span>
          <span className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            {plan.validity}
          </span>
          {plan.coverage_countries > 1 && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {plan.coverage_countries} {plan.coverage_countries === 1 ? 'country' : 'countries'}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{formatCurrency(displayPrice)}</p>
          <Button
            size="sm"
            onClick={() => onPurchase(plan)}
            disabled={purchasing === plan.id}
          >
            {purchasing === plan.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t('esim.buyNow')
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    issued: 'bg-blue-100 text-blue-700',
    active: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
    expired: 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]'}`}>
      {status}
    </span>
  )
}
