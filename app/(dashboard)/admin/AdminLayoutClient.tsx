'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { AdminSidebar } from '@/app/components/AdminSidebar'
import { Menu } from 'lucide-react'

interface AdminLayoutClientProps {
  userEmail: string
  children: React.ReactNode
}

export default function AdminLayoutClient({ userEmail, children }: AdminLayoutClientProps) {
  const router = useRouter()
  const { signOut } = useClerk()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminSidebar
        userEmail={userEmail}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="lg:pl-[240px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between h-14 px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-[var(--color-surface-hover)]"
            >
              <Menu className="w-5 h-5 text-[var(--color-text-primary)]" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-text-muted)]">
                {userEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
