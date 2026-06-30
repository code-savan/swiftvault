'use server'

import { revalidatePath } from 'next/cache'
import { isAdmin } from './admin'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AdminSocialAccount {
  id: string
  platform: string
  account_type: string
  email: string | null
  password: string | null
  details: Record<string, any>
  price: number
  status: string
  buyer_id: string | null
  sold_at: string | null
  created_at: string
  updated_at: string
}

export async function getAdminAccounts(
  statusFilter?: string,
  platformFilter?: string
): Promise<AdminSocialAccount[]> {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  let query = supabase
    .from('social_accounts')
    .select('*')
    .order('created_at', { ascending: false })

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }
  if (platformFilter) {
    query = query.eq('platform', platformFilter.toUpperCase())
  }

  const { data } = await query
  return (data || []).map((a) => ({
    ...a,
    price: Number(a.price),
    details: a.details || {},
  })) as AdminSocialAccount[]
}

export async function addAccount(
  platform: string,
  accountType: string,
  email: string,
  password: string,
  price: number,
  details?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { success: false, error: 'Unauthorized' }

  if (!platform || !email || !password || price <= 0) {
    return { success: false, error: 'Platform, email, password, and valid price are required' }
  }

  const { error } = await supabase.from('social_accounts').insert({
    platform: platform.toUpperCase(),
    account_type: accountType || 'standard',
    email,
    password,
    price,
    details: details || {},
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/logs')
  return { success: true }
}

export async function bulkAddAccounts(
  accounts: { platform: string; account_type: string; email: string; password: string; price: number; details?: Record<string, any> }[]
): Promise<{ success: boolean; count: number; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { success: false, count: 0, error: 'Unauthorized' }

  const rows = accounts.map((a) => ({
    platform: a.platform.toUpperCase(),
    account_type: a.account_type || 'standard',
    email: a.email,
    password: a.password,
    price: a.price,
    details: a.details || {},
  }))

  const { error } = await supabase.from('social_accounts').insert(rows)

  if (error) {
    return { success: false, count: 0, error: error.message }
  }

  revalidatePath('/admin/logs')
  return { success: true, count: rows.length }
}

export async function updateAccount(
  id: string,
  data: Partial<{
    platform: string
    account_type: string
    email: string
    password: string
    price: number
    status: string
    details: Record<string, any>
  }>
): Promise<{ success: boolean; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { success: false, error: 'Unauthorized' }

  const updateData: Record<string, any> = {}
  if (data.platform) updateData.platform = data.platform.toUpperCase()
  if (data.account_type) updateData.account_type = data.account_type
  if (data.email !== undefined) updateData.email = data.email
  if (data.password !== undefined) updateData.password = data.password
  if (data.price !== undefined) updateData.price = data.price
  if (data.status) updateData.status = data.status
  if (data.details) updateData.details = data.details

  const { error } = await supabase
    .from('social_accounts')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/logs')
  return { success: true }
}

export async function deleteAccount(id: string): Promise<{ success: boolean; error?: string }> {
  const admin = await isAdmin()
  if (!admin) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('social_accounts')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/logs')
  return { success: true }
}

export async function getAdminAccountStats(): Promise<{
  totalAvailable: number
  totalSold: number
  totalSuspended: number
  totalAccounts: number
  byPlatform: { platform: string; count: number; available: number; sold: number }[]
}> {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')

  const { data: all } = await supabase.from('social_accounts').select('platform, status')

  let totalAvailable = 0
  let totalSold = 0
  let totalSuspended = 0
  const platformMap = new Map<string, { count: number; available: number; sold: number }>()

  for (const a of all || []) {
    if (a.status === 'available') totalAvailable++
    else if (a.status === 'sold') totalSold++
    else if (a.status === 'suspended') totalSuspended++

    const p = platformMap.get(a.platform) || { count: 0, available: 0, sold: 0 }
    p.count++
    if (a.status === 'available') p.available++
    else if (a.status === 'sold') p.sold++
    platformMap.set(a.platform, p)
  }

  return {
    totalAvailable,
    totalSold,
    totalSuspended,
    totalAccounts: all?.length || 0,
    byPlatform: Array.from(platformMap.entries()).map(([platform, stats]) => ({
      platform,
      ...stats,
    })),
  }
}
