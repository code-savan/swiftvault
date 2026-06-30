import { supabase } from './supabase'

export interface OTPTier {
  min_ngn: number
  max_ngn: number | null
  multiplier: number
}

export async function getPricingTiers(): Promise<OTPTier[]> {
  const { data } = await supabase
    .from('otp_pricing')
    .select('min_ngn, max_ngn, multiplier')
    .order('min_ngn', { ascending: true })

  if (!data || data.length === 0) {
    return [
      { min_ngn: 0, max_ngn: 3000, multiplier: 2.0 },
      { min_ngn: 3000, max_ngn: null, multiplier: 3.0 },
    ]
  }

  return data.map(t => ({
    min_ngn: Number(t.min_ngn),
    max_ngn: t.max_ngn !== null ? Number(t.max_ngn) : null,
    multiplier: Number(t.multiplier),
  }))
}

function serviceNoise(code: string): number {
  let hash = 0
  for (let i = 0; i < code.length; i++) {
    hash = ((hash << 5) - hash) + code.charCodeAt(i)
    hash |= 0
  }
  return (Math.abs(hash) % 201) + 100
}

export function calculatePrice(
  usdCost: number,
  serviceCode: string,
  tiers: OTPTier[],
  rate: number
): number {
  if (usdCost <= 0) return 1500

  const rawNgn = usdCost * rate

  const tier = tiers.find(t => rawNgn >= t.min_ngn && (t.max_ngn === null || rawNgn < t.max_ngn))
  const multiplier = tier?.multiplier ?? 2.0

  let price = rawNgn * multiplier

  price += serviceNoise(serviceCode)

  price = Math.min(price, 6000)

  price = Math.max(price, 1500)

  return Math.round(price)
}
