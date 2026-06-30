'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'
import { createReferralCode } from '@/app/actions/admin'

export default function CreateReferralPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    influencerEmail: '',
    code: '',
    discountPercent: 30,
    commissionPercent: 20,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createReferralCode(
        formData.influencerEmail,
        formData.code,
        formData.discountPercent,
        formData.commissionPercent
      )

      if (result.success) {
        toast.success('Referral code created successfully')
        router.push('/admin/influencers')
      } else {
        toast.error(result.error || 'Failed to create code')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Create Referral Code</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Generate a new influencer referral code</p>
      </div>

      <Card className="border border-[var(--color-border)] max-w-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)] mb-1.5 block">
                Influencer Email
              </label>
              <Input
                type="email"
                placeholder="influencer@example.com"
                value={formData.influencerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, influencerEmail: e.target.value })
                }
                required
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Must be an existing user account
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)] mb-1.5 block">
                Referral Code
              </label>
              <Input
                type="text"
                placeholder="JAY30"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                required
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Should be unique and memorable
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-text-primary)] mb-1.5 block">
                  Discount Percent
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercent: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  % discount for users
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--color-text-primary)] mb-1.5 block">
                  Commission Percent
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commissionPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commissionPercent: Number(e.target.value),
                    })
                  }
                  required
                />
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  % commission for influencer
                </p>
              </div>
            </div>

            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] p-4">
              <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Example:</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">
                If a user buys ₦10,000 worth of services with this code:
              </p>
              <ul className="text-sm text-[var(--color-text-secondary)] mt-2 space-y-1">
                <li>• User pays: ₦{(10000 * (100 - formData.discountPercent) / 100).toLocaleString()} (after {formData.discountPercent}% discount)</li>
                <li>• Influencer earns: ₦{(10000 * (100 - formData.discountPercent) / 100 * formData.commissionPercent / 100).toLocaleString()} ({formData.commissionPercent}% commission)</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Referral Code'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
