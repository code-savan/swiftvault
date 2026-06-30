'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { deleteAccount } from '@/app/actions/settings'
import { useAuth } from '@clerk/nextjs'
import { useI18n } from '@/app/contexts/I18nContext'
import {
  Bell, User, Lock, Shield, CreditCard,
  Globe, Moon, ChevronRight, AlertTriangle, X
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { signOut } = useAuth()

  const settingsSections = [
    {
      title: t('settings.account'),
      items: [
        { name: t('settings.profile.title'), description: t('settings.profile.description'), icon: User, href: '/dashboard/settings/profile' },
        { name: t('settings.password.title'), description: t('settings.password.description'), icon: Lock, href: '/dashboard/settings/password' },
        { name: t('settings.twofactor.title'), description: t('settings.twofactor.description'), icon: Shield, href: '/dashboard/settings/two-factor' },
      ]
    },
    {
      title: t('settings.payments'),
      items: [
        { name: t('settings.payments.title'), description: t('settings.payments.description'), icon: CreditCard, href: '/dashboard/settings/payments' },
        { name: t('settings.billing.title'), description: t('settings.billing.description'), icon: Globe, href: '/dashboard/settings/billing' },
      ]
    },
    {
      title: t('settings.preferences'),
      items: [
        { name: t('settings.notifications.title'), description: t('settings.notifications.description'), icon: Bell, href: '/dashboard/settings/notifications' },
        { name: t('settings.appearance.title'), description: t('settings.appearance.description'), icon: Moon, href: '/dashboard/settings/appearance' },
        { name: t('settings.language.title'), description: t('settings.language.description'), icon: Globe, href: '/dashboard/settings/language' },
      ]
    }
  ]
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (deleteConfirmText !== 'DELETE') return

    setDeleting(true)
    try {
      await deleteAccount()
      toast.success(t('settings.deleteSuccess'))
      await signOut()
      router.push('/')
    } catch {
      toast.error(t('settings.deleteError'))
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="max-w-4xl">
        {settingsSections.map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
              {section.title}
            </h2>
            <Card className="border border-[var(--color-border)]">
              <CardContent className="p-0 divide-y divide-[var(--color-border)]">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[var(--color-bg)] rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0" />
                    </Link>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        ))}

        <div className="mb-8">
          <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">
            {t('settings.dangerZone')}
          </h2>
          <Card className="border-2 border-red-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('settings.deleteAccount')}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t('settings.deleteAccountDesc')}</p>
                </div>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="border border-[var(--color-border)] shadow-xl w-full max-w-md animate-in fade-in zoom-in-95">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{t('settings.deleteAccount')}</h3>
                </div>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                  className="p-1.5 hover:bg-[var(--color-bg)] rounded-lg"
                >
                  <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {t('settings.deleteConfirm')}
                </p>

                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-xs text-red-700">
                    {t('settings.deleteTypeConfirm')}
                  </p>
                </div>

                <Input
                  placeholder={t('settings.deletePlaceholder')}
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleDelete}
                    disabled={deleteConfirmText !== 'DELETE' || deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? t('common.saving') : t('settings.deleteAccount')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
