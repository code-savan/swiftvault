import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import OTPClient from './OTPClient'

export default async function OTPPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile with wallet balance
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return (
    <OTPClient
      user={{
        id: profile.id,
        email: profile.email,
        wallet_balance: profile.wallet_balance
      }}
    />
  )
}
