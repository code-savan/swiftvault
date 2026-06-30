'use client'

import { useEffect } from 'react'
import { Button } from '@/app/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <span className="text-xl font-bold text-red-500">!</span>
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] text-center max-w-md mb-6">
        An unexpected error occurred. Please try again or contact support.
      </p>
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
