'use client'

import { useState } from 'react'
import { useI18n } from '@/app/contexts/I18nContext'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import {
  MessageCircle, Mail, FileText, HelpCircle, ExternalLink, ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'

const SUPPORT_EMAIL = 'support@swiftvault.com'
const DOCS_URL = 'https://docs.swiftvault.com'

const faqItems = [
  { q: 'How do I purchase OTP numbers?', a: 'Navigate to OTP Numbers from the sidebar, select your country and service, then click "Get Number". The cost will be deducted from your wallet balance.' },
  { q: 'How do I add funds to my wallet?', a: 'Go to Wallet from the sidebar, click "Add Funds", choose an amount and payment method (Card or Bank Transfer). Funds are credited instantly via card or within 1-5 minutes for bank transfers.' },
  { q: 'What are referral codes and how do they work?', a: 'Referral codes give you discounts on services and earn the referrer a commission. You can find your referral code in the Referral section. Share it with friends to earn bonuses.' },
  { q: 'How do I contact support?', a: 'You can reach us via email at support@swiftvault.com or use the live chat feature. Our support team typically responds within 24 hours.' },
]

export default function SupportPage() {
  const { t } = useI18n()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border border-[var(--color-border)] hover:shadow-md transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-[var(--color-accent)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{t('support.liveChat')}</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">{t('support.liveChatDesc')}</p>
            <Button
              className="w-full"
              onClick={() => toast.info('Live chat coming soon. Email us at ' + SUPPORT_EMAIL)}
            >
              {t('common.startChat')}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)] hover:shadow-md transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{t('support.emailSupport')}</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">{t('support.emailSupportDesc')}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`mailto:${SUPPORT_EMAIL}`, '_blank')}
            >
              {t('common.sendEmail')}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)] hover:shadow-md transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{t('support.documentation')}</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">{t('support.documentationDesc')}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(DOCS_URL, '_blank', 'noopener')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              {t('common.viewDocs')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">{t('support.faq')}</h2>
        <Card className="border border-[var(--color-border)]">
          <CardContent className="p-0 divide-y divide-[var(--color-border)]">
            {faqItems.map((faq, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--color-bg)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{faq.q}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pl-[3.25rem]">
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Still Need Help */}
      <Card className="border border-[var(--color-border)] bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">{t('support.stillNeedHelp')}</h3>
          <p className="text-gray-300 text-sm mb-4">
            {t('support.stillNeedHelpDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{SUPPORT_EMAIL}</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
