'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'
import { signup } from '@/app/actions/auth'
import { Mail, Lock, Eye, EyeOff, Zap, Gift } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await signup(email, password)

      if (result?.error) {
        toast.error(result.error)
        setLoading(false)
      } else {
        toast.success('Account created successfully!')
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 100)
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 font-roboto mb-1">Create Account</h1>
            <p className="text-gray-500 text-xs">Get started with your digital services</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <Link href="/login" className="flex-1">
              <button
                onClick={() => setActiveTab('signin')}
                className={`w-full py-2.5 text-xs font-medium rounded-full transition-all ${
                  activeTab === 'signin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
            </Link>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 text-xs font-medium rounded-full transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 pr-4 py-3.5 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-11 pr-11 py-3.5 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-11 pr-11 py-3.5 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Referral Code Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Gift className="w-4 h-4" />
              </div>
              <Input
                type="text"
                placeholder="Referral code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="pl-11 pr-4 py-3.5 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-all"
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-gray-500 text-xs leading-relaxed">
                I agree to the{' '}
                <span className="text-gray-900 font-medium">Terms of Service</span>
                {' '}and{' '}
                <span className="text-gray-900 font-medium">Privacy Policy</span>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-all"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-gray-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl m-4 items-center justify-center relative overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-30 blur-3xl"></div>
          </div>

          {/* Decorative Elements */}
          <div className="relative z-10 text-center px-8">
            <div className="w-44 h-44 mx-auto mb-6 bg-white rounded-3xl shadow-xl flex items-center justify-center transform -rotate-6">
              <div className="w-36 h-36 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center rotate-6">
                <Zap className="w-14 h-14 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-roboto mb-2">
              Your all-in-one<br />digital services platform
            </h2>
            <p className="text-gray-600 text-xs">OTP • eSIM • Accounts • Boosting</p>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-1.5 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-1.5 bg-green-600 rounded-full"></div>
              <div className="w-2 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
