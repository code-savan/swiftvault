'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useI18n } from '@/app/contexts/I18nContext'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Badge } from '@/app/components/ui/badge'
import {
  Search, Rocket, Package, ShoppingCart,
  ArrowLeft, Link as LinkIcon, ExternalLink,
  AlertCircle, ChevronRight, Users, Heart, Eye,
  MessageCircle, ThumbsUp, Music2, PlaySquare,
  Send, Gamepad2, Headphones, Globe, MessageSquare,
  Image, Camera, FileText,
  Bookmark, Zap, BarChart3, Wallet, CreditCard, Gift,
  type LucideIcon,
} from 'lucide-react'
import {
  getServices,
  syncServices,
  placeOrder,
  getUserOrders,
  syncPendingOrders,
} from '@/app/actions/boosting'
import {
  finalRate,
  finalPrice,
  type BoostingService,
  type BoostingOrder,
} from '@/app/lib/boosting'
import { toast } from 'sonner'

type Tab = 'services' | 'orders'
type View = 'platforms' | 'categories' | 'services'

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  INSTAGRAM: Camera,
  FACEBOOK: ThumbsUp,
  TIKTOK: Music2,
  TWITTER: MessageCircle,
  YOUTUBE: PlaySquare,
  TELEGRAM: Send,
  SNAPCHAT: Zap,
  LINKEDIN: Users,
  DISCORD: MessageSquare,
  REDDIT: Heart,
  PINTEREST: Bookmark,
  WHATSAPP: MessageCircle,
  TWITCH: Gamepad2,
  SOUNDCLOUD: Headphones,
  SPOTIFY: Headphones,
  KICK: Gamepad2,
  WEBSITE: Globe,
  QUORA: FileText,
  MEDIUM: FileText,
  TUMBLR: FileText,
  BLUESKY: Eye,
  THREADS: MessageSquare,
  BEHANCE: Image,
  DRIBBBLE: Image,
  GITHUB: BarChart3,
  TRUTHSOCIAL: Heart,
  GOOGLE: Globe,
  APPLE: Zap,
  TRUSTPILOT: BarChart3,
  BOOMPLAY: Music2,
  YELP: FileText,
}

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: 'from-pink-500 to-purple-600',
  FACEBOOK: 'from-blue-600 to-blue-700',
  TIKTOK: 'from-gray-900 to-gray-700',
  TWITTER: 'from-sky-500 to-blue-600',
  YOUTUBE: 'from-red-600 to-red-700',
  TELEGRAM: 'from-blue-500 to-cyan-600',
  SNAPCHAT: 'from-yellow-400 to-yellow-500',
  LINKEDIN: 'from-blue-700 to-blue-800',
  DISCORD: 'from-indigo-500 to-indigo-600',
  REDDIT: 'from-orange-500 to-red-500',
  PINTEREST: 'from-red-600 to-red-700',
  WHATSAPP: 'from-green-500 to-green-600',
  TWITCH: 'from-purple-600 to-violet-700',
  KICK: 'from-green-500 to-emerald-600',
  SOUNDCLOUD: 'from-orange-500 to-orange-600',
  SPOTIFY: 'from-green-500 to-emerald-600',
  WEBSITE: 'from-blue-500 to-indigo-600',
}

function extractPlatform(category: string): string {
  if (category.startsWith('[ X ]')) return 'TWITTER'
  const platform = category.split(' ')[0].replace(/[\[\]]/g, '')
  const known = Object.keys(PLATFORM_ICONS)
  if (known.includes(platform)) return platform
  if (known.some((k) => platform.startsWith(k))) return known.find((k) => platform.startsWith(k))!
  return platform
}

function extractLabel(category: string): string {
  if (category.startsWith('[ X ]')) {
    return category.replace('[ X ] TWITTER ', '').trim()
  }
  const parts = category.split(' ')
  parts.shift()
  return parts.join(' ').trim()
}

function formatSubcategory(raw: string): { display: string; tags: string[] } {
  const tags: string[] = []
  let display = raw
  const tagRegex = /\[(.*?)\]/g
  let match
  while ((match = tagRegex.exec(raw)) !== null) {
    tags.push(match[1].trim())
  }
  display = raw.replace(/\[.*?\]/g, '').trim()
  return { display, tags }
}

type Subcategory = {
  key: string
  display: string
  tags: string[]
  services: BoostingService[]
}

type PlatformData = {
  platform: string
  icon: LucideIcon
  color: string
  subcategories: Subcategory[]
  totalServices: number
}

export default function BoostingPage() {
  const { t } = useI18n()
  const { user } = useUser()
  const [services, setServices] = useState<BoostingService[]>([])
  const [orders, setOrders] = useState<BoostingOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('services')
  const [view, setView] = useState<View>('platforms')
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<BoostingService | null>(null)
  const [orderLink, setOrderLink] = useState('')
  const [orderQuantity, setOrderQuantity] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [paying, setPaying] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [referralDiscount, setReferralDiscount] = useState(0)
  const [referralApplied, setReferralApplied] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const hasPendingOrders = useMemo(
    () => orders.some(o => ['pending', 'processing', 'in_progress'].includes(o.status)),
    [orders]
  )

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!activeTab || activeTab !== 'orders') return
    if (!hasPendingOrders) return
    const interval = setInterval(async () => {
      try {
        const result = await syncPendingOrders()
        if (result.synced > 0) {
          const updated = await getUserOrders()
          setOrders(updated)
        }
      } catch {
        // silent
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [activeTab, hasPendingOrders])

  async function loadData() {
    setLoading(true)
    try {
      const [servicesData, ordersData] = await Promise.all([
        getServices(),
        getUserOrders(),
      ])
      setServices(servicesData)
      setOrders(ordersData)

      // If cache is empty, sync from Sizzle in background
      if (servicesData.length === 0) {
        syncServices().then((result) => {
          if (result.count > 0) {
            getServices().then(setServices)
          }
        })
      }
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const platforms = useMemo(() => {
    const map = new Map<string, Map<string, BoostingService[]>>()
    for (const svc of services) {
      const platform = extractPlatform(svc.category)
      const rawLabel = extractLabel(svc.category)
      if (!map.has(platform)) map.set(platform, new Map())
      const catMap = map.get(platform)!
      if (!catMap.has(rawLabel)) catMap.set(rawLabel, [])
      catMap.get(rawLabel)!.push(svc)
    }
    const result: PlatformData[] = []
    for (const [platform, catMap] of map) {
      const subcategories: Subcategory[] = []
      let totalServices = 0
      for (const [key, svcs] of catMap) {
        const { display, tags } = formatSubcategory(key)
        subcategories.push({ key, display, tags, services: svcs })
        totalServices += svcs.length
      }
      subcategories.sort((a, b) => b.services.length - a.services.length)
      result.push({
        platform,
        icon: PLATFORM_ICONS[platform] || Package,
        color: PLATFORM_COLORS[platform] || 'from-gray-500 to-gray-600',
        subcategories,
        totalServices,
      })
    }
    result.sort((a, b) => b.totalServices - a.totalServices)
    return result
  }, [services])

  const activePlatform = useMemo(
    () => platforms.find((p) => p.platform === selectedPlatform),
    [platforms, selectedPlatform]
  )
  const activeSubcategory = useMemo(
    () => activePlatform?.subcategories.find((s) => s.key === selectedSubcategory),
    [activePlatform, selectedSubcategory]
  )

  const filteredPlatforms = useMemo(
    () =>
      searchQuery
        ? platforms.filter(
            (p) =>
              p.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.subcategories.some((s) =>
                s.key.toLowerCase().includes(searchQuery.toLowerCase())
              )
          )
        : platforms,
    [platforms, searchQuery]
  )

  const filteredSubcategories = useMemo(
    () =>
      searchQuery
        ? activePlatform?.subcategories.filter(
            (s) =>
              s.display.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
          ) ?? []
        : activePlatform?.subcategories ?? [],
    [activePlatform, searchQuery]
  )

  const filteredServices = useMemo(
    () =>
      searchQuery
        ? activeSubcategory?.services.filter(
            (s) =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.category.toLowerCase().includes(searchQuery.toLowerCase())
          ) ?? activeSubcategory?.services ?? []
        : activeSubcategory?.services ?? [],
    [activeSubcategory, searchQuery]
  )

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

  async function handlePlaceOrder() {
    if (!selectedService || !orderLink || !orderQuantity) {
      toast.error('Please fill in all fields')
      return
    }
    const qty = parseInt(orderQuantity)
    if (isNaN(qty) || qty < selectedService.min_quantity || qty > selectedService.max_quantity) {
      toast.error(`Quantity must be between ${selectedService.min_quantity} and ${selectedService.max_quantity}`)
      return
    }
    if (!orderLink.startsWith('http')) {
      toast.error('Please enter a valid URL')
      return
    }
    setOrdering(true)
    try {
      const result = await placeOrder(selectedService.id, orderLink, qty, referralApplied ? referralCode : undefined)
      if (result.success) {
        toast.success('Order placed successfully!')
        setSelectedService(null)
        setOrderLink('')
        setOrderQuantity('')
        setReferralCode('')
        setReferralDiscount(0)
        setReferralApplied(false)
        loadData()
      } else {
        toast.error(result.error || 'Failed to place order')
      }
    } catch {
      toast.error('Failed to place order')
    } finally {
      setOrdering(false)
    }
  }

  function calculatePrice(service: BoostingService, quantity: number): number {
    return finalPrice(service, quantity)
  }

  async function handleCardPayment() {
    if (!selectedService || !orderLink || !orderQuantity) return
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error('No email on your account. Please update your profile.')
      return
    }

    const qty = parseInt(orderQuantity)
    if (isNaN(qty) || qty < selectedService.min_quantity || qty > selectedService.max_quantity) {
      toast.error(`Quantity must be between ${selectedService.min_quantity} and ${selectedService.max_quantity}`)
      return
    }
    if (!orderLink.startsWith('http') && !orderLink.includes('@')) {
      toast.error('Please enter a valid URL or email')
      return
    }

    setPaying(true)
    try {
      const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      if (!paystackKey) {
        toast.error('Card payments not configured. Contact support.')
        setPaying(false)
        return
      }

      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          link: orderLink,
          quantity: qty,
          serviceName: selectedService.name,
          category: selectedService.category,
          rate: selectedService.rate,
          markupRate: selectedService.markup_rate,
        }),
      })

      const initData = await initRes.json()
      if (!initData.accessCode) {
        toast.error(initData.error || 'Failed to initialize payment')
        setPaying(false)
        return
      }

      // Load Paystack inline script
      if (!(window as any).PaystackPop) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://js.paystack.co/v1/inline.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Failed to load Paystack'))
          document.head.appendChild(script)
        })
      }

      const popup = new (window as any).PaystackPop()
      popup.newTransaction({
        key: paystackKey,
        email: user.primaryEmailAddress!.emailAddress,
        amount: Math.round(calculatePrice(selectedService, qty) * 100),
        ref: initData.reference,
        onSuccess: async () => {
          const verifyRes = await fetch('/api/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: initData.reference }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.verified) {
            toast.success('Payment successful! Order placed.')
            setSelectedService(null)
            setOrderLink('')
            setOrderQuantity('')
            loadData()
          } else {
            toast.error('Payment verification failed. Contact support.')
          }
        },
        onCancel: () => {
          toast.info('Payment cancelled')
          setPaying(false)
        },
        onError: () => {
          toast.error('Payment failed. Try again.')
          setPaying(false)
        },
      })
    } catch (error) {
      console.error('Card payment error:', error)
      toast.error('Payment failed. Try again.')
      setPaying(false)
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
    partial: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]',
  }

  function goBack() {
    if (view === 'services') {
      setView('categories')
      setSelectedSubcategory(null)
    } else if (view === 'categories') {
      setView('platforms')
      setSelectedPlatform(null)
    }
  }

  function selectPlatform(platform: string) {
    setSelectedPlatform(platform)
    setView('categories')
    setSelectedSubcategory(null)
  }

  function selectSubcategory(key: string) {
    setSelectedSubcategory(key)
    setView('services')
  }

  return (
    <>
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          {(view === 'categories' || view === 'services') && (
            <button onClick={goBack} className="p-2 hover:bg-[var(--color-bg)] rounded-lg">
              <ArrowLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              {view === 'platforms' && 'SMM Services'}
              {view === 'categories' && selectedPlatform}
              {view === 'services' && activeSubcategory?.display}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              {view === 'platforms' && 'Choose a platform to get started'}
              {view === 'categories' && `${activePlatform?.totalServices ?? 0} services available`}
              {view === 'services' && `${filteredServices.length} services`}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-56"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'services' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => { setActiveTab('services'); setView('platforms'); setSelectedPlatform(null); setSelectedSubcategory(null) }}
          >
            <Rocket className="w-4 h-4 mr-2" />
            {t('boosting.services')}
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('orders')}
          >
            <Package className="w-4 h-4 mr-2" />
            My Orders ({orders.length})
          </Button>
        </div>

        {activeTab === 'orders' ? (
          orders.length === 0 ? (
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
              <Package className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-muted)]">No orders yet</p>
            </div>
          ) : (
            <Card className="border border-[var(--color-border)]">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                        <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Service</th>
                        <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Link</th>
                        <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Qty</th>
                        <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Charge</th>
                        <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-6 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-[var(--color-bg)] transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[200px]">{order.service_name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={order.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1 truncate max-w-[150px]"
                            >
                              <LinkIcon className="w-3 h-3 flex-shrink-0" />
                              {order.link}
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-[var(--color-text-secondary)]">{order.quantity.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">₦{order.charge.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]'}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-[var(--color-text-muted)]">{new Date(order.created_at).toLocaleDateString()}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )
        ) : loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                <div className="animate-pulse h-24 bg-[var(--color-border)]" />
                <div className="p-4 space-y-2">
                  <div className="animate-pulse h-4 w-28 bg-[var(--color-border)] rounded" />
                  <div className="animate-pulse h-3 w-20 bg-[var(--color-border)] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : view === 'platforms' ? (
          /* Platform Grid */
          filteredPlatforms.length === 0 ? (
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
              <Rocket className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-muted)]">{t('common.noResults')}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPlatforms.map((p) => {
                const Icon = p.icon
                return (
                  <Card
                    key={p.platform}
                    onClick={() => selectPlatform(p.platform)}
                    className="border border-[var(--color-border)] hover:shadow-md transition-all cursor-pointer group"
                  >
                    <CardContent className="p-5">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3 shadow-sm`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{p.platform}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[var(--color-text-muted)]">{p.totalServices} services</p>
                        <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.subcategories.slice(0, 3).map((s) => (
                          <span key={s.key} className="text-[10px] px-2 py-0.5 bg-[var(--color-bg)] text-[var(--color-text-muted)] rounded-full truncate max-w-[120px]">
                            {s.display}
                          </span>
                        ))}
                        {p.subcategories.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 bg-[var(--color-bg)] text-[var(--color-text-muted)] rounded-full">
                            +{p.subcategories.length - 3}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )
        ) : view === 'categories' ? (
          /* Subcategory Grid for selected platform */
          filteredSubcategories.length === 0 ? (
            <div className="text-center py-16 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
              <Rocket className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-sm text-[var(--color-text-muted)]">{t('common.noResults')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubcategories.map((sub) => (
                <Card
                  key={sub.key}
                  onClick={() => selectSubcategory(sub.key)}
                  className="border border-[var(--color-border)] hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--color-text-primary)]">{sub.display}</h3>
                        {sub.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">{sub.services.length} services</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors flex-shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          /* Services list for selected subcategory */
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="border border-[var(--color-border)] hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedService(service)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{service.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          Min: {service.min_quantity.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          Max: {service.max_quantity.toLocaleString()}
                        </span>
                        <span>₦{finalRate(service).toLocaleString()}/1K</span>
                        {service.dripfeed && (
                          <Badge variant="outline" className="text-[10px]">Drip Feed</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="flex-shrink-0"
                      onClick={(e) => { e.stopPropagation(); setSelectedService(service) }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      {/* Order Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--color-surface)] rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in-95">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Place Order</h2>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 hover:bg-[var(--color-bg)] rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-[var(--color-bg)] rounded-xl">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{selectedService.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{selectedService.category}</p>
                <div className="flex gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
                  <span>Min: {selectedService.min_quantity.toLocaleString()}</span>
                  <span>Max: {selectedService.max_quantity.toLocaleString()}</span>
                  <span>Rate: ₦{finalRate(selectedService).toLocaleString()}/1K</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Link</label>
                  <Input
                    placeholder="https://instagram.com/username"
                    value={orderLink}
                    onChange={(e) => setOrderLink(e.target.value)}
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">URL to the page/profile to boost</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Quantity</label>
                  <Input
                    type="number"
                    placeholder={`Min: ${selectedService.min_quantity}`}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    min={selectedService.min_quantity}
                    max={selectedService.max_quantity}
                  />
                  {orderQuantity && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Price: ~₦{calculatePrice(selectedService, parseInt(orderQuantity) || 0).toLocaleString()}
                      {referralApplied && (
                        <span className="text-[var(--color-accent)] ml-2">
                          ({referralDiscount}% off)
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Referral code */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                    <Gift className="w-4 h-4 inline mr-1 text-purple-500" />
                    Referral Code (optional)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter referral code"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      disabled={referralApplied}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyReferral}
                      disabled={referralApplied || !referralCode.trim()}
                      className="shrink-0"
                    >
                      {referralApplied ? 'Applied' : 'Apply'}
                    </Button>
                  </div>
                  {referralApplied && (
                    <button
                      onClick={() => { setReferralApplied(false); setReferralDiscount(0); setReferralCode('') }}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={ordering || paying || !orderLink || !orderQuantity}
                  className="flex-1"
                >
                  {ordering ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Pay with Wallet
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCardPayment}
                  disabled={ordering || paying || !orderLink || !orderQuantity}
                  variant="outline"
                >
                  {paying ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-[var(--color-text-primary)] border-t-transparent rounded-full" />
                      Paying...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Card
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
