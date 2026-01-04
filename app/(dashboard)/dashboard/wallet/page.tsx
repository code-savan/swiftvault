'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Sidebar } from '@/app/components/Sidebar'
import { FundWalletModal } from '@/app/components/FundWalletModal'
import { logout } from '@/app/actions/auth'
import { formatCurrency } from '@/app/lib/utils'
import {
  Bell, Menu, Wallet, CreditCard, Plus, TrendingUp,
  ArrowUpRight, ArrowDownRight, Send, Download
} from 'lucide-react'

export default function WalletPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fundWalletOpen, setFundWalletOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const walletBalance = 124420.50
  const totalSpent = 45000
  const totalDeposits = 200000

  const recentActivity = [
    { type: 'deposit', amount: 10000, date: 'Today, 11:00 AM' },
    { type: 'spent', amount: 2500, date: 'Today, 2:30 PM' },
    { type: 'spent', amount: 8500, date: 'Yesterday' },
    { type: 'deposit', amount: 50000, date: 'Dec 27, 2024' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={{ email: 'user@example.com' }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1">
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
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Wallet</h1>
                  <p className="text-xs text-gray-500">Manage your funds</p>
                </div>
              </div>
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {/* Balance Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Main Balance Card */}
            <Card className="md:col-span-2 border-0 shadow-sm bg-gradient-to-br from-green-600 to-green-700 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-green-100 text-sm">Available Balance</p>
                      <p className="text-3xl font-bold">{formatCurrency(walletBalance)}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">NGN</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white/10 rounded-xl">
                    <p className="text-green-100 text-xs mb-1">Total Deposits</p>
                    <p className="text-xl font-semibold">{formatCurrency(totalDeposits)}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl">
                    <p className="text-green-100 text-xs mb-1">Total Spent</p>
                    <p className="text-xl font-semibold">{formatCurrency(totalSpent)}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setFundWalletOpen(true)}
                    className="flex-1 bg-white text-green-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                  <Button variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10">
                    <Send className="w-4 h-4 mr-2" />
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setFundWalletOpen(true)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Fund Wallet</p>
                      <p className="text-xs text-gray-500">Add money via Paystack</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Saved Cards</p>
                      <p className="text-xs text-gray-500">Manage payment methods</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Export Statement</p>
                      <p className="text-xs text-gray-500">Download PDF/CSV</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-blue-600 hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        activity.type === 'deposit' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'deposit' ? (
                          <ArrowDownRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type === 'deposit' ? 'Wallet Top-up' : 'Purchase'}
                        </p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold ${
                      activity.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {activity.type === 'deposit' ? '+' : '-'}{formatCurrency(activity.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <FundWalletModal
        open={fundWalletOpen}
        onOpenChange={setFundWalletOpen}
        userEmail="user@example.com"
      />
    </div>
  )
}
