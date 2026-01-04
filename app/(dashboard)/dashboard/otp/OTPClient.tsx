'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Sidebar } from '@/app/components/Sidebar'
import { BuyOTPSection } from '@/app/components/BuyOTPSection'
import { formatCurrency } from '@/app/lib/utils'
import { logout } from '@/app/actions/auth'
import {
  Search, Bell, Menu, Phone, ChevronRight, Globe, Clock, Shield
} from 'lucide-react'

interface OTPClientProps {
  user: {
    id: string
    email: string
    wallet_balance: number
  }
}

export default function OTPClient({ user }: OTPClientProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [referralDiscount] = useState(0)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const handlePurchaseSuccess = () => {
    router.refresh()
  }

  const popularServices = [
    { name: 'WhatsApp', country: 'USA', price: 2500, available: 150 },
    { name: 'Amazon', country: 'UK', price: 5000, available: 89 },
    { name: 'Google', country: 'Canada', price: 1500, available: 234 },
    { name: 'Telegram', country: 'Russia', price: 1200, available: 456 },
    { name: 'Instagram', country: 'Germany', price: 2500, available: 123 },
    { name: 'Twitter', country: 'France', price: 3000, available: 67 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={{ email: user.email }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1">
        {/* Header */}
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
                  <h1 className="text-xl font-bold text-gray-900">OTP Numbers</h1>
                  <p className="text-xs text-gray-500">Get virtual numbers for verification</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search services..."
                    className="pl-11 pr-4 py-2.5 w-64 bg-gray-50 border-gray-200 rounded-xl text-sm"
                  />
                </div>
                <button className="relative p-2.5 hover:bg-gray-100 rounded-xl">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">150+</p>
                  <p className="text-xs text-gray-500">Countries Available</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">~30s</p>
                  <p className="text-xs text-gray-500">Average Delivery Time</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-xs text-gray-500">Refund Guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Buy OTP Section */}
            <BuyOTPSection
              walletBalance={user.wallet_balance}
              referralDiscount={referralDiscount}
              onPurchaseSuccess={handlePurchaseSuccess}
            />

            {/* Popular Services */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Popular Services</h2>
                  <button className="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {popularServices.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Globe className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.country} • {service.available} available</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(service.price)}</p>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
