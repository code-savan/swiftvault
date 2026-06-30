'use server'

import { revalidatePath } from 'next/cache'
import { requireAuth, getDataClient } from '@/app/lib/clerk/server'

export async function getOTPRequests(limit: number = 10) {
  const userId = await requireAuth()
  const supabase = getDataClient()

  const { data, error } = await supabase
    .from('otp_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching OTP requests:', error)
    return { requests: [] }
  }

  return { requests: data || [] }
}

export async function getEchoNumbers() {
  const userId = await requireAuth()
  const supabase = getDataClient()

  const { data: numbers } = await supabase
    .from('echo_numbers')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (!numbers) {
    return { numbers: [] }
  }

  const numbersWithMessages = await Promise.all(
    numbers.map(async (number) => {
      const { data: messages } = await supabase
        .from('echo_messages')
        .select('*')
        .eq('echo_number_id', number.id)
        .order('received_at', { ascending: false })
        .limit(10)

      return {
        ...number,
        messages: messages || [],
      }
    })
  )

  return { numbers: numbersWithMessages }
}

export async function renewEchoNumber(numberId: string) {
  const userId = await requireAuth()
  const supabase = getDataClient()

  const { data: number } = await supabase
    .from('echo_numbers')
    .select('*')
    .eq('id', numberId)
    .eq('user_id', userId)
    .single()

  if (!number) {
    return { success: false, error: 'Number not found' }
  }

  const { data: userData } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single()

  const balance = userData?.wallet_balance || 0

  if (balance < number.monthly_cost) {
    return { success: false, error: 'Insufficient balance' }
  }

  const newBalance = balance - number.monthly_cost
  await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', userId)

  const currentExpiry = new Date(number.expiry_date)
  const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000)

  await supabase
    .from('echo_numbers')
    .update({
      expiry_date: newExpiry.toISOString(),
      active: true
    })
    .eq('id', numberId)

  await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount: -number.monthly_cost,
      type: 'purchase',
      description: `Echo number renewal: ${number.phone_number}`,
      status: 'completed',
    })

  revalidatePath('/dashboard')

  return { success: true }
}
