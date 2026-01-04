'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Sidebar } from '@/app/components/Sidebar'
import { logout } from '@/app/actions/auth'
import {
  Search, Bell, Menu, Rocket, TrendingUp, Heart,
  MessageCircle, UserPlus, Eye, Zap
} from 'lucide-react'

export default function BoostingPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const boostingServices = [
    { platform: 'Instagram', service: 'Followers', quantity: '1000', price: 5000, icon: UserPlus, color: 'from-pink-500 to-purple-500' },
    { platform: 'Instagram', service: 'Likes', quantity: '500', price: 2000, icon: Heart, color: 'from-red-500 to-pink-500' },
    { platform: 'Instagram', service: 'Views', quantity: '5000', price: 3000, icon: Eye, color: 'from-blue-500 to-purple-500' },
    { platform: 'TikTok', service: 'Followers', quantity: '1000', price: 4500, icon: UserPlus, color: 'from-gray-800 to-gray-900' },
    { platform: 'TikTok', service: 'Likes', quantity: '1000', price: 2500, icon: Heart, color: 'from-pink-500 to-red-500' },
    { platform: 'Twitter', service: 'Followers', quantity: '500', price: 6000, icon: UserPlus, color: 'from-blue-400 to-blue-500' },
    { platform: 'YouTube', service: 'Subscribers', quantity: '100', price: 8000, icon: UserPlus, color: 'from-red-500 to-red-600' },
    { platform: 'YouTube', service: 'Views', quantity: '1000', price: 3500, icon: Eye, color: 'from-red-600 to-red-700' },
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
                  <h1 className="text-xl font-bold text-gray-900">Account Boosting</h1>
                  <p className="text-xs text-gray-500">Grow your social media presence</p>
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

        <main className="p-4 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Fast</p>
                  <p className="text-xs text-gray-500">Delivery Time</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Real</p>
                  <p className="text-xs text-gray-500">Engagement</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">Instant</p>
                  <p className="text-xs text-gray-500">Start</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Boosting Services</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">All</Button>
                <Button variant="ghost" size="sm" className="text-xs">Instagram</Button>
                <Button variant="ghost" size="sm" className="text-xs">TikTok</Button>
                <Button variant="ghost" size="sm" className="text-xs">YouTube</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {boostingServices.map((service, idx) => {
                const Icon = service.icon
                return (
                  <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{service.platform}</p>
                      <p className="font-semibold text-gray-900 mb-2">{service.service}</p>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{service.quantity}</p>
                      <p className="text-sm text-orange-600 font-semibold mb-4">₦{service.price.toLocaleString()}</p>
                      <Button size="sm" className="w-full bg-gray-900 hover:bg-gray-800">
                        Order Now
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Coming Soon Banner */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-500 to-red-500">
            <CardContent className="p-8 text-center text-white">
              <Rocket className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Boosting Services Coming Soon</h3>
              <p className="text-orange-100 text-sm max-w-md mx-auto">
                Real followers, likes, and engagement for your social accounts. Stay tuned!
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
