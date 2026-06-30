'use server'

import { revalidatePath } from 'next/cache'
import { isAdmin } from './admin'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AdminBoostingService {
  id: string
  name: string
  category: string
  rate: number
  min_quantity: number
  max_quantity: number
  type: string
  description: string
  dripfeed: boolean
  active: boolean
  markup_rate: number
  created_at: string
  updated_at: string
}

export async function getAdminServices(): Promise<AdminBoostingService[]> {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const { data } = await supabase
    .from('boosting_services')
    .select('*')
    .order('category')
    .order('name')

  return (data || []) as AdminBoostingService[]
}

export async function updateMarkupRate(
  serviceId: string,
  markupRate: number
): Promise<{ success: boolean; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { success: false, error: 'Unauthorized' }

  if (markupRate < 0.5 || markupRate > 10) {
    return { success: false, error: 'Markup rate must be between 0.5 and 10' }
  }

  const { error } = await supabase
    .from('boosting_services')
    .update({ markup_rate: markupRate })
    .eq('id', serviceId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/boosting')
  return { success: true }
}

export async function updateBulkMarkupRate(
  categoryFilter: string | null,
  markupRate: number
): Promise<{ success: boolean; count: number; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { success: false, count: 0, error: 'Unauthorized' }

  if (markupRate < 0.5 || markupRate > 10) {
    return { success: false, count: 0, error: 'Markup rate must be between 0.5 and 10' }
  }

  let filter = supabase.from('boosting_services').select('*', { count: 'exact', head: true })

  if (categoryFilter) {
    filter = filter.ilike('category', `%${categoryFilter}%`)
  }

  const { count } = await filter

  let updateFilter = supabase.from('boosting_services').update({ markup_rate: markupRate })

  if (categoryFilter) {
    updateFilter = updateFilter.ilike('category', `%${categoryFilter}%`)
  }

  const { error } = await updateFilter

  if (error) {
    return { success: false, count: 0, error: error.message }
  }

  revalidatePath('/admin/boosting')
  return { success: true, count: count ?? 0 }
}

export async function getBoostingOrders(
  limit: number = 50
): Promise<{ id: string; service_name: string; quantity: number; charge: number; status: string; created_at: string; sizzle_rate: number; profit: number }[]> {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const { data } = await supabase
    .from('boosting_orders')
    .select(`
      *,
      boosting_services(name, rate, markup_rate)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data || []).map((order) => {
    const svc = order.boosting_services as { name: string; rate: number; markup_rate: number } | null
    const sizzleRate = svc?.rate ?? 0
    const markupRate = svc?.markup_rate ?? 1.0
    const cost = (sizzleRate * order.quantity) / 1000
    const profit = order.charge - Math.ceil(cost * 100) / 100
    return {
      id: order.id,
      service_name: svc?.name || 'Unknown',
      quantity: order.quantity,
      charge: order.charge,
      status: order.status,
      created_at: order.created_at,
      sizzle_rate: sizzleRate,
      profit: Math.round(profit * 100) / 100,
    }
  })
}
