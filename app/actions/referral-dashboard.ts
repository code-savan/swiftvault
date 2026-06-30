'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface ReferralDashboardData {
  referralCodes: {
    id: string
    code: string
    discount_percent: number
    commission_percent: number
    times_used: number
    total_commission: number
  }[]
  referredUsers: {
    id: string
    email: string
    full_name: string | null
    joined_at: string
  }[]
  recentCommissions: {
    id: string
    amount: number
    description: string
    created_at: string
  }[]
  totalEarned: number
  shareLink: string
}

export async function getReferralDashboard(): Promise<ReferralDashboardData | null> {
  const { userId } = await auth()
  if (!userId) return null

  const shareLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://swiftvult.com'}/register?ref=`

  // Get referral codes owned by this user
  const { data: codes } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('influencer_id', userId)

  const referralCodes = await Promise.all(
    (codes || []).map(async (code) => {
      const { count: timesUsed } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('referral_code_id', code.id)
        .eq('type', 'purchase')

      const { data: commissions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('referral_code_id', code.id)
        .eq('type', 'commission')
        .eq('status', 'completed')

      const totalCommission = commissions?.reduce((s, t) => s + Number(t.amount), 0) || 0

      return {
        id: code.id,
        code: code.code,
        discount_percent: code.discount_percent,
        commission_percent: code.commission_percent,
        times_used: timesUsed || 0,
        total_commission: totalCommission,
      }
    })
  )

  // Get users referred by this user
  const { data: referred } = await supabase
    .from('users')
    .select('id, email, full_name, created_at')
    .eq('referred_by', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get recent commissions
  const { data: commissions } = await supabase
    .from('transactions')
    .select('id, amount, description, created_at')
    .eq('user_id', userId)
    .eq('type', 'commission')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(20)

  const totalEarned = referralCodes.reduce((s, c) => s + c.total_commission, 0)

  return {
    referralCodes,
    referredUsers: (referred || []).map((u) => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      joined_at: u.created_at,
    })),
    recentCommissions: (commissions || []).map((c) => ({
      id: c.id,
      amount: Number(c.amount),
      description: c.description,
      created_at: c.created_at,
    })),
    totalEarned,
    shareLink,
  }
}

export async function getMyReferralCode(): Promise<{ code: string | null }> {
  const { userId } = await auth()
  if (!userId) return { code: null }

  const { data } = await supabase
    .from('referral_codes')
    .select('code')
    .eq('influencer_id', userId)
    .eq('active', true)
    .limit(1)
    .single()

  if (!data) return { code: null }
  return { code: data.code }
}
