'use client'

import { useState } from 'react'
import { X, Bell, Info, AlertTriangle, CheckCircle, CreditCard, Gift, ChevronDown } from 'lucide-react'

interface Notification {
  id: number
  title: string
  message: string
  time: string
  type: 'info' | 'success' | 'warning' | 'promo'
  read: boolean
}

const mockNotifications: Notification[] = [
  { id: 1, title: 'Wallet credited successfully', message: 'Your wallet has been credited with ₦10,000. Reference: SV-ABC123. This deposit was completed via card payment and is now available for use across all services.', time: '2 min ago', type: 'success', read: false },
  { id: 2, title: 'New referral bonus earned', message: 'You earned ₦2,500 from a referral. Your friend "John Doe" signed up using your referral code and made their first purchase. Keep sharing your code to earn more commissions!', time: '1 hour ago', type: 'promo', read: false },
  { id: 3, title: 'OTP service update', message: 'New OTP countries added: Brazil, Mexico, and South Africa. We\'ve expanded our coverage to include 15 new countries across Latin America and Asia.', time: '3 hours ago', type: 'info', read: false },
  { id: 4, title: 'Service maintenance', message: 'Scheduled maintenance for SMS verification services on Sunday, June 30, 2026, from 2:00 AM to 4:00 AM WAT. Services may be temporarily unavailable during this window.', time: '1 day ago', type: 'warning', read: true },
  { id: 5, title: 'Boosting service limited offer', message: 'Get 15% bonus on all Instagram boosting services this week. Use code BOOST15 at checkout. Offer valid until July 7, 2026.', time: '2 days ago', type: 'promo', read: true },
  { id: 6, title: 'Account security tip', message: 'Enable two-factor authentication to secure your account. Go to Settings > Security to set it up. 2FA adds an extra layer of protection to your account.', time: '3 days ago', type: 'info', read: true },
]

const typeStyles = {
  info: 'bg-blue-50 text-blue-600',
  success: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
  warning: 'bg-amber-50 text-amber-600',
  promo: 'bg-purple-50 text-purple-600',
}

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  promo: Gift,
}

interface NotificationsSheetProps {
  open: boolean
  onClose: () => void
}

export function NotificationsSheet({ open, onClose }: NotificationsSheetProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-[var(--color-border)] z-50 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Notifications</h2>
            <p className="text-xs text-[var(--color-text-muted)]">{unread} unread</p>
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]">
              <X className="w-4 h-4 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-border)]">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-text-muted)]">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = typeIcons[n.type]
              const isExpanded = expandedId === n.id
              return (
                <div key={n.id} className={`${n.read ? '' : 'bg-[var(--color-accent-light)]/30'}`}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : n.id)}
                    className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-[var(--color-bg)] transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeStyles[n.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${n.read ? 'text-[var(--color-text-primary)]' : 'font-semibold text-[var(--color-text-primary)]'}`}>
                          {n.title}
                        </p>
                        <ChevronDown className={`w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                      <p className={`text-xs text-[var(--color-text-muted)] mt-0.5 ${isExpanded ? '' : 'line-clamp-1'}`}>
                        {isExpanded ? n.message : n.message}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">{n.time}</p>
                    </div>
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )}
</>
)
}
