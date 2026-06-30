'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth, getDataClient } from '@/app/lib/clerk/server'
import { auth } from '@clerk/nextjs/server'

export async function isAdmin() {
  try {
    const { userId } = await auth()
    const adminUserId = process.env.ADMIN_USER_ID
    return userId === adminUserId
  } catch {
    return false
  }
}

export async function getAdminStats() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }

  const supabase = getDataClient()

  // Get total revenue
  const { data: revenueData } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'topup')
    .eq('status', 'completed')

  const totalRevenue = revenueData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  // Get total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  // Get today's sales
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todaySales } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'purchase')
    .eq('status', 'completed')
    .gte('created_at', today.toISOString())

  const todayRevenue = todaySales?.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0

  // Get this week's sales
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data: weekSales } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'purchase')
    .eq('status', 'completed')
    .gte('created_at', weekAgo.toISOString())

  const weekRevenue = weekSales?.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0

  return {
    totalRevenue,
    totalUsers: totalUsers || 0,
    todayRevenue,
    weekRevenue,
  }
}

export async function getInfluencers() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }

  const supabase = getDataClient()

  const { data: codes } = await supabase
    .from('referral_codes')
    .select(`
      *,
      users:influencer_id (email)
    `)
    .order('created_at', { ascending: false })

  // Get sales count and commission for each code
  const codesWithStats = await Promise.all(
    (codes || []).map(async (code) => {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('referral_code_id', code.id)
        .eq('type', 'purchase')

      const salesCount = transactions?.length || 0

      const { data: commissions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('referral_code_id', code.id)
        .eq('type', 'commission')
        .eq('status', 'completed')

      const totalCommission = commissions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

      return {
        ...code,
        salesCount,
        totalCommission,
        influencerEmail: (code as any).users?.email || 'Unknown',
      }
    })
  )

  return { influencers: codesWithStats }
}

export async function getAllTransactions(limit: number = 50) {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }

  const supabase = getDataClient()

  const { data } = await supabase
    .from('transactions')
    .select(`
      *,
      users:user_id (email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { transactions: data || [] }
}

export async function getAllUsers(limit: number = 50) {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }

  const supabase = getDataClient()

  const { data } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  return { users: data || [] }
}

export async function getAllEchoNumbers() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }

  const supabase = getDataClient()

  const { data } = await supabase
    .from('echo_numbers')
    .select(`
      *,
      users:user_id (email)
    `)
    .order('created_at', { ascending: false })

  return { numbers: data || [] }
}

export async function createReferralCode(
  influencerEmail: string,
  code: string,
  discountPercent: number,
  commissionPercent: number
) {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }

  const supabase = getDataClient()

  // Get influencer by email
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('email', influencerEmail)
    .single()

  if (!userData) {
    return { success: false, error: 'User not found' }
  }

  // Create referral code
  const { error } = await supabase
    .from('referral_codes')
    .insert({
      code: code.toUpperCase(),
      influencer_id: userData.id,
      discount_percent: discountPercent,
      commission_percent: commissionPercent,
      active: true,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/referrals')
  revalidatePath('/admin/influencers')

  return { success: true }
}

export async function manualTopup(userEmail: string, amount: number, description: string) {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }

  const supabase = getDataClient()

  // Get user by email
  const { data: userData } = await supabase
    .from('users')
    .select('id, wallet_balance')
    .eq('email', userEmail)
    .single()

  if (!userData) {
    return { success: false, error: 'User not found' }
  }

  const newBalance = Number(userData.wallet_balance) + amount

  // Update balance
  await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userData.id)

  // Create transaction
  await supabase
    .from('transactions')
    .insert({
      user_id: userData.id,
      amount,
      type: 'topup',
      description: description || 'Manual top-up by admin',
      status: 'completed',
    })

  revalidatePath('/admin/users')

  return { success: true }
}
