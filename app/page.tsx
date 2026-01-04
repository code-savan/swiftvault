import Link from 'next/link'
import { createClient } from '@/app/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import {
  Check, Shield, Zap, Globe, MessageSquare, TrendingUp, Phone,
  Smartphone, Wifi, Users, CreditCard, ArrowRight, Star,
  ChevronRight, Lock, BarChart3, Rocket, ShieldCheck, Layers,
  Signal, UserPlus, Share2
} from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D2818]/95 backdrop-blur-md border-b border-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SwiftVault</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm">
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold rounded-full px-6">
                  Open an Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark Green Theme */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#0D2818] via-[#1A4D2E] to-[#0D2818] pt-16 overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-dark opacity-50"></div>

        {/* Curved decorative lines */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute top-0 right-0 w-full h-full opacity-10" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M0,200 Q250,100 500,200 T1000,200" stroke="#4ADE80" fill="none" strokeWidth="2"/>
            <path d="M0,400 Q250,300 500,400 T1000,400" stroke="#4ADE80" fill="none" strokeWidth="2"/>
            <path d="M0,600 Q250,500 500,600 T1000,600" stroke="#4ADE80" fill="none" strokeWidth="2"/>
            <path d="M0,800 Q250,700 500,800 T1000,800" stroke="#4ADE80" fill="none" strokeWidth="2"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-6">
                <ShieldCheck className="w-4 h-4" />
                Certified Digital Services Partner
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Suite of Digital<br />
                <span className="text-green-400">Services</span> &<br />
                Products
          </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                Thousands of users trust SwiftVault for OTP verification, eSIM plans,
                social media accounts, and account boosting services. Your all-in-one digital platform.
          </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/register">
                  <Button size="lg" className="bg-white text-[#0D2818] hover:bg-gray-100 font-semibold rounded-full px-8 py-6 text-lg btn-glow transition-all">
                    Open an Account
              </Button>
            </Link>
            <Link href="/login">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                    Contact Sales
              </Button>
            </Link>
          </div>
        </div>

            {/* Right side - Floating dashboard cards */}
            <div className="relative hidden lg:block h-[600px]">
              {/* BTC Transaction Card */}
              <div className="absolute top-0 left-0 animate-float">
                <Card className="glass-card card-shadow rounded-2xl p-4 w-56">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">+</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">OTP Received</p>
                  <p className="text-xl font-bold text-gray-900">+234***7890</p>
                  <p className="text-sm text-gray-500 mt-1">Code: 847291</p>
                  <div className="mt-4 space-y-2">
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg">
                      Copy Code
                    </Button>
                    <Button variant="outline" className="w-full text-sm rounded-lg">
                      View Details
                    </Button>
                  </div>
                </Card>
        </div>

              {/* Stats Card */}
              <div className="absolute top-10 right-0 animate-float-delayed">
                <Card className="glass-card card-shadow rounded-2xl p-4 w-48">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">128.7K</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-green-600 text-sm font-medium">↑ 12.5%</span>
                    <span className="text-gray-400 text-xs">this month</span>
                  </div>
                  {/* Mini chart */}
                  <div className="flex items-end gap-1 mt-4 h-12">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-green-500 rounded-t" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Balance Card */}
              <div className="absolute top-56 left-8 animate-float-delayed-2">
                <Card className="glass-card card-shadow rounded-2xl p-5 w-64">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Your Balance</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">₦124,420.50</p>
                  <p className="text-sm text-green-600 font-medium mt-1">+₦4,500.00 this week</p>
                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">Naira</span>
                    <span className="px-3 py-1 bg-green-100 rounded-full text-xs font-medium text-green-700">Active</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">OTP Balance</span>
                      <span className="font-semibold">15 credits</span>
                    </div>
                  </div>
          </Card>
              </div>

              {/* User Activity Card */}
              <div className="absolute bottom-20 right-4 animate-float">
                <Card className="glass-card card-shadow rounded-2xl p-4 w-52">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sandro Tavares</p>
                      <p className="text-xs text-gray-500">Premium User</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Spending Analytics</p>
                  {/* Bar chart */}
                  <div className="flex items-end gap-1 h-16">
                    {[30, 50, 45, 70, 40, 85, 60].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Mon</span>
                    <span>Sun</span>
                  </div>
          </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="relative z-10 border-t border-green-900/30 bg-[#0D2818]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-gray-400 text-sm">Trusted by thousands of<br className="md:hidden" /> users worldwide</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {['WhatsApp', 'Amazon', 'Google', 'Instagram', 'Telegram', 'Twitter'].map((brand) => (
                  <span key={brand} className="text-gray-500 font-semibold text-lg opacity-60 hover:opacity-100 transition-opacity">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-700 text-sm font-medium mb-4">
              <Layers className="w-4 h-4" />
              Modular Solutions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              All in one digital platform<br />
              you&apos;ve been looking for
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access a complete suite of digital services designed to meet all your online needs in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* OTP Service */}
            <Card className="group border-2 border-transparent hover:border-green-200 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">OTP Verification</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Get virtual phone numbers from 150+ countries for instant OTP verification on any platform.
                </p>
                <div className="flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            {/* eSIM Service */}
            <Card className="group border-2 border-transparent hover:border-blue-200 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Signal className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">eSIM Plans</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Instant eSIM activation for global travel. Stay connected with affordable data plans worldwide.
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            {/* Social Media Accounts */}
            <Card className="group border-2 border-transparent hover:border-purple-200 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Social Media Logs</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Premium verified social media accounts ready for use. Aged accounts with clean history.
                </p>
                <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            {/* Account Boosting */}
            <Card className="group border-2 border-transparent hover:border-orange-200 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Account Boosting</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Boost your social media presence with real followers, likes, and engagement services.
                </p>
                <div className="flex items-center text-orange-600 font-medium group-hover:translate-x-2 transition-transform">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full text-green-700 text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Built for growth
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Take your business farther, faster
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform provides simple yet powerful solutions that are easy to use
                and scale with your needs. Get started in minutes.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Secure & Private</h3>
                    <p className="text-sm text-gray-600">End-to-end encryption for all transactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Global Access</h3>
                    <p className="text-sm text-gray-600">Services available in 150+ countries</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Instant Delivery</h3>
                    <p className="text-sm text-gray-600">Get your services within seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Easy Payments</h3>
                    <p className="text-sm text-gray-600">Pay securely in Naira with Paystack</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="relative">
              <div className="grid gap-6">
                {/* Invoice Card */}
                <Card className="card-shadow rounded-2xl p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Recent Transaction</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₦14,478.00</p>
                      <p className="text-sm text-gray-500">OTP Purchase - WhatsApp</p>
                    </div>
                    <Button className="bg-green-500 hover:bg-green-600 text-white rounded-lg">
                      View Receipt
                    </Button>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-6">
                  <Card className="card-shadow rounded-2xl p-5 bg-white">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">Pay with Card</p>
                    <p className="text-xs text-gray-500">Visa, Mastercard, Verve</p>
                  </Card>
                  <Card className="card-shadow rounded-2xl p-5 bg-white">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">Bank Transfer</p>
                    <p className="text-xs text-gray-500">Instant USSD & Transfer</p>
                  </Card>
                </div>

                <Card className="card-shadow rounded-2xl p-6 bg-gradient-to-r from-[#0D2818] to-[#1A4D2E] text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm mb-1">Premium Accounts Available</p>
                      <p className="text-xl font-bold">Instagram, Twitter, TikTok & More</p>
                    </div>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
                </h2>
            <p className="text-xl text-gray-600">
              Pay only for what you use. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* OTP Pricing */}
            <Card className="border-2 rounded-2xl hover:border-green-200 transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">OTP Numbers</h3>
                <p className="text-gray-600 mb-6">Virtual numbers for verification</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₦1,200</span>
                  <span className="text-gray-500">/number</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['150+ countries available', 'Instant SMS delivery', 'Auto-refund if no SMS', '24/7 availability'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />
                      {item}
                  </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-6">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* eSIM Pricing */}
            <Card className="border-2 border-green-500 rounded-2xl shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Signal className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">eSIM Plans</h3>
                <p className="text-gray-600 mb-6">Global data connectivity</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₦5,000</span>
                  <span className="text-gray-500">/plan</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['100+ destinations', 'Instant activation', 'Multiple GB options', 'No physical SIM needed'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button className="w-full bg-[#0D2818] hover:bg-[#1A4D2E] text-white rounded-xl py-6">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Accounts */}
            <Card className="border-2 rounded-2xl hover:border-purple-200 transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
              </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Accounts</h3>
                <p className="text-gray-600 mb-6">Verified social media accounts</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">₦10,000</span>
                  <span className="text-gray-500">/account</span>
            </div>
                <ul className="space-y-3 mb-8">
                  {['Aged accounts', 'Clean history', 'Full access provided', 'Multiple platforms'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-6">
                    Get Started
                  </Button>
                </Link>
          </CardContent>
        </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What our users are saying
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Adebayo O.',
                role: 'Digital Entrepreneur',
                content: 'SwiftVault has been a game-changer for my business. The OTP verification service is fast and reliable. Highly recommend!',
                rating: 5
              },
              {
                name: 'Chioma E.',
                role: 'Social Media Manager',
                content: 'The account boosting services are legitimate and effective. My clients have seen real growth in engagement.',
                rating: 5
              },
              {
                name: 'Musa K.',
                role: 'Traveler & Remote Worker',
                content: 'The eSIM feature is perfect for my lifestyle. I can stay connected in any country without hunting for local SIMs.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
              </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
            </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
              </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our services
              </p>
            </div>

          <div className="space-y-4">
            {[
              {
                q: 'What services does SwiftVault offer?',
                a: 'SwiftVault provides a complete suite of digital services including OTP verification with virtual numbers from 150+ countries, eSIM plans for global connectivity, premium social media accounts, and account boosting services.'
              },
              {
                q: 'How does the OTP verification work?',
                a: 'Simply select your desired country and service, pay for a virtual number, and receive your OTP code instantly. If no SMS is received within the time limit, you get an automatic refund.'
              },
              {
                q: 'Are the social media accounts safe to use?',
                a: 'Yes, all our accounts are carefully verified and come with clean history. We provide full access credentials and support for account setup.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept payments through Paystack including debit/credit cards (Visa, Mastercard, Verve) and bank transfers. All transactions are in Nigerian Naira (₦).'
              },
              {
                q: 'How quickly can I activate an eSIM?',
                a: 'eSIM activation is instant. Once you purchase a plan, you receive a QR code that you can scan with your compatible device to activate immediately.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, for OTP services, if you don\'t receive an SMS within the allocated time, the cost is automatically refunded to your wallet. For other services, please contact our support team.'
              }
            ].map((faq, index) => (
              <Card key={index} className="border-2 rounded-xl hover:border-green-200 transition-all">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
          </CardContent>
        </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0D2818] via-[#1A4D2E] to-[#0D2818] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust SwiftVault for their digital service needs.
            Create your free account today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
              <Button size="lg" className="bg-white text-[#0D2818] hover:bg-gray-100 font-semibold rounded-full px-10 py-7 text-lg btn-glow cursor-pointer">
                Open Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-10 py-7 text-lg bg-transparent cursor-pointer">
                Contact Sales
            </Button>
          </Link>
          </div>
          <p className="text-gray-400 mt-6">No credit card required • Start in 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D2818] text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">SwiftVault</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-sm">
                Your all-in-one digital services platform. OTP verification, eSIM plans,
                social media accounts, and more. Trusted by thousands worldwide.
              </p>
              <div className="flex gap-3">
                {['f', '𝕏', 'in', 'ig'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-white/5 hover:bg-green-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-white font-bold text-sm">{social}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Services</h3>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">OTP Verification</li>
                <li className="hover:text-white transition-colors cursor-pointer">eSIM Plans</li>
                <li className="hover:text-white transition-colors cursor-pointer">Social Media Logs</li>
                <li className="hover:text-white transition-colors cursor-pointer">Account Boosting</li>
                <li className="hover:text-white transition-colors cursor-pointer">Echo Numbers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
                <li className="hover:text-white transition-colors cursor-pointer">Affiliate Program</li>
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm">
                &copy; 2025 SwiftVault. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                <span className="hover:text-white transition-colors cursor-pointer">Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
