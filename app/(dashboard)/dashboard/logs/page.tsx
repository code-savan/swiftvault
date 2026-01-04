'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Sidebar } from '@/app/components/Sidebar'
import { logout } from '@/app/actions/auth'
import {
  Search, Bell, Menu, Users, Instagram, Facebook, Twitter,
  CheckCircle, AlertCircle, ShoppingCart
} from 'lucide-react'

export default function LogsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const accounts = [
    { platform: 'Instagram', type: 'Aged Account', age: '2+ years', followers: '500+', price: 15000, stock: 23, icon: Instagram },
    { platform: 'Facebook', type: 'Verified Account', age: '1+ years', followers: '1K+', price: 12000, stock: 45, icon: Facebook },
    { platform: 'Twitter', type: 'Blue Verified', age: '3+ years', followers: '2K+', price: 25000, stock: 12, icon: Twitter },
    { platform: 'Instagram', type: 'Fresh Account', age: '6 months', followers: '100+', price: 5000, stock: 89, icon: Instagram },
    { platform: 'TikTok', type: 'Creator Account', age: '1+ years', followers: '10K+', price: 35000, stock: 8, icon: Users },
    { platform: 'LinkedIn', type: 'Premium', age: '2+ years', followers: '500+', price: 18000, stock: 15, icon: Users },
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
                  <h1 className="text-xl font-bold text-gray-900">Social Media Logs</h1>
                  <p className="text-xs text-gray-500">Premium verified social media accounts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:block relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search accounts..."
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
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">200+</p>
                  <p className="text-xs text-gray-500">Accounts Available</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-xs text-gray-500">Verified Accounts</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">24hr</p>
                  <p className="text-xs text-gray-500">Replacement Warranty</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accounts Grid */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Available Accounts</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">All</Button>
                <Button variant="ghost" size="sm" className="text-xs">Instagram</Button>
                <Button variant="ghost" size="sm" className="text-xs">Facebook</Button>
                <Button variant="ghost" size="sm" className="text-xs">Twitter</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account, idx) => {
                const Icon = account.icon
                return (
                  <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{account.platform}</p>
                          <p className="text-xs text-gray-500">{account.type}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Account Age</span>
                          <span className="font-medium text-gray-900">{account.age}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Followers</span>
                          <span className="font-medium text-gray-900">{account.followers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">In Stock</span>
                          <span className="font-medium text-green-600">{account.stock} available</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <p className="text-xl font-bold text-gray-900">₦{account.price.toLocaleString()}</p>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Coming Soon Banner */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-600 to-pink-600">
            <CardContent className="p-8 text-center text-white">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Social Logs Coming Soon</h3>
              <p className="text-purple-100 text-sm max-w-md mx-auto">
                Premium social media accounts with full access. Coming soon!
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
