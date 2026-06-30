'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SocialAccount {
  id: string
  platform: string
  account_type: string
  email: string | null
  password: string | null
  details: Record<string, any>
  price: number
  status: string
  created_at: string
}

export interface PurchasedAccount extends SocialAccount {
  buyer_id: string
  sold_at: string
}

export async function getAvailableAccounts(
  platformFilter?: string,
  typeFilter?: string
): Promise<SocialAccount[]> {
  let query = supabase
    .from('social_accounts')
    .select('id, platform, account_type, price, details, status, created_at')
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (platformFilter) {
    query = query.eq('platform', platformFilter.toUpperCase())
  }
  if (typeFilter) {
    query = query.eq('account_type', typeFilter)
  }

  const { data } = await query

  return (data || []).map((a) => ({
    id: a.id,
    platform: a.platform,
    account_type: a.account_type,
    email: null,
    password: null,
    details: a.details || {},
    price: Number(a.price),
    status: a.status,
    created_at: a.created_at,
  }))
}

export async function getAccountStats(): Promise<{
  totalAvailable: number
  totalSold: number
  byPlatform: { platform: string; count: number }[]
}> {
  const { data: available } = await supabase
    .from('social_accounts')
    .select('platform', { count: 'exact', head: false })
    .eq('status', 'available')

  const { count: totalSold } = await supabase
    .from('social_accounts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sold')

  const platformMap = new Map<string, number>()
  for (const a of available || []) {
    platformMap.set(a.platform, (platformMap.get(a.platform) || 0) + 1)
  }

  return {
    totalAvailable: available?.length || 0,
    totalSold: totalSold || 0,
    byPlatform: Array.from(platformMap.entries()).map(([platform, count]) => ({ platform, count })),
  }
}

export async function purchaseAccount(
  accountId: string
): Promise<{ success: boolean; account?: PurchasedAccount; error?: string }> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: account, error: accError } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('id', accountId)
    .eq('status', 'available')
    .single()

  if (accError || !account) {
    return { success: false, error: 'Account not found or already sold' }
  }

  const price = Number(account.price)

  // Deduct wallet atomically
  const { data: walletResult, error: walletError } = await supabase.rpc('deduct_wallet', {
    p_user_id: userId,
    p_amount: price,
    p_description: `Social account: ${account.platform} ${account.account_type}`,
    p_referral_code_id: null,
  })

  if (walletError || !(walletResult as unknown as { success: boolean }).success) {
    return { success: false, error: 'Failed to process payment' }
  }

  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('social_accounts')
    .update({
      status: 'sold',
      buyer_id: userId,
      sold_at: now,
    })
    .eq('id', accountId)

  if (updateError) {
    return { success: false, error: 'Failed to complete purchase' }
  }

  return {
    success: true,
    account: {
      id: account.id,
      platform: account.platform,
      account_type: account.account_type,
      email: account.email,
      password: account.password,
      details: account.details || {},
      price: price,
      status: 'sold',
      buyer_id: userId,
      sold_at: now,
      created_at: account.created_at,
    },
  }
}

export async function getUserPurchasedAccounts(): Promise<PurchasedAccount[]> {
  const { userId } = await auth()
  if (!userId) return []

  const { data } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('buyer_id', userId)
    .order('sold_at', { ascending: false })
    .limit(50)

  return (data || []).map((a) => ({
    id: a.id,
    platform: a.platform,
    account_type: a.account_type,
    email: a.email,
    password: a.password,
    details: a.details || {},
    price: Number(a.price),
    status: a.status,
    buyer_id: a.buyer_id,
    sold_at: a.sold_at,
    created_at: a.created_at,
  }))
}
