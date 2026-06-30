'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { completeOnboarding } from '@/app/actions/auth'
import { Zap, ArrowRight, ChevronDown, Gift } from 'lucide-react'
import { toast } from 'sonner'

const countryCodes = [
  { code: '+234', country: 'Nigeria' },
  { code: '+233', country: 'Ghana' },
  { code: '+254', country: 'Kenya' },
  { code: '+27', country: 'South Africa' },
  { code: '+256', country: 'Uganda' },
  { code: '+255', country: 'Tanzania' },
  { code: '+250', country: 'Rwanda' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+260', country: 'Zambia' },
  { code: '+263', country: 'Zimbabwe' },
  { code: '+265', country: 'Malawi' },
  { code: '+1', country: 'US/Canada' },
  { code: '+44', country: 'UK' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [countryCode, setCountryCode] = useState('+234')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('pending_referral')
    if (stored) {
      setReferralCode(stored)
      sessionStorage.removeItem('pending_referral')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !phoneNumber.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await completeOnboarding({
        full_name: fullName.trim(),
        phone_number: `${countryCode} ${phoneNumber.trim()}`,
        referral_code: referralCode.trim() || undefined,
      })
      toast.success('Profile completed!')
      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Complete your profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Just a few details to get you started
          </p>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Full Name
                </label>
                <Input
                  placeholder="e.g. Taylor Okafor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your username will be auto-generated from your first name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Phone Number
                </label>
                <div className="flex rounded-xl border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-2 transition-all overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <select
                      ref={selectRef}
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-10 appearance-none bg-transparent pl-3 pr-7 text-sm text-gray-900 font-medium border-r border-gray-200 outline-none"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.country} ({c.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="800 000 0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="flex-1 h-10 px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent min-w-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-purple-500" />
                    Referral Code (optional)
                  </div>
                </label>
                <Input
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get a discount on your first purchase
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-xl cursor-pointer"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
