'use server'

import { createClient } from '@/app/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getWalletBalance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { balance: 0 }
  }

  const { data } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', user.id)
    .single()

  return { balance: data?.wallet_balance || 0 }
}

export async function getTransactions(limit: number = 10) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { transactions: [] }
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching transactions:', error)
    return { transactions: [] }
  }

  return { transactions: data || [] }
}

export async function creditWallet(userId: string, amount: number, description: string, reference?: string) {
  const supabase = await createClient()

  // Get current balance
  const { data: userData } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single()

  const currentBalance = userData?.wallet_balance || 0
  const newBalance = currentBalance + amount

  // Update balance
  await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)

  // Create transaction record
  await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount,
      type: 'topup',
      description,
      status: 'completed',
      paystack_reference: reference,
    })

  revalidatePath('/dashboard')

  return { success: true, newBalance }
}

export async function deductWallet(
  userId: string,
  amount: number,
  description: string,
  referralCodeId?: string
) {
  const supabase = await createClient()

  // Get current balance
  const { data: userData } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single()

  const currentBalance = userData?.wallet_balance || 0

  if (currentBalance < amount) {
    return { success: false, error: 'Insufficient balance' }
  }

  const newBalance = currentBalance - amount

  // Update balance
  await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)

  // Create transaction record
  await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount: -amount,
      type: 'purchase',
      description,
      status: 'completed',
      referral_code_id: referralCodeId,
    })

  revalidatePath('/dashboard')

  return { success: true, newBalance }
}
