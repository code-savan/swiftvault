'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Sidebar } from '@/app/components/Sidebar'
import { logout } from '@/app/actions/auth'
import { formatCurrency } from '@/app/lib/utils'
import {
  Search, Bell, Menu, History, Filter, Download,
  ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react'

export default function TransactionsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const transactions = [
    { id: 'TXN001', type: 'OTP Purchase', service: 'WhatsApp - USA', amount: -2500, date: 'Dec 30, 2024 2:30 PM', status: 'completed' },
    { id: 'TXN002', type: 'Wallet Top-up', service: 'Paystack', amount: 10000, date: 'Dec 30, 2024 11:00 AM', status: 'completed' },
    { id: 'TXN003', type: 'eSIM Purchase', service: 'USA 5GB Plan', amount: -8500, date: 'Dec 29, 2024 4:15 PM', status: 'completed' },
    { id: 'TXN004', type: 'OTP Refund', service: 'Amazon - UK', amount: 5000, date: 'Dec 29, 2024 1:20 PM', status: 'refunded' },
    { id: 'TXN005', type: 'Account Boost', service: 'Instagram Followers', amount: -5000, date: 'Dec 28, 2024 9:00 AM', status: 'pending' },
    { id: 'TXN006', type: 'Social Log', service: 'Twitter Verified', amount: -25000, date: 'Dec 27, 2024 6:45 PM', status: 'completed' },
    { id: 'TXN007', type: 'Wallet Top-up', service: 'Bank Transfer', amount: 50000, date: 'Dec 27, 2024 10:30 AM', status: 'completed' },
    { id: 'TXN008', type: 'OTP Purchase', service: 'Telegram - Russia', amount: -1200, date: 'Dec 26, 2024 3:00 PM', status: 'completed' },
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
                  <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
                  <p className="text-xs text-gray-500">View your transaction history</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <button className="relative p-2.5 hover:bg-gray-100 rounded-xl">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-11 pr-4 py-2.5 bg-white border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">All</Button>
              <Button variant="ghost" size="sm" className="text-xs">Completed</Button>
              <Button variant="ghost" size="sm" className="text-xs">Pending</Button>
              <Button variant="ghost" size="sm" className="text-xs">Refunded</Button>
            </div>
          </div>

          {/* Transactions Table */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Transaction</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">ID</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">Amount</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 font-mono">{tx.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{tx.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
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
    </div>
  )
}
