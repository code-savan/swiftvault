'use client'

import { useState } from 'react'
import { useI18n } from '@/app/contexts/I18nContext'
import { Card, CardContent } from '@/app/components/ui/card'
import { BuyOTPSection } from '@/app/components/BuyOTPSection'
import {
  Phone, Globe, Clock, Shield, ChevronRight
} from 'lucide-react'

interface OTPClientProps {
  user: {
    id: string
    email: string
    wallet_balance: number
  }
}

export default function OTPClient({ user }: OTPClientProps) {
  const [referralDiscount] = useState(0)
  const { t } = useI18n()

  const handlePurchaseSuccess = () => {
  }

  const popularServices: {
    name: string
    country: string
    price: number
    available: number
  }[] = []

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--color-accent-light)] rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">—</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t('otp.coverage')}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">—</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t('otp.rate')}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">—</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t('common.learnMore')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <BuyOTPSection
            walletBalance={user.wallet_balance}
            referralDiscount={referralDiscount}
            onPurchaseSuccess={handlePurchaseSuccess}
          />

          <Card className="border border-[var(--color-border)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{t('otp.popularCountries')}</h2>
              </div>
              {popularServices.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
                  <p className="text-sm text-[var(--color-text-muted)]">{t('otp.noNumbers')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {popularServices.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[var(--color-bg)] rounded-xl hover:bg-[var(--color-border)] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-surface)] rounded-lg flex items-center justify-center shadow-sm">
                          <Globe className="w-5 h-5 text-[var(--color-text-secondary)]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{service.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{service.country} • {service.available} {t('common.available')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">₦{service.price.toLocaleString()}</p>
                        <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      
    </>
  )
}
