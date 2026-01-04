'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'

interface ReferralInputProps {
  onApply: (code: string, discount: number) => void
}

export function ReferralInput({ onApply }: ReferralInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Please enter a referral code')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/referral/validate?code=${code}`)
      const data = await response.json()

      if (data.valid) {
        onApply(code, data.discount_percent)
        setApplied(true)
        toast.success(`${data.discount_percent}% discount applied!`)
      } else {
        toast.error('Invalid referral code')
      }
    } catch (error) {
      toast.error('Failed to validate code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter referral code (optional)"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        disabled={applied || loading}
      />
      <Button
        onClick={handleApply}
        disabled={applied || loading || !code.trim()}
        variant="outline"
      >
        {applied ? 'Applied' : 'Apply'}
      </Button>
    </div>
  )
}
