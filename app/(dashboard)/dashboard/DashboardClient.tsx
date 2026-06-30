'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/app/contexts/I18nContext'
import { FundWalletModal } from '@/app/components/FundWalletModal'
import { formatCurrency } from '@/app/lib/utils'
import {
  Phone, Signal, Users, Rocket, Wallet,
  ArrowUpRight, ArrowDownRight, TrendingUp, Plus, ChevronRight, Copy, Zap,
} from 'lucide-react'

interface DashboardClientProps {
  user: {
    id: string
    email: string
    wallet_balance: number
    totalSpent: number
    activeServices: number
    avatar_url: string | null
  }
  transactions: {
    id: string
    service: string
    amount: number
    status: string
    date: string
  }[]
}

const statusStyles: Record<string, string> = {
  completed: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
  pending: 'bg-amber-50 text-amber-600',
  cancelled: 'bg-red-50 text-red-600',
  refunded: 'bg-gray-100 text-gray-600',
}

const quickServices = [
  { name: 'OTP Numbers', icon: Phone, href: '/dashboard/otp', color: 'from-emerald-500 to-emerald-600', count: '150+ Countries' },
  { name: 'eSIM Plans', icon: Signal, href: '/dashboard/esim', color: 'from-blue-500 to-blue-600', count: 'Global Coverage' },
  { name: 'Social Logs', icon: Users, href: '/dashboard/logs', color: 'from-violet-500 to-violet-600', count: 'Verified Accounts' },
  { name: 'Boosting', icon: Rocket, href: '/dashboard/boosting', color: 'from-amber-500 to-amber-600', count: 'SMM Services' },
]

export default function DashboardClient({ user, transactions }: DashboardClientProps) {
  const [fundWalletOpen, setFundWalletOpen] = useState(false)
  const { t } = useI18n()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Wallet Balance</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[var(--color-accent)]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{formatCurrency(user.wallet_balance)}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3 h-3 text-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-text-muted)]">Available balance</span>
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Total Spent</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{formatCurrency(user.totalSpent)}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-xs text-[var(--color-text-muted)]">Lifetime spend</span>
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Active Services</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{user.activeServices}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-xs text-[var(--color-text-muted)]">Currently active</span>
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Quick Top-up</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Plus className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <button
            onClick={() => setFundWalletOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            Fund Wallet
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-xs text-[var(--color-text-muted)]">Instant deposit</span>
          </div>
        </div>
      </div>

      {/* Main section: Services + Virtual Card */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Services grid — takes 3/5 */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Quick Services</h2>
            <Link href="/dashboard/otp" className="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {quickServices.map((service) => {
              const Icon = service.icon
              return (
                <Link key={service.name} href={service.href}>
                  <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-200 group cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-[var(--color-text-primary)] text-sm">{service.name}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{service.count}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                      Get started <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Wallet — takes 2/5 */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Wallet</h2>
          </div>

          {/* Wallet card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-6">
              <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-white/5" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 bg-white/5" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 font-medium tracking-wide">WALLET BALANCE</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(user.wallet_balance)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 p-3">
                  <p className="text-[10px] text-white/60">Total Deposits</p>
                  <p className="text-sm font-bold text-white">{formatCurrency(user.wallet_balance)}</p>
                </div>
                <div className="bg-white/10 p-3">
                  <p className="text-[10px] text-white/60">Total Spent</p>
                  <p className="text-sm font-bold text-white">{formatCurrency(user.totalSpent)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[var(--color-border)] p-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setFundWalletOpen(true)}
                  className="flex-1 py-2.5 bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-hover)] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Funds
                </button>
                <Link
                  href="/dashboard/transactions"
                  className="flex-1 py-2.5 border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent Activity</h2>
          <Link href="/dashboard/transactions" className="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] flex items-center gap-1 transition-colors">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-xl">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">No activity yet</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Your transactions will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {transactions.map((tx) => {
                const isCredit = tx.amount > 0
                return (
                  <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isCredit ? 'bg-[var(--color-accent-light)]' : 'bg-red-50'
                    }`}>
                      {isCredit
                        ? <ArrowDownRight className={`w-4 h-4 text-[var(--color-accent)]`} />
                        : <ArrowUpRight className="w-4 h-4 text-red-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{tx.service}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-semibold ${isCredit ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
                        {isCredit ? '+' : ''}{formatCurrency(tx.amount)}
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        statusStyles[tx.status] || 'bg-gray-100 text-gray-600'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <FundWalletModal
        open={fundWalletOpen}
        onOpenChange={setFundWalletOpen}
        userEmail={user.email}
        balance={user.wallet_balance}
      />
    </div>
  )
}
