'use client'

import { useRouter } from 'next/navigation'
import { Navbar } from '@/app/components/Navbar'
import { logout } from '@/app/actions/auth'

interface AdminLayoutClientProps {
  userEmail: string
  children: React.ReactNode
}

export default function AdminLayoutClient({ userEmail, children }: AdminLayoutClientProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={{ email: userEmail }} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
