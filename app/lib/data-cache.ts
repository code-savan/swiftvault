const CACHE_PREFIX = 'sv_'
const DEFAULT_TTL = 10 * 60 * 1000

export function getCachedData<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const { data, expiry } = JSON.parse(raw)
    if (Date.now() > expiry) {
      sessionStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return data as T
  } catch {
    return null
  }
}

export function setCachedData<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, expiry: Date.now() + ttl }))
  } catch { }
}
