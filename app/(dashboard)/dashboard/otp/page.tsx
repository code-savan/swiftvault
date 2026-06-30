import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/app/actions/auth'
import OTPClient from './OTPClient'

export default async function OTPPage() {
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

  return (
    <OTPClient
      user={{
        id: userData.id,
        email: userData.email,
        wallet_balance: userData.wallet_balance || 0,
      }}
    />
  )
}
