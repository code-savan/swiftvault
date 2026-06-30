'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth, getDataClient } from '@/app/lib/clerk/server'

export async function getWalletBalance() {
  const userId = await requireAuth()
  const supabase = getDataClient()

  const { data } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single()

  return { balance: data?.wallet_balance || 0 }
}

export async function getTransactions(limit: number = 10) {
  const userId = await requireAuth()
  const supabase = getDataClient()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching transactions:', error)
    return { transactions: [] }
  }

  return { transactions: data || [] }
}

export async function creditWallet(userId: string, amount: number, description: string, reference?: string) {
  const supabase = getDataClient()

  const { data, error } = await supabase.rpc('credit_wallet', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description,
    p_reference: reference || null,
  })

  if (error) {
    console.error('creditWallet RPC failed:', error)
    return { success: false, error: error.message }
  }

  const result = data as unknown as { success: boolean; new_balance?: number; error?: string }
  if (!result.success) {
    return { success: false, error: result.error || 'Failed to credit wallet' }
  }

  revalidatePath('/dashboard')
  return { success: true, newBalance: result.new_balance }
}

export async function deductWallet(
  userId: string,
  amount: number,
  description: string,
  referralCodeId?: string
) {
  const supabase = getDataClient()

  const { data, error } = await supabase.rpc('deduct_wallet', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description,
    p_referral_code_id: referralCodeId || null,
  })

  if (error) {
    console.error('deductWallet RPC failed:', error)
    return { success: false, error: error.message }
  }

  const result = data as unknown as { success: boolean; new_balance?: number; error?: string }
  if (!result.success) {
    return { success: false, error: result.error || 'Failed to deduct wallet' }
  }

  revalidatePath('/dashboard')
  return { success: true, newBalance: result.new_balance }
}
