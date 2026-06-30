export interface LanguageConfig {
  code: string
  name: string
  native: string
  dir: 'ltr' | 'rtl'
}

export const languages: LanguageConfig[] = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'ha', name: 'Hausa', native: 'Hausa', dir: 'ltr' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá', dir: 'ltr' },
  { code: 'ig', name: 'Igbo', native: 'Igbo', dir: 'ltr' },
  { code: 'pcm', name: 'Nigerian Pidgin', native: 'Naija', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
]

export const defaultLocale = 'en'
