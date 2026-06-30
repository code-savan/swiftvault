import { supabase } from './supabase'

const FALLBACK_RATE = 1600
const RATE_BUFFER = 100
const CACHE_TTL_MS = 60 * 60 * 1000

export async function getUSDNGN(): Promise<number> {
  const cached = await getCachedRate()
  if (cached !== null) return cached + RATE_BUFFER

  const fresh = await fetchRate()
  if (fresh !== null) {
    await supabase.from('exchange_rates').update({ rate: fresh, updated_at: new Date().toISOString() }).eq('id', 1)
    return fresh + RATE_BUFFER
  }

  return FALLBACK_RATE + RATE_BUFFER
}

async function getCachedRate(): Promise<number | null> {
  const { data } = await supabase
    .from('exchange_rates')
    .select('rate, updated_at')
    .eq('id', 1)
    .single()

  if (!data) return null

  const age = Date.now() - new Date(data.updated_at).getTime()
  if (age > CACHE_TTL_MS) return null

  return Number(data.rate)
}

async function fetchRate(): Promise<number | null> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(5000),
    })
    const json = await res.json()
    const ngn = json?.rates?.NGN
    return typeof ngn === 'number' ? ngn : null
  } catch {
    return null
  }
}
