'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Referral Code</h1>
        <p className="text-gray-600">Generate a new influencer referral code</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
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
              <p className="text-xs text-gray-500 mt-1">
                Must be an existing user account
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
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
              <p className="text-xs text-gray-500 mt-1">
                Should be unique and memorable
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
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
                <p className="text-xs text-gray-500 mt-1">
                  % discount for users
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
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
                <p className="text-xs text-gray-500 mt-1">
                  % commission for influencer
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Example:</h4>
              <p className="text-sm text-gray-600">
                If a user buys ₦10,000 worth of services with this code:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
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
