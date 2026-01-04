'use server'

import { createClient } from '@/app/lib/supabase/server'

export async function validateReferralCode(code: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .single()

  if (error || !data) {
    return { valid: false }
  }

  return {
    valid: true,
    code: data.code,
    discount_percent: data.discount_percent,
    commission_percent: data.commission_percent,
    referral_code_id: data.id,
    influencer_id: data.influencer_id,
  }
}

export async function applyReferralCommission(
  influencerId: string,
  amount: number,
  referralCodeId: string
) {
  const supabase = await createClient()

  // Get influencer current balance
  const { data: userData } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', influencerId)
    .single()

  const currentBalance = userData?.wallet_balance || 0
  const newBalance = currentBalance + amount

  // Update balance
  await supabase
    .from('users')
    .update({ wallet_balance: newBalance })
    .eq('id', influencerId)

  // Create commission transaction
  await supabase
    .from('transactions')
    .insert({
      user_id: influencerId,
      amount,
      type: 'commission',
      description: 'Referral commission',
      status: 'completed',
      referral_code_id: referralCodeId,
    })

  return { success: true }
}
