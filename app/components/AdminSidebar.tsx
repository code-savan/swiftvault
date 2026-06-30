'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Wallet, TrendingUp, Smartphone,
  Globe, UserPlus, Tag, LogOut, Zap, Package, X,
} from 'lucide-react'

interface AdminSidebarProps {
  userEmail: string
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainLinks: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Transactions', href: '/admin/transactions', icon: Wallet },
]

const serviceLinks: NavItem[] = [
  { label: 'Boosting', href: '/admin/boosting', icon: TrendingUp },
  { label: 'OTP', href: '/admin/otp', icon: Smartphone },
  { label: 'Social Logs', href: '/admin/logs', icon: Package },
  { label: 'Echo Numbers', href: '/admin/echo', icon: Globe },
]

const marketingLinks: NavItem[] = [
  { label: 'Influencers', href: '/admin/influencers', icon: UserPlus },
  { label: 'Referral Codes', href: '/admin/referrals', icon: Tag },
]

function NavGroup({ label, items, pathname, onClose }: {
  label: string
  items: NavItem[]
  pathname: string
  onClose: () => void
}) {
  return (
    <div className="mb-6">
      <p className="px-3 mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)] border-l-[3px] border-[var(--color-accent)] pl-[calc(0.75rem-3px)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] border-l-[3px] border-transparent'
              }`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function AdminSidebar({ userEmail, onLogout, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-[240px] bg-white border-r border-[var(--color-border)] z-50
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="w-8 h-8 bg-[var(--color-accent)] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">SwiftVault</span>
              <span className="text-[10px] font-bold text-[var(--color-accent)] bg-[var(--color-accent-light)] px-1.5 py-0.5 uppercase tracking-wider">Admin</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-[var(--color-surface-hover)]">
              <X className="w-4 h-4 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <NavGroup label="Main" items={mainLinks} pathname={pathname} onClose={onClose} />
          <NavGroup label="Services" items={serviceLinks} pathname={pathname} onClose={onClose} />
          <NavGroup label="Marketing" items={marketingLinks} pathname={pathname} onClose={onClose} />
        </nav>

        {/* User & Logout */}
        <div className="flex-shrink-0 border-t border-[var(--color-border)] px-4 pt-3 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[var(--color-accent-light)] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[var(--color-accent)]">
                {userEmail.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {userEmail}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">Administrator</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-danger)] hover:text-white transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
