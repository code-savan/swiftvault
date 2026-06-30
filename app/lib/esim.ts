export interface ESIMPlan {
  id: string
  name: string
  description: string
  country: string
  region: string
  data_amount: string
  validity: string
  price: number
  currency: string
  plan_type: string
  coverage_countries: number
  speed: string
  markup_rate: number
}

export interface ESIMOrder {
  id: string
  plan_id: string
  plan_name?: string
  iccid: string | null
  qr_code: string | null
  activation_code: string | null
  charge: number
  status: string
  data_used_mb: number
  valid_until: string | null
  created_at: string
}

export type CountryGroup =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania'
  | 'Middle East'

export interface CountryInfo {
  code: string
  name: string
  flag: string
  group: CountryGroup
}

export function finalPrice(plan: ESIMPlan): number {
  return Math.ceil(plan.price * plan.markup_rate * 100) / 100
}

const RESELLPORTAL_API_URL = process.env.RESELLPORTAL_API_URL || 'https://panel.resellportal.com/api'
const RESELLPORTAL_API_KEY = process.env.RESELLPORTAL_API_KEY || ''

async function resellPortalRequest(endpoint: string, body?: Record<string, unknown>) {
  const url = `${RESELLPORTAL_API_URL}/${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (RESELLPORTAL_API_KEY) {
    headers['Authorization'] = `Bearer ${RESELLPORTAL_API_KEY}`
  }

  const response = await fetch(
    url,
    body
      ? { method: 'POST', headers, body: JSON.stringify(body) }
      : { method: 'GET', headers }
  )

  if (!response.ok) {
    throw new Error(`ResellPortal API error: ${response.status}`)
  }

  return response.json()
}

const DEFAULT_PLANS: ESIMPlan[] = [
  { id: 'ng-1gb-7d', name: 'Nigeria 1GB', description: '1GB data for Nigeria', country: 'Nigeria', region: 'Africa', data_amount: '1GB', validity: '7 days', price: 2.50, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'ng-3gb-15d', name: 'Nigeria 3GB', description: '3GB data for Nigeria', country: 'Nigeria', region: 'Africa', data_amount: '3GB', validity: '15 days', price: 4.50, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'ng-5gb-30d', name: 'Nigeria 5GB', description: '5GB data for Nigeria', country: 'Nigeria', region: 'Africa', data_amount: '5GB', validity: '30 days', price: 7.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'gh-1gb-7d', name: 'Ghana 1GB', description: '1GB data for Ghana', country: 'Ghana', region: 'Africa', data_amount: '1GB', validity: '7 days', price: 2.50, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'gh-3gb-15d', name: 'Ghana 3GB', description: '3GB data for Ghana', country: 'Ghana', region: 'Africa', data_amount: '3GB', validity: '15 days', price: 4.50, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'za-1gb-7d', name: 'South Africa 1GB', description: '1GB data for South Africa', country: 'South Africa', region: 'Africa', data_amount: '1GB', validity: '7 days', price: 2.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'za-5gb-30d', name: 'South Africa 5GB', description: '5GB data for South Africa', country: 'South Africa', region: 'Africa', data_amount: '5GB', validity: '30 days', price: 6.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'ke-1gb-7d', name: 'Kenya 1GB', description: '1GB data for Kenya', country: 'Kenya', region: 'Africa', data_amount: '1GB', validity: '7 days', price: 2.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'ke-3gb-15d', name: 'Kenya 3GB', description: '3GB data for Kenya', country: 'Kenya', region: 'Africa', data_amount: '3GB', validity: '15 days', price: 4.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'us-1gb-7d', name: 'USA 1GB', description: '1GB data for USA', country: 'United States', region: 'North America', data_amount: '1GB', validity: '7 days', price: 3.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'us-5gb-30d', name: 'USA 5GB', description: '5GB data for USA', country: 'United States', region: 'North America', data_amount: '5GB', validity: '30 days', price: 8.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'us-10gb-30d', name: 'USA 10GB', description: '10GB data for USA', country: 'United States', region: 'North America', data_amount: '10GB', validity: '30 days', price: 12.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'gb-1gb-7d', name: 'UK 1GB', description: '1GB data for United Kingdom', country: 'United Kingdom', region: 'Europe', data_amount: '1GB', validity: '7 days', price: 2.50, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'gb-5gb-30d', name: 'UK 5GB', description: '5GB data for United Kingdom', country: 'United Kingdom', region: 'Europe', data_amount: '5GB', validity: '30 days', price: 7.00, currency: 'USD', plan_type: 'single', coverage_countries: 1, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'africa-3gb-15d', name: 'Africa Regional 3GB', description: '3GB across 15 African countries', country: 'Africa', region: 'Africa', data_amount: '3GB', validity: '15 days', price: 8.00, currency: 'USD', plan_type: 'regional', coverage_countries: 15, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'africa-10gb-30d', name: 'Africa Regional 10GB', description: '10GB across 15 African countries', country: 'Africa', region: 'Africa', data_amount: '10GB', validity: '30 days', price: 18.00, currency: 'USD', plan_type: 'regional', coverage_countries: 15, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'eur-5gb-30d', name: 'Europe Regional 5GB', description: '5GB across 39 European countries', country: 'Europe', region: 'Europe', data_amount: '5GB', validity: '30 days', price: 10.00, currency: 'USD', plan_type: 'regional', coverage_countries: 39, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'eur-20gb-30d', name: 'Europe Regional 20GB', description: '20GB across 39 European countries', country: 'Europe', region: 'Europe', data_amount: '20GB', validity: '30 days', price: 25.00, currency: 'USD', plan_type: 'regional', coverage_countries: 39, speed: '5G', markup_rate: 1.25 },
  { id: 'global-5gb-30d', name: 'Global 5GB', description: '5GB in 190+ countries worldwide', country: 'Global', region: 'Global', data_amount: '5GB', validity: '30 days', price: 15.00, currency: 'USD', plan_type: 'global', coverage_countries: 190, speed: '4G/5G', markup_rate: 1.25 },
  { id: 'global-20gb-30d', name: 'Global 20GB', description: '20GB in 190+ countries worldwide', country: 'Global', region: 'Global', data_amount: '20GB', validity: '30 days', price: 40.00, currency: 'USD', plan_type: 'global', coverage_countries: 190, speed: '5G', markup_rate: 1.25 },
]

export async function fetchPlansFromProvider(): Promise<ESIMPlan[]> {
  if (!RESELLPORTAL_API_KEY) {
    return DEFAULT_PLANS
  }

  try {
    const data = await resellPortalRequest('v1/esim/plans')
    if (Array.isArray(data)) {
      return data.map((p: Record<string, unknown>) => ({
        id: String(p.id || ''),
        name: String(p.name || ''),
        description: String(p.description || ''),
        country: String(p.country || ''),
        region: String(p.region || ''),
        data_amount: String(p.data_amount || ''),
        validity: String(p.validity || ''),
        price: Number(p.price) || 0,
        currency: String(p.currency || 'USD'),
        plan_type: String(p.plan_type || 'single'),
        coverage_countries: Number(p.coverage_countries) || 0,
        speed: String(p.speed || '4G/5G'),
        markup_rate: 1.25,
      }))
    }
    return DEFAULT_PLANS
  } catch {
    return DEFAULT_PLANS
  }
}

export async function purchaseFromProvider(
  planId: string
): Promise<{ iccid: string; qr_code: string; activation_code: string }> {
  if (!RESELLPORTAL_API_KEY) {
    return {
      iccid: `8931${Date.now()}001`,
      qr_code: `LPA:1$mock.srp.io$MOCK${planId.toUpperCase()}`,
      activation_code: `LPA:1$mock.srp.io$MOCK${planId.toUpperCase()}`,
    }
  }

  const data = await resellPortalRequest('v1/esim/orders', {
    plan_id: planId,
    quantity: 1,
  })

  return {
    iccid: String(data.iccid || ''),
    qr_code: String(data.qr_code || data.activation_code || ''),
    activation_code: String(data.activation_code || data.qr_code || ''),
  }
}

export const COUNTRY_MAP: CountryInfo[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', group: 'Africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', group: 'Africa' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', group: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', group: 'Africa' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', group: 'Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', group: 'Africa' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', group: 'Africa' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', group: 'Africa' },
  { code: 'US', name: 'United States', flag: '🇺🇸', group: 'North America' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', group: 'North America' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', group: 'North America' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', group: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', group: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', group: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', group: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', group: 'Europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', group: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', group: 'Europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', group: 'Europe' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', group: 'Middle East' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', group: 'Middle East' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', group: 'Middle East' },
  { code: 'IN', name: 'India', flag: '🇮🇳', group: 'Asia' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', group: 'Asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', group: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', group: 'Asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', group: 'Asia' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', group: 'South America' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', group: 'South America' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', group: 'Oceania' },
]
