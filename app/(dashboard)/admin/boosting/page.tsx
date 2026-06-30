'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import {
  Search, Package, TrendingUp, DollarSign, Percent,
  Edit3, Save, X, RefreshCw,
} from 'lucide-react'
import {
  getAdminServices,
  updateMarkupRate,
  updateBulkMarkupRate,
  getBoostingOrders,
  type AdminBoostingService,
} from '@/app/actions/admin-boosting'
import { formatCurrency } from '@/app/lib/utils'
import { toast } from 'sonner'

type Tab = 'pricing' | 'orders' | 'categories'

export default function AdminBoostingPage() {
  const [services, setServices] = useState<AdminBoostingService[]>([])
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof getBoostingOrders>>>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('pricing')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [bulkCategory, setBulkCategory] = useState('')
  const [bulkRate, setBulkRate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [s, o] = await Promise.all([getAdminServices(), getBoostingOrders()])
      setServices(s)
      setOrders(o)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = services.length
    const avgMarkup = total > 0
      ? services.reduce((s, svc) => s + svc.markup_rate, 0) / total
      : 0
    const completedOrders = orders.filter((o) => o.status === 'completed')
    const totalRevenue = completedOrders.reduce((s, o) => s + o.charge, 0)
    const totalProfit = completedOrders.reduce((s, o) => s + o.profit, 0)
    return { total, avgMarkup, totalRevenue, totalProfit, completedOrders: completedOrders.length }
  }, [services, orders])

  const categories = useMemo(() => {
    const map = new Map<string, AdminBoostingService[]>()
    for (const svc of services) {
      if (!map.has(svc.category)) map.set(svc.category, [])
      map.get(svc.category)!.push(svc)
    }
    return Array.from(map.entries())
      .map(([category, svcs]) => ({
        category,
        count: svcs.length,
        avgMarkup: svcs.reduce((s, svc) => s + svc.markup_rate, 0) / svcs.length,
      }))
      .sort((a, b) => b.count - a.count)
  }, [services])

  const filteredServices = useMemo(
    () =>
      searchQuery
        ? services.filter(
            (s) =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.id.includes(searchQuery)
          )
        : services,
    [services, searchQuery]
  )

  async function handleSaveMarkup(serviceId: string) {
    const rate = parseFloat(editValue)
    if (isNaN(rate) || rate < 0.5 || rate > 10) {
      toast.error('Rate must be between 0.5 and 10')
      return
    }
    setSaving(true)
    const result = await updateMarkupRate(serviceId, rate)
    if (result.success) {
      toast.success('Markup rate updated')
      setEditingId(null)
      loadData()
    } else {
      toast.error(result.error || 'Failed to update')
    }
    setSaving(false)
  }

  async function handleBulkUpdate() {
    const rate = parseFloat(bulkRate)
    if (isNaN(rate) || rate < 0.5 || rate > 10) {
      toast.error('Rate must be between 0.5 and 10')
      return
    }
    setSaving(true)
    const result = await updateBulkMarkupRate(bulkCategory || null, rate)
    if (result.success) {
      toast.success(`Updated ${result.count} services`)
      setBulkCategory('')
      setBulkRate('')
      loadData()
    } else {
      toast.error(result.error || 'Failed to update')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-border)] border-t-[var(--color-accent)] mx-auto mb-4" />
        <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
      </div>
    )
  }

  const baseThClass = "text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]"

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Boosting — Pricing & Orders</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage markup rates across all boosting services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Total Services</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)]">{stats.total.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
              <Percent className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Avg Markup</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)]">{((stats.avgMarkup - 1) * 100).toFixed(0)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Revenue (completed)</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)]">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Profit (completed)</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)]">{formatCurrency(stats.totalProfit)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'pricing' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('pricing')}
          className={activeTab === 'pricing' ? '' : ''}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Per-Service Pricing ({filteredServices.length})
        </Button>
        <Button
          variant={activeTab === 'categories' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('categories')}
        >
          <Percent className="w-4 h-4 mr-2" />
          Bulk by Category ({categories.length})
        </Button>
        <Button
          variant={activeTab === 'orders' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('orders')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Orders ({orders.length})
        </Button>
      </div>

      {activeTab === 'pricing' && (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <Input
              placeholder="Search by name, category, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-2.5"
            />
          </div>

          {/* Services table */}
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={baseThClass}>Service</th>
                      <th className={baseThClass}>Category</th>
                      <th className={`${baseThClass} text-right`}>Cost /1K</th>
                      <th className={`${baseThClass} text-right`}>Markup</th>
                      <th className={`${baseThClass} text-right`}>Price /1K</th>
                      <th className={`${baseThClass} text-right`}>Profit /1K</th>
                      <th className={`${baseThClass} text-center`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {filteredServices.map((svc) => {
                      const costPer1K = svc.rate
                      const pricePer1K = Math.ceil(svc.rate * svc.markup_rate * 100) / 100
                      const profitPer1K = pricePer1K - costPer1K
                      const marginPct = ((svc.markup_rate - 1) * 100).toFixed(0)
                      return (
                        <tr key={svc.id} className="hover:bg-[var(--color-bg)] transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate max-w-[250px]" title={svc.name}>
                              {svc.name}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[180px] inline-block" title={svc.category}>
                              {svc.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm text-[var(--color-text-secondary)]">₦{costPer1K.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {editingId === svc.id ? (
                              <div className="flex items-center justify-end gap-1">
                                <Input
                                  type="number"
                                  step="0.05"
                                  min="0.5"
                                  max="10"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-20 h-8 text-xs text-right"
                                />
                                <button
                                  onClick={() => handleSaveMarkup(svc.id)}
                                  disabled={saving}
                                  className="p-1 hover:bg-green-50 text-green-600"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1 hover:bg-gray-50 text-[var(--color-text-muted)]"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className={`inline-flex items-center px-2 py-0.5 text-xs font-mono cursor-pointer hover:opacity-80 ${
                                  parseFloat(marginPct) >= 25 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                }`}
                                onClick={() => { setEditingId(svc.id); setEditValue(String(svc.markup_rate)) }}
                              >
                                +{marginPct}%
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-semibold text-[var(--color-text-primary)]">₦{pricePer1K.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`text-sm font-medium ${profitPer1K > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              ₦{profitPer1K.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => { setEditingId(svc.id); setEditValue(String(svc.markup_rate)) }}
                              className="p-1.5 hover:bg-gray-50 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'categories' && (
        <>
          <Card className="border border-[var(--color-border)] mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">Bulk Update by Category</h3>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Category filter (optional)</label>
                  <Input
                    placeholder="e.g. INSTAGRAM Followers"
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value)}
                    className="text-sm"
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Leave empty to update ALL services</p>
                </div>
                <div className="w-28">
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Markup rate</label>
                  <Input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="10"
                    placeholder="1.25"
                    value={bulkRate}
                    onChange={(e) => setBulkRate(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button
                  onClick={handleBulkUpdate}
                  disabled={saving || !bulkRate}
                >
                  {saving ? 'Updating...' : 'Apply to All'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category list */}
          <div className="space-y-2">
            {categories.map((cat) => {
              const mkupPct = ((cat.avgMarkup - 1) * 100).toFixed(1)
              return (
                <div key={cat.category} className="border border-[var(--color-border)] bg-white">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--color-text-primary)] truncate">{cat.category}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{cat.count} services</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`inline-flex px-2 py-0.5 text-xs ${parseFloat(mkupPct) >= 25 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        Avg: +{mkupPct}%
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setBulkCategory(cat.category); setActiveTab('pricing'); setSearchQuery(cat.category) }}
                      >
                        View Services
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={baseThClass}>Service</th>
                    <th className={`${baseThClass} text-right`}>Qty</th>
                    <th className={`${baseThClass} text-right`}>Charge</th>
                    <th className={`${baseThClass} text-right`}>Profit</th>
                    <th className={`${baseThClass} text-center`}>Status</th>
                    <th className={`${baseThClass} text-right`}>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[var(--color-bg)] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm text-[var(--color-text-primary)] truncate max-w-[250px]">{order.service_name}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-[var(--color-text-secondary)]">{order.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-[var(--color-text-primary)]">₦{order.charge.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-medium ${order.profit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          ₦{order.profit.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 text-xs ${
                          order.status === 'completed' ? 'bg-green-50 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-[var(--color-text-secondary)]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
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
