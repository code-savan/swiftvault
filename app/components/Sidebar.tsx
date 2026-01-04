'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Phone, Signal, Users, Rocket, Wallet, History,
  Settings, HelpCircle, LogOut, Zap, ChevronRight, X
} from 'lucide-react'

interface SidebarProps {
  user: {
    email: string
  }
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

const mainNavItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'OTP Numbers', href: '/dashboard/otp', icon: Phone },
  { name: 'eSIM Plans', href: '/dashboard/esim', icon: Signal },
  { name: 'Social Logs', href: '/dashboard/logs', icon: Users },
  { name: 'Boosting', href: '/dashboard/boosting', icon: Rocket },
]

const secondaryNavItems = [
  { name: 'Transactions', href: '/dashboard/transactions', icon: History },
  { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
]

const bottomNavItems = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
]

export function Sidebar({ user, onLogout, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-gray-900 text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{item.name}</span>
        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">SwiftVault</span>
              </div>
              <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.email.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Services
            </p>
            {mainNavItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}

            <div className="pt-6">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Account
              </p>
              {secondaryNavItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </nav>

          {/* Storage Indicator */}
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="p-4 bg-gray-900 rounded-2xl text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Wallet Balance</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-400">₦12,500 available</p>
              <Link href="/dashboard/wallet">
                <button className="w-full mt-3 py-2.5 bg-white text-gray-900 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors">
                  Fund Wallet
                </button>
              </Link>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="px-4 py-4 border-t border-gray-100 space-y-1">
            {bottomNavItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
