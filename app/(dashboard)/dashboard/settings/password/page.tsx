'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Separator } from '@/app/components/ui/separator'
import { Breadcrumbs } from '@/app/components/ui/breadcrumbs'
import {
  ArrowLeft, Info
} from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/app/contexts/I18nContext'

export default function PasswordPage() {
  const { t } = useI18n()
  const { user, isLoaded } = useUser()
  const [current, setCurrent] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  const hasPassword = user?.passwordEnabled

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error(t('settings.notAuthenticated'))
      return
    }

    if (!newPassword || !confirm) {
      toast.error(t('settings.fillRequired'))
      return
    }

    if (newPassword.length < 8) {
      toast.error(t('settings.password.minError'))
      return
    }

    if (newPassword !== confirm) {
      toast.error(t('settings.password.matchError'))
      return
    }

    if (hasPassword && !current) {
      toast.error(t('settings.password.currentRequired'))
      return
    }

    setSaving(true)
    try {
      await user.updatePassword(
        hasPassword
          ? { currentPassword: current, newPassword }
          : { newPassword }
      )
      toast.success(hasPassword ? t('settings.password.updated') : t('settings.password.created'))
      setCurrent('')
      setNewPassword('')
      setConfirm('')
    } catch (err) {
      const message = err instanceof Error ? err.message : t('settings.password.failed')
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div>
        <div className="animate-pulse h-64 bg-[var(--color-border)] rounded-xl" />
      </div>
    )
  }

  return (
    <>
        <Breadcrumbs items={[
          { label: 'Settings', href: '/dashboard/settings' },
          { label: 'Password' },
        ]} />

        {!hasPassword && (
          <Card className="border border-blue-200 shadow-sm bg-blue-50 mb-6">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">{t('settings.password.noPasswordSet')}</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  {t('settings.password.oauthInfo')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {hasPassword && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{t('settings.password.current')}</label>
                    <Input
                      type="password"
                      placeholder={t('settings.password.currentPlaceholder')}
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      required
                    />
                  </div>
                  <Separator />
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{t('settings.password.new')}</label>
                <Input
                  type="password"
                  placeholder={t('settings.password.newPlaceholder')}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('settings.password.minLength')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{t('settings.password.confirm')}</label>
                <Input
                  type="password"
                  placeholder={t('settings.password.confirmPlaceholder')}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? t('common.saving') : hasPassword ? t('settings.password.update') : t('settings.password.create')}
                </Button>
                <Link href="/dashboard/settings">
                  <Button type="button" variant="outline">{t('common.cancel')}</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
    </>
  )
}
