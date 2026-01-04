import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { getEchoNumbers } from '@/app/actions/otp'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user data
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get echo numbers
  const { numbers: echoNumbers } = await getEchoNumbers()

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email!,
        wallet_balance: userData?.wallet_balance || 0,
      }}
      initialEchoNumbers={echoNumbers}
    />
  )
}
