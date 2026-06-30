'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import {
  Search, Package, DollarSign, Percent, RefreshCw, Eye, EyeOff, Save, X,
} from 'lucide-react'
import {
  getAdminOtpServices,
  syncOtpServices,
  updateOtpService,
  getAdminPricingTiers,
  updatePricingTier,
} from '@/app/actions/admin-otp'
import { toast } from 'sonner'

type Tab = 'services' | 'tiers'

interface OtpService {
  code: string
  name: string
  visible: boolean
  custom_price: number | null
}

interface PricingTier {
  id: number
  min_ngn: number
  max_ngn: number | null
  multiplier: number
}

export default function AdminOtpPage() {
  const [services, setServices] = useState<OtpService[]>([])
  const [tiers, setTiers] = useState<PricingTier[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('services')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [priceValue, setPriceValue] = useState('')
  const [editingTier, setEditingTier] = useState<number | null>(null)
  const [tierForm, setTierForm] = useState({ min_ngn: '', max_ngn: '', multiplier: '' })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [sRes, tRes] = await Promise.all([getAdminOtpServices(), getAdminPricingTiers()])
      setServices(sRes.services)
      setTiers(tRes.tiers)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await syncOtpServices()
      toast.success(`Synced ${res.synced} services`)
      await loadData()
    } catch {
      toast.error('Failed to sync services')
    } finally {
      setSyncing(false)
    }
  }

  async function handleToggleVisible(code: string, current: boolean) {
    try {
      await updateOtpService(code, { visible: !current })
      setServices(prev => prev.map(s => s.code === code ? { ...s, visible: !current } : s))
      toast.success(!current ? 'Service visible' : 'Service hidden')
    } catch {
      toast.error('Failed to update')
    }
  }

  async function handleSavePrice(code: string) {
    const val = priceValue === '' ? null : parseFloat(priceValue)
    if (priceValue !== '' && (isNaN(val!) || val! < 0)) {
      toast.error('Enter a valid price or leave empty for formula')
      return
    }
    try {
      await updateOtpService(code, { custom_price: val })
      setServices(prev => prev.map(s => s.code === code ? { ...s, custom_price: val } : s))
      setEditingPrice(null)
      toast.success('Price updated')
    } catch {
      toast.error('Failed to update price')
    }
  }

  async function handleSaveTier(id: number) {
    const min = parseFloat(tierForm.min_ngn)
    const max = tierForm.max_ngn === '' ? null : parseFloat(tierForm.max_ngn)
    const mult = parseFloat(tierForm.multiplier)
    if (isNaN(min) || isNaN(mult)) {
      toast.error('Invalid values')
      return
    }
    try {
      await updatePricingTier(id, { min_ngn: min, max_ngn: max, multiplier: mult })
      setTiers(prev => prev.map(t => t.id === id ? { ...t, min_ngn: min, max_ngn: max, multiplier: mult } : t))
      setEditingTier(null)
      toast.success('Tier updated')
    } catch {
      toast.error('Failed to update tier')
    }
  }

  function startEditTier(tier: PricingTier) {
    setEditingTier(tier.id)
    setTierForm({
      min_ngn: String(tier.min_ngn),
      max_ngn: tier.max_ngn !== null ? String(tier.max_ngn) : '',
      multiplier: String(tier.multiplier),
    })
  }

  const filteredServices = useMemo(
    () => services.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [services, searchQuery]
  )

  const stats = useMemo(() => {
    const total = services.length
    const visible = services.filter(s => s.visible).length
    const overridden = services.filter(s => s.custom_price != null).length
    return { total, visible, hidden: total - visible, overridden }
  }, [services])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-border)] border-t-[var(--color-accent)]" />
      </div>
    )
  }

  const baseThClass = "text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]"

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">OTP Management</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage OTP services, visibility, and pricing</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'services' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('services')}
        >
          <Package className="w-4 h-4 mr-2" />
          Services ({stats.total})
        </Button>
        <Button
          variant={activeTab === 'tiers' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('tiers')}
        >
          <Percent className="w-4 h-4 mr-2" />
          Pricing Tiers ({tiers.length})
        </Button>
      </div>

      {activeTab === 'services' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border border-[var(--color-border)]">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{stats.total}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Total Services</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-[var(--color-border)]">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{stats.visible}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Visible</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-[var(--color-border)]">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{stats.hidden}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Hidden</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-[var(--color-border)]">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{stats.overridden}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Price Overrides</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-[var(--color-border)] mb-6">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-11 pr-4 py-2.5 w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync from API'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={baseThClass}>Code</th>
                      <th className={baseThClass}>Name</th>
                      <th className={`${baseThClass} text-center`}>Visible</th>
                      <th className={`${baseThClass} text-right`}>Custom Price (₦)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {filteredServices.map(s => (
                      <tr key={s.code} className="hover:bg-[var(--color-bg)] transition-colors">
                        <td className="px-4 py-3">
                          <code className="text-sm bg-[var(--color-bg)] border border-[var(--color-border)] px-2 py-0.5 text-[var(--color-text-primary)]">{s.code}</code>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">{s.name}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleVisible(s.code, s.visible)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                              s.visible
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:bg-gray-100'
                            }`}
                          >
                            {s.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {s.visible ? 'Visible' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editingPrice === s.code ? (
                            <div className="flex items-center justify-end gap-2">
                              <Input
                                type="number"
                                value={priceValue}
                                onChange={e => setPriceValue(e.target.value)}
                                className="w-28 h-8 text-sm text-right"
                                placeholder="Formula"
                              />
                              <button onClick={() => handleSavePrice(s.code)} className="p-1 hover:text-green-600">
                                <Save className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingPrice(null)} className="p-1 hover:text-red-600">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingPrice(s.code)
                                setPriceValue(s.custom_price !== null ? String(s.custom_price) : '')
                              }}
                              className="text-sm hover:text-[var(--color-accent)] transition-colors"
                            >
                              {s.custom_price !== null ? (
                                <span className="font-medium text-[var(--color-text-primary)]">₦{s.custom_price.toLocaleString()}</span>
                              ) : (
                                <span className="text-[var(--color-text-muted)] italic">Formula</span>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredServices.length === 0 && (
                <div className="text-center py-8 text-[var(--color-text-muted)]">
                  {searchQuery ? 'No matching services' : 'No services synced yet. Click "Sync from API".'}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'tiers' && (
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Pricing Tiers</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Raw NGN price is looked up in these tiers to determine the multiplier.
              Set max to empty for open-ended ranges (e.g., 3000+).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={baseThClass}>Min (₦)</th>
                    <th className={baseThClass}>Max (₦)</th>
                    <th className={baseThClass}>Multiplier</th>
                    <th className={`${baseThClass} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {tiers.map(tier => (
                    <tr key={tier.id} className="hover:bg-[var(--color-bg)] transition-colors">
                      {editingTier === tier.id ? (
                        <>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={tierForm.min_ngn}
                              onChange={e => setTierForm(p => ({ ...p, min_ngn: e.target.value }))}
                              className="w-24 h-8 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={tierForm.max_ngn}
                              onChange={e => setTierForm(p => ({ ...p, max_ngn: e.target.value }))}
                              className="w-24 h-8 text-sm"
                              placeholder="No max"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              step="0.5"
                              value={tierForm.multiplier}
                              onChange={e => setTierForm(p => ({ ...p, multiplier: e.target.value }))}
                              className="w-20 h-8 text-sm"
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => handleSaveTier(tier.id)} className="p-1 hover:text-green-600 mr-1">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingTier(null)} className="p-1 hover:text-red-600">
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">₦{Number(tier.min_ngn).toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                            {tier.max_ngn !== null ? `₦${Number(tier.max_ngn).toLocaleString()}` : <span className="text-[var(--color-text-muted)] italic">Unlimited</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-0.5 text-xs bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
                              {Number(tier.multiplier)}x
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => startEditTier(tier)}
                              className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium"
                            >
                              Edit
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
