export type Locale = 'en' | 'ha' | 'yo' | 'ig' | 'pcm' | 'fr' | 'ar'

export type TranslationKey =
  | `nav.${string}`
  | `common.${string}`
  | `dashboard.${string}`
  | `wallet.${string}`
  | `otp.${string}`
  | `esim.${string}`
  | `logs.${string}`
  | `boosting.${string}`
  | `transactions.${string}`
  | `support.${string}`
  | `settings.${string}`
  | `settings.profile.${string}`
  | `settings.password.${string}`
  | `settings.twofactor.${string}`
  | `settings.payments.${string}`
  | `settings.billing.${string}`
  | `settings.notifications.${string}`
  | `settings.appearance.${string}`
  | `settings.language.${string}`
  | `onboarding.${string}`
  | `auth.${string}`

export type Translations = Record<string, string>
