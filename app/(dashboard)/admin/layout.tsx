import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const adminUserId = process.env.ADMIN_USER_ID
  if (user.id !== adminUserId) {
    redirect('/dashboard')
  }

  return (
    <AdminLayoutClient userEmail={user.email!}>
      {children}
    </AdminLayoutClient>
  )
}
