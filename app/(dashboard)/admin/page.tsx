import { Card, CardContent } from '@/app/components/ui/card'
import { getAdminStats } from '@/app/actions/admin'
import { formatCurrency } from '@/app/lib/utils'
import {
  LayoutDashboard, Users, TrendingUp, DollarSign, Calendar,
  Smartphone, Package, Tag, UserPlus,
} from 'lucide-react'

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  const quickActions = [
    { href: '/admin/otp', label: 'OTP Services', desc: 'Manage visibility and pricing', icon: Smartphone, gradient: 'from-emerald-500 to-teal-600' },
    { href: '/admin/boosting', label: 'Boosting', desc: 'Set markup rates and manage orders', icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600' },
    { href: '/admin/users', label: 'Users', desc: 'Search and manage accounts', icon: Users, gradient: 'from-violet-500 to-purple-600' },
    { href: '/admin/influencers', label: 'Influencers', desc: 'View referral codes and commissions', icon: UserPlus, gradient: 'from-orange-500 to-red-500' },
    { href: '/admin/referrals', label: 'Referral Codes', desc: 'Generate new influencer codes', icon: Tag, gradient: 'from-pink-500 to-rose-600' },
    { href: '/admin/transactions', label: 'Transactions', desc: 'View all platform transactions', icon: DollarSign, gradient: 'from-cyan-500 to-sky-600' },
    { href: '/admin/logs', label: 'Social Logs', desc: 'Manage account inventory', icon: Package, gradient: 'from-pink-500 to-rose-600' },
  ]

  const statCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, accent: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Users', value: stats.totalUsers, icon: Users, accent: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Sales", value: formatCurrency(stats.todayRevenue), icon: TrendingUp, accent: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'This Week', value: formatCurrency(stats.weekRevenue), icon: Calendar, accent: 'text-violet-600', bg: 'bg-violet-50' },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-500/20">
              <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-emerald-400/80 text-sm font-medium tracking-wide uppercase">Administration</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-[var(--color-text-muted)] text-sm max-w-xl">
            Here&apos;s what&apos;s happening across your platform today.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`${s.bg} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-wide text-[var(--color-text-secondary)] uppercase">{s.label}</span>
                <div className={`p-2 ${s.bg}`}>
                  <Icon className={`w-4 h-4 ${s.accent}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${s.accent}`}>{s.value}</div>
              <div className="mt-1 h-1 w-full bg-white/50 overflow-hidden">
                <div className={`h-full w-3/4 bg-gradient-to-r ${s.accent.replace('text-', 'from-').replace('600', '500')} to-transparent opacity-40`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-[var(--color-accent)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((a) => {
            const Icon = a.icon
            return (
              <a
                key={a.href}
                href={a.href}
                className="group bg-white border border-[var(--color-border)] p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${a.gradient} opacity-5 transition-opacity duration-200 group-hover:opacity-10`} />
                <div className="relative flex items-start gap-4">
                  <div className={`shrink-0 p-2.5 bg-gradient-to-br ${a.gradient}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-0.5">{a.label}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{a.desc}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                  <span>Navigate</span>
                  <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
