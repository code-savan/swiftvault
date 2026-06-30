'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import type { BoostingService, BoostingOrder } from '@/app/lib/boosting'

const SIZZLE_API_URL = process.env.SIZZLE_API_URL!
const SIZZLE_API_KEY = process.env.SIZZLE_API_KEY!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sizzleRequest(body: Record<string, string>) {
  const params = new URLSearchParams(body)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  const response = await fetch(SIZZLE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    signal: controller.signal,
  })

  clearTimeout(timeout)

  if (!response.ok) {
    throw new Error(`Sizzle API error: ${response.status}`)
  }

  return response.json()
}

function mapService(svc: Record<string, any>): BoostingService {
  return {
    id: svc.id,
    name: svc.name,
    category: svc.category,
    rate: svc.rate,
    min_quantity: svc.min_quantity,
    max_quantity: svc.max_quantity,
    type: svc.type || 'default',
    description: svc.description || '',
    dripfeed: svc.dripfeed || false,
    markup_rate: svc.markup_rate ?? 1.25,
  }
}

export async function getServices(): Promise<BoostingService[]> {
  const { data: cached } = await supabase
    .from('boosting_services')
    .select('*')
    .eq('active', true)
    .order('category')

  return (cached || []).map(mapService)
}

export async function syncServices(): Promise<{ count: number; error?: string }> {
  try {
    const data = await sizzleRequest({
      key: SIZZLE_API_KEY,
      action: 'services',
    })

    if (!Array.isArray(data)) {
      return { count: 0, error: 'Invalid response from Sizzle' }
    }

    const { error } = await supabase.from('boosting_services').upsert(
      data.map((svc: Record<string, string>) => ({
        id: svc.service,
        name: svc.name,
        category: svc.category,
        rate: parseFloat(svc.rate),
        min_quantity: parseInt(svc.min),
        max_quantity: parseInt(svc.max),
        type: svc.type || 'default',
        description: svc.desc || '',
        dripfeed: String(svc.dripfeed) === '1',
        active: true,
      })),
      { onConflict: 'id', ignoreDuplicates: false }
    )

    if (error) return { count: 0, error: error.message }
    return { count: data.length }
  } catch (error: any) {
    console.error('Failed to sync services from Sizzle:', error)
    return { count: 0, error: error.message || 'Failed to sync services' }
  }
}

export async function getCategories(): Promise<string[]> {
  const services = await getServices()
  const categories = [...new Set(services.map((s) => s.category))]
  return categories.sort()
}

export async function placeOrder(
  serviceId: string,
  link: string,
  quantity: number,
  referralCode?: string
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: 'Not authenticated' }
  }

  // Get service details
  const { data: service, error: serviceError } = await supabase
    .from('boosting_services')
    .select('*')
    .eq('id', serviceId)
    .single()

  if (serviceError || !service) {
    return { success: false, error: 'Service not found' }
  }

  // Validate quantity
  if (quantity < service.min_quantity || quantity > service.max_quantity) {
    return {
      success: false,
      error: `Quantity must be between ${service.min_quantity} and ${service.max_quantity}`,
    }
  }

  // Calculate charge (rate per 1000 * quantity)
  const baseCharge = (service.rate * quantity) / 1000
  let charge = Math.ceil(baseCharge * service.markup_rate * 100) / 100

  // Referral discount
  let referralData: { id: string; discount_percent: number; commission_percent: number; influencer_id: string } | null = null
  if (referralCode) {
    const { data: refCode } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', referralCode.toUpperCase())
      .eq('active', true)
      .single()

    if (refCode) {
      referralData = {
        id: refCode.id,
        discount_percent: refCode.discount_percent,
        commission_percent: refCode.commission_percent,
        influencer_id: refCode.influencer_id,
      }
      const discount = Math.round((charge * refCode.discount_percent) / 100)
      charge = charge - discount
    }
  }

  try {
    // Place order with Sizzle
    const result = await sizzleRequest({
      key: SIZZLE_API_KEY,
      action: 'add',
      service: serviceId,
      link: link,
      quantity: quantity.toString(),
    })

    if (result.status !== 'success' || !result.order) {
      return { success: false, error: result.error || 'Failed to place order' }
    }

    const sizzleOrderId = result.order.toString()

    // Deduct from user wallet (atomic RPC with row lock)
    const { data: walletResult, error: walletError } = await supabase.rpc('deduct_wallet', {
      p_user_id: userId,
      p_amount: charge,
      p_description: `Boosting: ${service.name} x${quantity}`,
      p_referral_code_id: referralData?.id || null,
    })

    if (walletError) {
      console.error('Failed to deduct wallet:', walletError)
      return { success: false, error: 'Failed to process payment' }
    }

    const walletData = walletResult as unknown as { success: boolean; error?: string }
    if (!walletData.success) {
      return { success: false, error: walletData.error || 'Insufficient balance' }
    }

    // Store order in database
    const orderInsert: Record<string, any> = {
      user_id: userId,
      service_id: serviceId,
      service_name: service.name,
      link: link,
      quantity: quantity,
      charge: charge,
      sizzle_order_id: sizzleOrderId,
      status: 'pending',
    }
    if (referralData) {
      orderInsert.referral_code_id = referralData.id
    }

    const { data: order, error: orderError } = await supabase
      .from('boosting_orders')
      .insert(orderInsert)
      .select()
      .single()

    if (orderError) {
      console.error('Failed to store order:', orderError)
      return { success: true, orderId: sizzleOrderId }
    }

    // Create referral commission (atomic RPC)
    if (referralData) {
      const commission = Math.round((charge * referralData.commission_percent) / 100)
      await supabase.rpc('transfer_commission', {
        p_influencer_id: referralData.influencer_id,
        p_amount: commission,
        p_referral_code_id: referralData.id,
        p_description: 'Commission from boosting order',
      })
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Failed to place order:', error)
    return { success: false, error: 'Failed to place order' }
  }
}

export async function getOrderStatus(
  orderId: string
): Promise<{ status: string; start_count: number; remains: number } | null> {
  const { data: order, error } = await supabase
    .from('boosting_orders')
    .select('sizzle_order_id')
    .eq('id', orderId)
    .single()

  if (error || !order?.sizzle_order_id) {
    return null
  }

  try {
    const result = await sizzleRequest({
      key: SIZZLE_API_KEY,
      action: 'status',
      order: order.sizzle_order_id,
    })

    // Update local order status
    if (result.status) {
      await supabase
        .from('boosting_orders')
        .update({
          status: normalizeStatus(result.status),
          start_count: parseInt(result.start_count || '0'),
          remains: parseInt(result.remains || '0'),
        })
        .eq('id', orderId)
    }

    return {
      status: normalizeStatus(result.status),
      start_count: parseInt(result.start_count || '0'),
      remains: parseInt(result.remains || '0'),
    }
  } catch (error) {
    console.error('Failed to fetch order status:', error)
    return null
  }
}

export async function getUserOrders(): Promise<BoostingOrder[]> {
  const { userId } = await auth()
  if (!userId) return []

  const { data: orders, error } = await supabase
    .from('boosting_orders')
    .select(`
      *,
      boosting_services(name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Failed to fetch orders:', error)
    return []
  }

  return (orders || []).map((order) => ({
    id: order.id,
    service_id: order.service_id,
    service_name: order.service_name || order.boosting_services?.name || 'Unknown Service',
    link: order.link,
    quantity: order.quantity,
    charge: order.charge,
    sizzle_order_id: order.sizzle_order_id,
    status: order.status,
    start_count: order.start_count,
    remains: order.remains,
    created_at: order.created_at,
  }))
}

const STATUS_MAP: Record<string, string> = {
  pending: 'pending',
  processing: 'processing',
  'in progress': 'in_progress',
  'in_progress': 'in_progress',
  completed: 'completed',
  partial: 'partial',
  cancelled: 'cancelled',
  canceled: 'cancelled',
  refunded: 'refunded',
}

function normalizeStatus(s: string): string {
  return STATUS_MAP[s.toLowerCase()] || s.toLowerCase()
}

export async function syncPendingOrders(): Promise<{ synced: number; errors: number }> {
  const { userId } = await auth()
  if (!userId) return { synced: 0, errors: 0 }

  const { data: orders } = await supabase
    .from('boosting_orders')
    .select('id, sizzle_order_id')
    .eq('user_id', userId)
    .in('status', ['pending', 'processing', 'in_progress'])
    .not('sizzle_order_id', 'is', null)

  if (!orders || orders.length === 0) return { synced: 0, errors: 0 }

  let synced = 0
  let errors = 0

  await Promise.all(
    orders.map(async (order) => {
      try {
        const result = await sizzleRequest({
          key: SIZZLE_API_KEY,
          action: 'status',
          order: order.sizzle_order_id,
        })

        if (result.status) {
          await supabase
            .from('boosting_orders')
            .update({
              status: normalizeStatus(result.status),
              start_count: parseInt(result.start_count || '0'),
              remains: parseInt(result.remains || '0'),
            })
            .eq('id', order.id)
          synced++
        }
      } catch {
        errors++
      }
    })
  )

  return { synced, errors }
}

export async function syncAllPendingOrders(): Promise<{ synced: number; errors: number }> {
  const { data: orders } = await supabase
    .from('boosting_orders')
    .select('id, sizzle_order_id')
    .in('status', ['pending', 'processing', 'in_progress'])
    .not('sizzle_order_id', 'is', null)

  if (!orders || orders.length === 0) return { synced: 0, errors: 0 }

  let synced = 0
  let errors = 0

  await Promise.all(
    orders.map(async (order) => {
      try {
        const result = await sizzleRequest({
          key: SIZZLE_API_KEY,
          action: 'status',
          order: order.sizzle_order_id,
        })

        if (result.status) {
          await supabase
            .from('boosting_orders')
            .update({
              status: normalizeStatus(result.status),
              start_count: parseInt(result.start_count || '0'),
              remains: parseInt(result.remains || '0'),
            })
            .eq('id', order.id)
          synced++
        }
      } catch {
        errors++
      }
    })
  )

  return { synced, errors }
}

export async function getBalance(): Promise<{ balance: number; currency: string } | null> {
  try {
    const result = await sizzleRequest({
      key: SIZZLE_API_KEY,
      action: 'balance',
    })

    return {
      balance: parseFloat(result.balance || '0'),
      currency: result.currency || 'USD',
    }
  } catch (error) {
    console.error('Failed to fetch balance:', error)
    return null
  }
}
