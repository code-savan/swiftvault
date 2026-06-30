import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreateUser } from '@/app/actions/auth'
import { DashboardShell } from '@/app/components/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await getOrCreateUser()
  if (!user) redirect('/login')

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email,
        wallet_balance: user.wallet_balance || 0,
        full_name: user.full_name || null,
        phone_number: user.phone_number || null,
        username: user.username || null,
        avatar_url: user.avatar_url || null,
      }}
    >
      {children}
    </DashboardShell>
  )
}
