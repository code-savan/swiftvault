'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Sidebar } from '@/app/components/Sidebar'
import { logout } from '@/app/actions/auth'
import {
  Search, Bell, Menu, Signal, Globe, Wifi, Zap, ChevronRight
} from 'lucide-react'

export default function ESIMPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const esimPlans = [
    { region: 'USA', data: '5GB', validity: '30 days', price: 8500, popular: true },
    { region: 'Europe', data: '10GB', validity: '30 days', price: 12000, popular: false },
    { region: 'Asia', data: '3GB', validity: '14 days', price: 5500, popular: false },
    { region: 'Global', data: '1GB', validity: '7 days', price: 3500, popular: false },
    { region: 'UK', data: '5GB', validity: '30 days', price: 9000, popular: false },
    { region: 'Canada', data: '5GB', validity: '30 days', price: 8000, popular: false },
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
                  <h1 className="text-xl font-bold text-gray-900">eSIM Plans</h1>
                  <p className="text-xs text-gray-500">Stay connected globally with instant eSIM</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search destinations..."
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

        <main className="p-4 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100+</p>
                  <p className="text-xs text-gray-500">Destinations</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Instant</p>
                  <p className="text-xs text-gray-500">Activation</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4G/5G</p>
                  <p className="text-xs text-gray-500">High Speed Data</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* eSIM Plans Grid */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {esimPlans.map((plan, idx) => (
                <Card key={idx} className={`border-2 ${plan.popular ? 'border-blue-500' : 'border-transparent'} shadow-sm hover:shadow-md transition-all`}>
                  <CardContent className="p-6">
                    {plan.popular && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Signal className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{plan.region}</p>
                        <p className="text-xs text-gray-500">{plan.validity}</p>
                      </div>
                    </div>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">{plan.data}</p>
                        <p className="text-xs text-gray-500">Data included</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">₦{plan.price.toLocaleString()}</p>
                    </div>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Coming Soon Banner */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-blue-700">
            <CardContent className="p-8 text-center text-white">
              <Signal className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">eSIM Service Coming Soon</h3>
              <p className="text-blue-100 text-sm max-w-md mx-auto">
                We&apos;re working on bringing you the best eSIM experience.
                Stay tuned for instant global connectivity!
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
