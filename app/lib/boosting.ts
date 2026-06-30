export interface BoostingService {
  id: string
  name: string
  category: string
  rate: number
  min_quantity: number
  max_quantity: number
  type: string
  description: string
  dripfeed: boolean
  markup_rate: number
}

export interface BoostingOrder {
  id: string
  service_id: string
  service_name?: string
  link: string
  quantity: number
  charge: number
  sizzle_order_id: string | null
  status: string
  start_count: number
  remains: number
  created_at: string
}

export function finalRate(service: BoostingService): number {
  return Math.ceil(service.rate * service.markup_rate * 100) / 100
}

export function finalPrice(service: BoostingService, quantity: number): number {
  const base = (service.rate * quantity) / 1000
  return Math.ceil(base * service.markup_rate * 100) / 100
}
