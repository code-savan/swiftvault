'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import type { ESIMPlan, ESIMOrder } from '@/app/lib/esim'
import { fetchPlansFromProvider, purchaseFromProvider } from '@/app/lib/esim'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getPlans(): Promise<ESIMPlan[]> {
  const { data: cached } = await supabase
    .from('esim_plans')
    .select('*')
    .eq('active', true)
    .order('country')

  if (cached && cached.length > 0) {
    return cached.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      country: p.country,
      region: p.region || '',
      data_amount: p.data_amount,
      validity: p.validity,
      price: p.price,
      currency: p.currency,
      plan_type: p.plan_type,
      coverage_countries: p.coverage_countries || 0,
      speed: p.speed,
      markup_rate: p.markup_rate,
    }))
  }

  try {
    const plans = await fetchPlansFromProvider()

    for (const plan of plans) {
      await supabase.from('esim_plans').upsert(
        {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          country: plan.country,
          region: plan.region,
          data_amount: plan.data_amount,
          validity: plan.validity,
          price: plan.price,
          currency: plan.currency,
          plan_type: plan.plan_type,
          coverage_countries: plan.coverage_countries,
          speed: plan.speed,
          active: true,
        },
        { onConflict: 'id' }
      )
    }

    return plans
  } catch {
    return []
  }
}

export async function purchasePlan(
  planId: string,
  referralCode?: string
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: plan, error: planError } = await supabase
    .from('esim_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    return { success: false, error: 'Plan not found' }
  }

  let charge = Math.ceil(plan.price * plan.markup_rate * 100) / 100

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
    const result = await purchaseFromProvider(planId)

    // Deduct from user wallet (atomic RPC with row lock)
    const { data: walletResult, error: walletError } = await supabase.rpc('deduct_wallet', {
      p_user_id: userId,
      p_amount: charge,
      p_description: `eSIM: ${plan.name}`,
      p_referral_code_id: referralData?.id || null,
    })

    if (walletError) {
      return { success: false, error: 'Failed to process payment' }
    }

    const walletData = walletResult as unknown as { success: boolean; error?: string }
    if (!walletData.success) {
      return { success: false, error: walletData.error || 'Insufficient balance' }
    }

    const validUntil = new Date()
    const daysMatch = plan.validity.match(/(\d+)/)
    if (daysMatch) {
      validUntil.setDate(validUntil.getDate() + parseInt(daysMatch[1]))
    }

    const orderInsert: Record<string, any> = {
      user_id: userId,
      plan_id: planId,
      iccid: result.iccid,
      qr_code: result.qr_code,
      activation_code: result.activation_code,
      charge: charge,
      status: 'issued',
      valid_until: validUntil.toISOString(),
    }
    if (referralData) {
      orderInsert.referral_code_id = referralData.id
    }

    const { data: order, error: orderError } = await supabase
      .from('esim_orders')
      .insert(orderInsert)
      .select()
      .single()

    if (orderError) {
      return { success: true, orderId: undefined }
    }

    // Create referral commission (atomic RPC)
    if (referralData) {
      const commission = Math.round((charge * referralData.commission_percent) / 100)
      await supabase.rpc('transfer_commission', {
        p_influencer_id: referralData.influencer_id,
        p_amount: commission,
        p_referral_code_id: referralData.id,
        p_description: 'Commission from eSIM purchase',
      })
    }

    return { success: true, orderId: order.id }
  } catch {
    return { success: false, error: 'Failed to purchase eSIM' }
  }
}

export async function getUserOrders(): Promise<ESIMOrder[]> {
  const { userId } = await auth()
  if (!userId) return []

  const { data: orders, error } = await supabase
    .from('esim_orders')
    .select(`
      *,
      esim_plans(name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return []
  }

  return (orders || []).map((order) => ({
    id: order.id,
    plan_id: order.plan_id,
    plan_name: order.esim_plans?.name || 'Unknown Plan',
    iccid: order.iccid,
    qr_code: order.qr_code,
    activation_code: order.activation_code,
    charge: order.charge,
    status: order.status,
    data_used_mb: order.data_used_mb,
    valid_until: order.valid_until,
    created_at: order.created_at,
  }))
}
