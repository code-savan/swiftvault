'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Sidebar } from '@/app/components/Sidebar'
import { logout } from '@/app/actions/auth'
import {
  Bell, Menu, User, Lock, Shield, CreditCard,
  Globe, Moon, ChevronRight
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { name: 'Profile Information', description: 'Update your personal details', icon: User },
        { name: 'Change Password', description: 'Update your security credentials', icon: Lock },
        { name: 'Two-Factor Authentication', description: 'Add extra security to your account', icon: Shield },
      ]
    },
    {
      title: 'Payments',
      items: [
        { name: 'Payment Methods', description: 'Manage your saved cards', icon: CreditCard },
        { name: 'Billing History', description: 'View past invoices', icon: Globe },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { name: 'Notifications', description: 'Configure email and push notifications', icon: Bell },
        { name: 'Appearance', description: 'Light or dark mode', icon: Moon },
        { name: 'Language', description: 'Choose your preferred language', icon: Globe },
      ]
    }
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
                  <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                  <p className="text-xs text-gray-500">Manage your account preferences</p>
                </div>
              </div>
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-4xl">
          {settingsSections.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {section.title}
              </h2>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0 divide-y divide-gray-100">
                  {section.items.map((item, itemIdx) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={itemIdx}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">
              Danger Zone
            </h2>
            <Card className="border-2 border-red-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delete Account</p>
                    <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
