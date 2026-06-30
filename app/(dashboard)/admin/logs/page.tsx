'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import {
  getAdminAccounts, addAccount, bulkAddAccounts, updateAccount, deleteAccount, getAdminAccountStats,
  type AdminSocialAccount,
} from '@/app/actions/admin-social-accounts'
import { formatCurrency } from '@/app/lib/utils'
import { toast } from 'sonner'
import {
  Search, Plus, Upload, Trash2, Save, X, Edit3,
  Package, Users, AlertTriangle, CheckCircle, Globe,
} from 'lucide-react'

type Tab = 'accounts' | 'add' | 'bulk'

export default function AdminLogsPage() {
  const [accounts, setAccounts] = useState<AdminSocialAccount[]>([])
  const [stats, setStats] = useState<{ totalAvailable: number; totalSold: number; totalSuspended: number; totalAccounts: number; byPlatform: { platform: string; count: number; available: number; sold: number }[] }>({
    totalAvailable: 0, totalSold: 0, totalSuspended: 0, totalAccounts: 0, byPlatform: [],
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('accounts')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [platformFilter, setPlatformFilter] = useState<string>('')

  const [addPlatform, setAddPlatform] = useState('')
  const [addType, setAddType] = useState('standard')
  const [addEmail, setAddEmail] = useState('')
  const [addPassword, setAddPassword] = useState('')
  const [addPrice, setAddPrice] = useState('')
  const [addFollowers, setAddFollowers] = useState('')
  const [addAccountAge, setAddAccountAge] = useState('')
  const [saving, setSaving] = useState(false)

  const [bulkText, setBulkText] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, any>>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [accts, statsData] = await Promise.all([
      getAdminAccounts(statusFilter || undefined, platformFilter || undefined),
      getAdminAccountStats(),
    ])
    setAccounts(accts)
    setStats(statsData)
    setLoading(false)
  }

  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return accounts
    const q = searchQuery.toLowerCase()
    return accounts.filter(
      (a) =>
        a.platform.toLowerCase().includes(q) ||
        a.account_type.toLowerCase().includes(q) ||
        (a.email && a.email.toLowerCase().includes(q)) ||
        a.id.includes(q)
    )
  }, [accounts, searchQuery])

  async function handleAddSingle() {
    if (!addPlatform || !addEmail || !addPassword || !addPrice) {
      toast.error('Platform, email, password, and price are required')
      return
    }
    const price = parseFloat(addPrice)
    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a positive number')
      return
    }
    setSaving(true)
    const details: Record<string, any> = {}
    if (addFollowers) details.followers = parseInt(addFollowers) || addFollowers
    if (addAccountAge) details.account_age = addAccountAge

    const result = await addAccount(addPlatform, addType, addEmail, addPassword, price, details)
    if (result.success) {
      toast.success('Account added')
      setAddPlatform('')
      setAddType('standard')
      setAddEmail('')
      setAddPassword('')
      setAddPrice('')
      setAddFollowers('')
      setAddAccountAge('')
      loadData()
    } else {
      toast.error(result.error || 'Failed to add')
    }
    setSaving(false)
  }

  async function handleBulkAdd() {
    const lines = bulkText.trim().split('\n').filter(Boolean)
    if (lines.length === 0) {
      toast.error('No data to import')
      return
    }

    const accounts: { platform: string; account_type: string; email: string; password: string; price: number; details?: Record<string, any> }[] = []
    const errors: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split('|').map((s) => s.trim())
      if (parts.length < 4) {
        errors.push(`Line ${i + 1}: Need at least platform|email|password|price`)
        continue
      }
      const price = parseFloat(parts[3])
      if (isNaN(price) || price <= 0) {
        errors.push(`Line ${i + 1}: Invalid price "${parts[3]}"`)
        continue
      }
      const details: Record<string, any> = {}
      if (parts[4]) details.followers = parts[4]
      if (parts[5]) details.account_age = parts[5]
      accounts.push({
        platform: parts[0],
        account_type: parts.length > 5 ? parts[5] : 'standard',
        email: parts[1],
        password: parts[2],
        price,
        details,
      })
    }

    if (accounts.length === 0) {
      toast.error('No valid entries to import')
      return
    }

    setSaving(true)
    const result = await bulkAddAccounts(accounts)
    if (result.success) {
      toast.success(`Added ${result.count} accounts${errors.length ? ` (${errors.length} skipped)` : ''}`)
      setBulkText('')
      loadData()
    } else {
      toast.error(result.error || 'Bulk add failed')
    }
    setSaving(false)

    if (errors.length > 0) {
      toast.error(errors.slice(0, 3).join('\n'))
    }
  }

  async function handleUpdate(id: string) {
    setSaving(true)
    const result = await updateAccount(id, editData)
    if (result.success) {
      toast.success('Account updated')
      setEditingId(null)
      setEditData({})
      loadData()
    } else {
      toast.error(result.error || 'Update failed')
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this account permanently?')) return
    const result = await deleteAccount(id)
    if (result.success) {
      toast.success('Account deleted')
      loadData()
    } else {
      toast.error(result.error || 'Delete failed')
    }
  }

  function startEdit(account: AdminSocialAccount) {
    setEditingId(account.id)
    setEditData({
      platform: account.platform,
      account_type: account.account_type,
      email: account.email,
      password: account.password,
      price: account.price,
      status: account.status,
    })
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-border)] border-t-[var(--color-accent)] mx-auto mb-4" />
        <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
      </div>
    )
  }

  const baseThClass = "text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider px-4 py-3 bg-[var(--color-bg)]"

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Social Logs — Account Inventory</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Manage social media accounts for sale</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Total</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)]">{stats.totalAccounts.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Available</p>
              <p className="text-xl font-bold text-green-600">{stats.totalAvailable.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Sold</p>
              <p className="text-xl font-bold text-orange-600">{stats.totalSold.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Suspended</p>
              <p className="text-xl font-bold text-red-600">{stats.totalSuspended.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'accounts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('accounts')}
        >
          <Package className="w-4 h-4 mr-2" />
          All Accounts ({filteredAccounts.length})
        </Button>
        <Button
          variant={activeTab === 'add' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Single
        </Button>
        <Button
          variant={activeTab === 'bulk' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('bulk')}
        >
          <Upload className="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
      </div>

      {activeTab === 'accounts' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <Input
                placeholder="Search by platform, email, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); loadData() }}
              className="px-3 py-2.5 bg-white border border-[var(--color-border)] text-sm text-[var(--color-text-primary)]"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={platformFilter}
              onChange={(e) => { setPlatformFilter(e.target.value); loadData() }}
              className="px-3 py-2.5 bg-white border border-[var(--color-border)] text-sm text-[var(--color-text-primary)]"
            >
              <option value="">All Platforms</option>
              {stats.byPlatform.map((p) => (
                <option key={p.platform} value={p.platform}>{p.platform}</option>
              ))}
            </select>
          </div>

          {/* Accounts table */}
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className={baseThClass}>Platform</th>
                      <th className={baseThClass}>Type</th>
                      <th className={baseThClass}>Email</th>
                      <th className={`${baseThClass} text-right`}>Price</th>
                      <th className={`${baseThClass} text-center`}>Status</th>
                      <th className={`${baseThClass} text-right`}>Date</th>
                      <th className={`${baseThClass} text-center`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {filteredAccounts.map((acct) => (
                      <tr key={acct.id} className="hover:bg-[var(--color-bg)] transition-colors">
                        {editingId === acct.id ? (
                          <>
                            <td className="px-4 py-2">
                              <Input
                                value={editData.platform || ''}
                                onChange={(e) => setEditData({ ...editData, platform: e.target.value })}
                                className="w-24 h-8 text-xs"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                value={editData.account_type || ''}
                                onChange={(e) => setEditData({ ...editData, account_type: e.target.value })}
                                className="w-24 h-8 text-xs"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <Input
                                value={editData.email || ''}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className="w-36 h-8 text-xs"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <Input
                                type="number"
                                value={editData.price || ''}
                                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
                                className="w-20 h-8 text-xs text-right"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <select
                                value={editData.status || ''}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                className="px-2 py-1 border border-[var(--color-border)] text-xs"
                              >
                                <option value="available">available</option>
                                <option value="sold">sold</option>
                                <option value="suspended">suspended</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 text-right text-xs text-[var(--color-text-secondary)]">
                              {new Date(acct.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleUpdate(acct.id)}
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
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-[var(--color-text-muted)]" />
                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{acct.platform}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-xs text-[var(--color-text-secondary)]">{acct.account_type}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-[var(--color-text-secondary)] font-mono text-xs truncate max-w-[160px] inline-block">
                                {acct.email}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-semibold text-[var(--color-text-primary)]">{formatCurrency(acct.price)}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex px-2 py-0.5 text-xs ${
                                acct.status === 'available' ? 'bg-green-50 text-green-700' :
                                acct.status === 'sold' ? 'bg-orange-50 text-orange-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                {acct.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-[var(--color-text-secondary)]">
                              {new Date(acct.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => startEdit(acct)}
                                  className="p-1.5 hover:bg-gray-50 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(acct.id)}
                                  className="p-1.5 hover:bg-red-50 text-[var(--color-text-muted)] hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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
        </>
      )}

      {activeTab === 'add' && (
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Add Single Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Platform *</label>
                <Input
                  placeholder="e.g. INSTAGRAM, FACEBOOK, TIKTOK"
                  value={addPlatform}
                  onChange={(e) => setAddPlatform(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Account Type</label>
                <Input
                  placeholder="e.g. PVA, Aged, Verified"
                  value={addType}
                  onChange={(e) => setAddType(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Email / Username *</label>
                <Input
                  placeholder="account email or username"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Password *</label>
                <Input
                  placeholder="account password"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Price (₦) *</label>
                <Input
                  type="number"
                  placeholder="e.g. 1500"
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Followers (optional)</label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={addFollowers}
                  onChange={(e) => setAddFollowers(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">Account Age (optional)</label>
                <Input
                  placeholder="e.g. 2 years"
                  value={addAccountAge}
                  onChange={(e) => setAddAccountAge(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
            <Button
              onClick={handleAddSingle}
              disabled={saving}
              className="mt-4"
            >
              {saving ? 'Adding...' : 'Add Account'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'bulk' && (
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Bulk Import Accounts</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Paste one account per line. Format: <code className="text-xs bg-[var(--color-bg)] border border-[var(--color-border)] px-1.5 py-0.5">PLATFORM | email | password | price | followers (opt) | account_age (opt)</code>
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Example: <code className="text-xs bg-[var(--color-bg)] border border-[var(--color-border)] px-1.5 py-0.5">INSTAGRAM | user@example.com | pass123 | 2000 | 5000 | 1 year</code>
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="INSTAGRAM | user@example.com | pass123 | 2000 | 5000 | 1 year&#10;FACEBOOK | fbuser@example.com | fbpass456 | 1500 | 3000 | 6 months"
              className="w-full h-48 px-4 py-3 border border-[var(--color-border)] text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] bg-white"
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-[var(--color-text-muted)]">
                {bulkText.trim() ? `${bulkText.trim().split('\n').filter(Boolean).length} accounts detected` : ''}
              </p>
              <Button
                onClick={handleBulkAdd}
                disabled={saving || !bulkText.trim()}
              >
                {saving ? 'Importing...' : `Import ${bulkText.trim() ? bulkText.trim().split('\n').filter(Boolean).length : 0} Accounts`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
