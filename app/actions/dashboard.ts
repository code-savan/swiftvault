'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function getUserStats() {
  const { userId } = await auth()
  if (!userId) return null

  const { data: orders } = await supabase
    .from('boosting_orders')
    .select('charge, status')
    .eq('user_id', userId)

  const totalSpent = (orders || [])
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.charge, 0)

  const activeCount = (orders || []).filter(
    (o) => o.status === 'pending' || o.status === 'processing' || o.status === 'in_progress'
  ).length

  return { totalSpent, activeServices: activeCount }
}

export async function getUserTransactions(limit = 20) {
  const { userId } = await auth()
  if (!userId) return []

  const { data } = await supabase
    .from('boosting_orders')
    .select('id, service_name, quantity, charge, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data || []).map((o) => ({
    id: o.id,
    service: o.service_name || 'Boosting Service',
    amount: o.charge,
    quantity: o.quantity,
    status: o.status,
    date: o.created_at,
  }))
}

export async function getUserWallet() {
  const { userId } = await auth()
  if (!userId) return null

  const { data: user } = await supabase
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .single()

  if (!user) return null

  const { data: orders } = await supabase
    .from('boosting_orders')
    .select('charge, status')
    .eq('user_id', userId)

  const totalSpent = (orders || [])
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.charge, 0)

  const { data: txns } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'topup')
    .eq('status', 'completed')

  const totalDeposits = (txns || []).reduce((sum, t) => sum + t.amount, 0)

  const { data: recentOrders } = await supabase
    .from('boosting_orders')
    .select('id, service_name, charge, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    wallet_balance: user.wallet_balance,
    totalDeposits,
    totalSpent,
    recentActivity: (recentOrders || []).map((o) => ({
      id: o.id,
      service: o.service_name || 'Boosting Service',
      amount: o.charge,
      status: o.status,
      date: o.created_at,
    })),
  }
}
