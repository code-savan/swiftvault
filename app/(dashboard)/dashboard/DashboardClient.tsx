'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { FundWalletModal } from '@/app/components/FundWalletModal'
import { Sidebar } from '@/app/components/Sidebar'
import { formatCurrency } from '@/app/lib/utils'
import { logout } from '@/app/actions/auth'
import { toast } from 'sonner'
import {
  Wallet, TrendingUp, TrendingDown, Search, Bell, Menu,
  Phone, Signal, Users, Rocket, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, ChevronRight, CreditCard, Plus
} from 'lucide-react'

interface DashboardClientProps {
  user: {
    id: string
    email: string
    wallet_balance: number
  }
  initialEchoNumbers: any[]
}

export default function DashboardClient({ user, initialEchoNumbers }: DashboardClientProps) {
  const router = useRouter()
  const [fundWalletOpen, setFundWalletOpen] = useState(false)
  const [walletBalance] = useState(user.wallet_balance)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  // Mock data for dashboard stats
  const stats = {
    totalBalance: walletBalance,
    totalSpent: 45000,
    activeServices: 12,
  }

  const recentTransactions = [
    { id: 1, type: 'OTP Purchase', service: 'WhatsApp', amount: -2500, date: 'Today, 2:30 PM', status: 'completed' },
    { id: 2, type: 'Wallet Top-up', service: 'Paystack', amount: 10000, date: 'Today, 11:00 AM', status: 'completed' },
    { id: 3, type: 'eSIM Purchase', service: 'USA Plan', amount: -5000, date: 'Yesterday', status: 'completed' },
    { id: 4, type: 'Account Boost', service: 'Instagram', amount: -3500, date: 'Dec 28, 2024', status: 'pending' },
  ]

  const quickServices = [
    { name: 'OTP Numbers', icon: Phone, color: 'from-green-500 to-green-600', href: '/dashboard/otp' },
    { name: 'eSIM Plans', icon: Signal, color: 'from-blue-500 to-blue-600', href: '/dashboard/esim' },
    { name: 'Social Logs', icon: Users, color: 'from-purple-500 to-purple-600', href: '/dashboard/logs' },
    { name: 'Boosting', icon: Rocket, color: 'from-orange-500 to-orange-600', href: '/dashboard/boosting' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        user={{ email: user.email }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div className="relative hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search services, transactions..."
                    className="pl-11 pr-4 py-2.5 w-80 bg-gray-50 border-gray-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Welcome back</p>
                    <p className="text-sm font-semibold text-gray-900">{user.email.split('@')[0]}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 font-roboto mb-1">
            Welcome back, {user.email.split('@')[0]}!
          </h1>
            <p className="text-sm text-gray-500">Glad to have you back. Let&apos;s get started.</p>
        </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
            {/* Total Balance */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Total Balance</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats.totalBalance)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-green-600 text-xs font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15.24%
                  </span>
                  <span className="text-xs text-gray-400">From previous month</span>
                </div>
              </CardContent>
            </Card>

            {/* Total Spent */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Total Spent</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(stats.totalSpent)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-green-600 text-xs font-medium">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +4.25%
                  </span>
                  <span className="text-xs text-gray-400">From previous month</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Services */}
            <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Active Services</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.activeServices}
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-red-600 text-xs font-medium">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -2
                  </span>
                  <span className="text-xs text-gray-400">Expired this week</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Wallet */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Services */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Quick Services</h2>
                <Link href="/dashboard/otp" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickServices.map((service) => {
                  const Icon = service.icon
                  return (
                    <Link key={service.name} href={service.href}>
                      <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <CardContent className="p-5 text-center">
                          <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">{service.name}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Wallet Card */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Wallet</h2>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-green-600 to-green-700 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">NGN</span>
                  </div>
                  <p className="text-sm text-green-100 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold mb-6">{formatCurrency(walletBalance)}</p>
              <Button
                onClick={() => setFundWalletOpen(true)}
                    className="w-full bg-white text-green-600 hover:bg-gray-100 font-medium"
              >
                    <Plus className="w-4 h-4 mr-2" />
                Fund Wallet
              </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Transactions */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:underline">
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Transaction</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Date</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Status</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                              {tx.amount > 0 ? (
                                <ArrowDownRight className="w-5 h-5 text-green-600" />
                              ) : (
                                <ArrowUpRight className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{tx.type}</p>
                              <p className="text-xs text-gray-500">{tx.service}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-sm text-gray-600">{tx.date}</p>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <p className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
        </div>

      <FundWalletModal
        open={fundWalletOpen}
        onOpenChange={setFundWalletOpen}
        userEmail={user.email}
      />
    </div>
  )
}
