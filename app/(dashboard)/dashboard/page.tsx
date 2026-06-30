import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/app/actions/auth'
import { getUserStats, getUserTransactions } from '@/app/actions/dashboard'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  let userData
  try {
    userData = await getOrCreateUser()
  } catch (error) {
    console.error('Failed to load user:', error)
    redirect('/login')
  }

  if (!userData) redirect('/login')

  const [stats, transactions] = await Promise.all([
    getUserStats(),
    getUserTransactions(5),
  ])

  return (
    <DashboardClient
      user={{
        id: userData.id,
        email: userData.email,
        wallet_balance: userData.wallet_balance || 0,
        totalSpent: stats?.totalSpent ?? 0,
        activeServices: stats?.activeServices ?? 0,
        avatar_url: userData.avatar_url || null,
      }}
      transactions={transactions}
    />
  )
}
