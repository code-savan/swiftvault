'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { NotificationsSheet } from './NotificationsSheet'
import { useAuth } from '@clerk/nextjs'
import { I18nProvider, useI18n } from '@/app/contexts/I18nContext'
import { getAvatarUrl } from '@/app/lib/avatar'
import { Menu, Bell, Search, Command, X } from 'lucide-react'

interface DashboardShellProps {
  user: {
    id: string
    email: string
    wallet_balance: number
    full_name: string | null
    phone_number: string | null
    username: string | null
    avatar_url: string | null
  }
  children: React.ReactNode
}

const pageTitleMap: Record<string, string[]> = {
  '/dashboard': ['dashboard.title', 'dashboard.description'],
  '/dashboard/otp': ['otp.title', 'otp.description'],
  '/dashboard/esim': ['esim.title', 'esim.description'],
  '/dashboard/logs': ['logs.title', 'logs.description'],
  '/dashboard/boosting': ['boosting.title', 'boosting.description'],
  '/dashboard/referral': ['referral.title', 'referral.description'],
  '/dashboard/transactions': ['transactions.title', 'transactions.description'],
  '/dashboard/wallet': ['wallet.title', 'wallet.description'],
  '/dashboard/settings': ['settings.title', 'settings.description'],
  '/dashboard/support': ['support.title', 'support.description'],
}

function getPageTitle(pathname: string, t: (key: string) => string): string {
  const exact = pageTitleMap[pathname]
  if (exact) return t(exact[0])
  for (const [prefix, keys] of Object.entries(pageTitleMap)) {
    if (pathname.startsWith(prefix + '/')) return t(keys[0])
  }
  return ''
}

function getPageDescription(pathname: string, t: (key: string) => string): string {
  const exact = pageTitleMap[pathname]
  if (exact) return t(exact[1])
  for (const [prefix, keys] of Object.entries(pageTitleMap)) {
    if (pathname.startsWith(prefix + '/')) return t(keys[1])
  }
  return ''
}

const searchPlaceholders = [
  'Search services...',
  'Find transactions...',
  'Browse OTP numbers...',
  'Look up logs...',
  'Search boosting packages...',
  'Explore eSIM plans...',
]

export function DashboardShell({ user, children }: DashboardShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  useEffect(() => {
    if (pathname.startsWith('/admin')) return
    const isIncomplete = !user.full_name || !user.username
    const isOnboarding = pathname === '/onboarding'
    if (isIncomplete && !isOnboarding) router.replace('/onboarding')
    if (!isIncomplete && isOnboarding) router.replace('/dashboard')
  }, [user, pathname, router])

  if (pathname.startsWith('/admin')) return <>{children}</>

  return (
    <I18nProvider>
      <ShellInner
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        handleLogout={handleLogout}
      >
        {children}
      </ShellInner>
    </I18nProvider>
  )
}

function ShellInner({
  user, sidebarOpen, setSidebarOpen, notifOpen, setNotifOpen, handleLogout, children,
}: {
  user: DashboardShellProps['user']
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  notifOpen: boolean
  setNotifOpen: (v: boolean) => void
  handleLogout: () => void
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useI18n()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  const pageTitle = getPageTitle(pathname, t)
  const pageDesc = getPageDescription(pathname, t)
  const displayName = user.full_name || user.username || user.email.split('@')[0]
  const avatarSrc = getAvatarUrl(user.email, user.avatar_url)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % searchPlaceholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim()) return
    const q = searchValue.trim().toLowerCase()
    const routes: [string, string[]][] = [
      ['/dashboard/otp', ['otp', 'number', 'sms', 'verification']],
      ['/dashboard/transactions', ['transaction', 'payment', 'deposit', 'spent']],
      ['/dashboard/logs', ['log', 'social', 'account']],
      ['/dashboard/boosting', ['boost', 'smm', 'followers', 'instagram', 'likes']],
      ['/dashboard/esim', ['esim', 'data', 'roaming']],
      ['/dashboard/referral', ['referral', 'refer', 'commission']],
      ['/dashboard/wallet', ['wallet', 'balance', 'fund']],
      ['/dashboard/settings', ['setting', 'profile', 'password']],
      ['/dashboard/support', ['support', 'help', 'faq']],
    ]
    for (const [route, keywords] of routes) {
      if (keywords.some(k => q.includes(k))) {
        router.push(route)
        return
      }
    }
    router.push('/dashboard/transactions')
  }, [searchValue])

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 lg:ml-[240px] flex flex-col">
        <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--color-surface-hover)]"
              >
                <Menu className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-[var(--color-text-primary)] truncate">
                  {pageTitle}
                </h1>
                {pageDesc && (
                  <p className="text-xs text-[var(--color-text-muted)] truncate hidden sm:block">
                    {pageDesc}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={searchPlaceholders[placeholderIdx]}
                  className="w-full h-9 pl-10 pr-10 rounded-lg bg-gray-50 border-0 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                />
                {searchValue ? (
                  <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200"
                  >
                    <X className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  </button>
                ) : (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                    <kbd className="hidden lg:inline-flex items-center justify-center w-5 h-5 rounded bg-white border border-[var(--color-border)] text-[10px] font-medium">
                      <Command className="w-3 h-3" />
                    </kbd>
                    <kbd className="hidden lg:inline-flex items-center justify-center w-5 h-5 rounded bg-white border border-[var(--color-border)] text-[10px] font-medium">
                      K
                    </kbd>
                  </div>
                )}
              </div>
            </form>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-[18px] h-[18px] text-[var(--color-text-secondary)]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-danger)] ring-2 ring-white" />
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-[var(--color-border)]">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium text-[var(--color-text-secondary)]">{displayName}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Member</p>
                </div>
                <img
                  src={avatarSrc}
                  alt=""
                  className="w-9 h-9 rounded-full bg-gray-100 flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>

      <NotificationsSheet open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  )
}

// Re-export for use in fund wallet
export { searchPlaceholders }
