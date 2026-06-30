'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Separator } from '@/app/components/ui/separator'
import { Breadcrumbs } from '@/app/components/ui/breadcrumbs'
import { getUserProfile, updateProfile } from '@/app/actions/settings'
import { getAvatarUrl, AVATAR_STYLES, DEFAULT_STYLE } from '@/app/lib/avatar'
import { X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/app/contexts/I18nContext'

interface ProfileData {
  full_name: string | null
  phone_number: string | null
  email: string
  username: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const { t } = useI18n()
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarStyle, setAvatarStyle] = useState(DEFAULT_STYLE)
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false)

  useEffect(() => {
    getUserProfile()
      .then((user: any) => {
        setData({
          full_name: user.full_name,
          phone_number: user.phone_number,
          email: user.email,
          username: user.username,
          avatar_url: user.avatar_url,
        })
        setName(user.full_name || '')
        setPhone(user.phone_number || '')
        if (user.avatar_url && !user.avatar_url.startsWith('http')) {
          setAvatarStyle(user.avatar_url)
        } else if (!user.avatar_url) {
          setAvatarStyle(DEFAULT_STYLE)
        }
      })
      .catch(() => toast.error(t('settings.profile.loadFailed')))
      .finally(() => setLoading(false))
  }, [t])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error(t('settings.profile.nameEmpty'))
      return
    }

    setSaving(true)
    try {
      await updateProfile({
        full_name: name.trim(),
        phone_number: phone.trim(),
        avatar_url: avatarStyle,
      })
      setData((prev) => prev ? { ...prev, full_name: name.trim(), phone_number: phone.trim(), avatar_url: avatarStyle } : prev)
      toast.success(t('settings.profile.updated'))
    } catch {
      toast.error(t('settings.profile.failed'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-48 bg-[var(--color-border)]" />
          <div className="h-64 bg-[var(--color-border)]" />
        </div>
      </div>
    )
  }

  const currentAvatar = getAvatarUrl(data?.email || '', avatarStyle)

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Settings', href: '/dashboard/settings' },
        { label: 'Profile' },
      ]} />

      <Card className="border border-[var(--color-border)]">
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4 pb-5 border-b border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setAvatarPickerOpen(true)}
                className="relative group"
              >
                <img
                  src={currentAvatar}
                  alt=""
                  className="w-16 h-16 rounded-full bg-gray-100"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-medium text-white">Change</span>
                </div>
              </button>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {data?.full_name || data?.username || 'User'}
                </p>
                {data?.username && (
                  <p className="text-xs text-[var(--color-text-muted)]">@{data.username}</p>
                )}
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Click avatar to change style</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{t('settings.profile.fullName')}</label>
              <Input
                placeholder={t('settings.profile.fullNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{t('settings.profile.email')}</label>
              <Input
                type="email"
                value={data?.email || ''}
                disabled
                className="bg-gray-50 text-[var(--color-text-muted)]"
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('settings.profile.emailDesc')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{t('settings.profile.phone')}</label>
              <Input
                type="tel"
                placeholder={t('settings.profile.phonePlaceholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? t('common.saving') : t('common.saveChanges')}
              </Button>
              <Link href="/dashboard/settings">
                <Button type="button" variant="outline">{t('common.cancel')}</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Avatar Picker Modal */}
      {avatarPickerOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setAvatarPickerOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-[var(--color-border)]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Choose Avatar Style</h3>
                <button onClick={() => setAvatarPickerOpen(false)} className="p-1 rounded hover:bg-[var(--color-surface-hover)]">
                  <X className="w-4 h-4 text-[var(--color-text-muted)]" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {AVATAR_STYLES.map((style) => {
                  const isSelected = avatarStyle === style.id
                  const previewUrl = style.url(encodeURIComponent(data?.email || 'user'))
                  return (
                    <button
                      key={style.id}
                      onClick={() => { setAvatarStyle(style.id); setAvatarPickerOpen(false) }}
                      className={`relative p-3 flex flex-col items-center gap-2 border-2 transition-all ${
                        isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                      }`}
                    >
                      <img src={previewUrl} alt={style.name} className="w-12 h-12 rounded-lg" />
                      <span className="text-[10px] text-[var(--color-text-secondary)] text-center leading-tight">{style.name}</span>
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--color-accent)] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
