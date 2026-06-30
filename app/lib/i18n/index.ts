import type { Translations } from './types'

const cache = new Map<string, Translations>()

export function loadTranslations(locale: string): Translations {
  if (cache.has(locale)) return cache.get(locale)!

  try {
    const translations = require(`./translations/${locale}.json`) as Translations
    cache.set(locale, translations)
    return translations
  } catch {
    const fallback = require('./translations/en.json') as Translations
    return fallback
  }
}

export function t(translations: Translations, key: string, fallback?: string): string {
  return translations[key] ?? fallback ?? key
}
