'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/app/contexts/I18nContext'
import { getAvatarUrl } from '@/app/lib/avatar'
import {
  LayoutDashboard, Phone, Signal, Users, Rocket, Wallet, History,
  Settings, HelpCircle, LogOut, Zap, X, Gift,
} from 'lucide-react'

interface SidebarProps {
  user: {
    id: string
    email: string
    wallet_balance: number
    full_name: string | null
    phone_number: string | null
    username: string | null
    avatar_url: string | null
  }
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  key: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const mainLinks: NavItem[] = [
  { key: 'nav.overview', href: '/dashboard', icon: LayoutDashboard },
  { key: 'nav.otpNumbers', href: '/dashboard/otp', icon: Phone },
  { key: 'nav.esimPlans', href: '/dashboard/esim', icon: Signal },
  { key: 'nav.socialLogs', href: '/dashboard/logs', icon: Users },
  { key: 'nav.boosting', href: '/dashboard/boosting', icon: Rocket },
  { key: 'nav.referral', href: '/dashboard/referral', icon: Gift },
]

const financialLinks: NavItem[] = [
  { key: 'nav.transactions', href: '/dashboard/transactions', icon: History },
  { key: 'nav.wallet', href: '/dashboard/wallet', icon: Wallet },
]

const otherLinks: NavItem[] = [
  { key: 'nav.settings', href: '/dashboard/settings', icon: Settings },
  { key: 'nav.support', href: '/dashboard/support', icon: HelpCircle },
]

function NavSection({ label, items, pathname, onClose, t }: {
  label: string
  items: NavItem[]
  pathname: string
  onClose: () => void
  t: (key: string) => string
}) {
  return (
    <div className="mb-6">
      <p className="px-3 mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        {label}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)] border-l-[3px] border-[var(--color-accent)] pl-[calc(0.75rem-3px)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] border-l-[3px] border-transparent'
              }`}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{t(item.key)}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function Sidebar({ user, onLogout, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useI18n()

  const displayName = user.full_name || user.username || user.email.split('@')[0]
  const avatarSrc = getAvatarUrl(user.email, user.avatar_url)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen w-[240px] bg-[var(--color-surface)] border-r border-[var(--color-border)] z-50
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo (no border below) */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">SwiftVault</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-[var(--color-surface-hover)] rounded-lg">
              <X className="w-4 h-4 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 pt-5 pb-2">
          <NavSection label="Main" items={mainLinks} pathname={pathname} onClose={onClose} t={t} />
          <NavSection label="Financial" items={financialLinks} pathname={pathname} onClose={onClose} t={t} />
          <NavSection label="More" items={otherLinks} pathname={pathname} onClose={onClose} t={t} />
        </nav>

        {/* User at bottom with clear logout */}
        <div className="flex-shrink-0 border-t border-[var(--color-border)] px-4 pt-3 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={avatarSrc}
              alt=""
              className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                {displayName}
              </p>
              {user.username && (
                <p className="text-xs text-[var(--color-text-muted)] truncate">@{user.username}</p>
              )}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-white bg-[var(--color-danger)] hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>
    </>
  )
}
