'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { getDataClient } from '@/app/lib/clerk/server'
import { revalidatePath } from 'next/cache'

export async function getUserProfile() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = getDataClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) {
    console.error('getUserProfile failed:', JSON.stringify(error))
    throw new Error('Failed to load profile')
  }

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    phone_number: data.phone_number,
    username: data.username,
    wallet_balance: data.wallet_balance,
    avatar_url: data.avatar_url,
    preferences: data.preferences as Record<string, unknown> | null,
  }
}

export async function updateProfile(data: {
  full_name: string
  phone_number: string
  avatar_url?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = getDataClient()

  const updates: Record<string, any> = {
    full_name: data.full_name.trim(),
    phone_number: data.phone_number.trim(),
  }
  if (data.avatar_url !== undefined) {
    updates.avatar_url = data.avatar_url.trim() || null
  }

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)

  if (error) {
    console.error('updateProfile failed:', JSON.stringify(error))
    throw new Error('Failed to update profile')
  }

  revalidatePath('/dashboard/settings/profile')
  return { success: true }
}

export async function updatePreferences(prefs: Record<string, unknown>) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = getDataClient()

  const { error } = await supabase
    .from('users')
    .update({ preferences: prefs })
    .eq('id', userId)

  if (error) {
    console.error('updatePreferences failed:', JSON.stringify(error))
    throw new Error('Failed to update preferences')
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function deleteAccount() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const client = await clerkClient()

  // Delete from Clerk first
  try {
    await client.users.deleteUser(userId)
  } catch (error) {
    console.error('Clerk delete failed:', JSON.stringify(error))
    throw new Error('Failed to delete account')
  }

  // Supabase CASCADE handles related records (transactions, otp_requests, etc.)
  const supabase = getDataClient()
  const { error: dbError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (dbError) {
    console.error('Supabase delete failed:', JSON.stringify(dbError))
    throw new Error('Failed to delete account data')
  }

  revalidatePath('/')
  return { success: true }
}

export async function getTransactions(limit = 20) {
  const { userId } = await auth()
  if (!userId) return { transactions: [] }

  const supabase = getDataClient()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getTransactions failed:', JSON.stringify(error))
    return { transactions: [] }
  }

  return { transactions: data || [] }
}
