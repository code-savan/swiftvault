'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'
import { login } from '@/app/actions/auth'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result?.error) {
        toast.error(result.error)
        setLoading(false)
      } else {
        toast.success('Login successful!')
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 100)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      toast.error(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Heading */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-roboto mb-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Please enter your details</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-3 text-sm font-medium rounded-full transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <Link href="/register" className="flex-1">
              <button
                onClick={() => setActiveTab('signup')}
                className={`w-full py-3 text-sm font-medium rounded-full transition-all ${
                  activeTab === 'signup'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </Link>
        </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
                <Input
                  type="email"
                placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                className="pl-12 pr-4 py-4 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-all"
                />
              </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
                <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                className="pl-12 pr-12 py-4 text-sm bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                <span className="text-gray-600 text-xs">Remember me</span>
              </label>
              <button type="button" className="text-gray-900 font-medium text-xs hover:underline">
                Forgot password
              </button>
              </div>

            {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-all"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-gray-900 font-medium hover:underline">
                Sign up
              </Link>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl m-4 items-center justify-center relative overflow-hidden">
          {/* Abstract 3D Illustration Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-20 blur-3xl"></div>
          </div>

          {/* Decorative Elements */}
          <div className="relative z-10 text-center px-8">
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-xl flex items-center justify-center transform rotate-6">
              <div className="w-40 h-40 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center -rotate-6">
                <Zap className="w-16 h-16 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-roboto mb-2">
              Autonomous tech for a<br />connected future
            </h2>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-8 h-1.5 bg-gray-900 rounded-full"></div>
              <div className="w-2 h-1.5 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
