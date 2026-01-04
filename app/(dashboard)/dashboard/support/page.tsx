'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Sidebar } from '@/app/components/Sidebar'
import { logout } from '@/app/actions/auth'
import {
  Bell, Menu, MessageCircle, Mail, Phone, FileText,
  ChevronRight, ExternalLink, HelpCircle
} from 'lucide-react'

export default function SupportPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const faqItems = [
    { q: 'How do I fund my wallet?', a: 'Click the "Fund Wallet" button and follow the Paystack payment process.' },
    { q: 'What happens if I don\'t receive my OTP?', a: 'If no SMS is received within the time limit, your funds are automatically refunded.' },
    { q: 'How long do virtual numbers stay active?', a: 'OTP numbers stay active for 10-20 minutes. Echo numbers are active for 30 days.' },
    { q: 'Can I get a refund?', a: 'Yes, automatic refunds for failed OTP deliveries. Contact support for other issues.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={{ email: 'user@example.com' }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Support</h1>
                  <p className="text-xs text-gray-500">Get help when you need it</p>
                </div>
              </div>
              <button className="relative p-2.5 hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-4xl">
          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-xs text-gray-500 mb-4">Chat with our support team</p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <p className="text-xs text-gray-500 mb-4">We reply within 24 hours</p>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Documentation</h3>
                <p className="text-xs text-gray-500 mb-4">Read our guides & FAQs</p>
                <Button variant="outline" className="w-full">
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0 divide-y divide-gray-100">
                {faqItems.map((faq, idx) => (
                  <div key={idx} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HelpCircle className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{faq.q}</p>
                        <p className="text-xs text-gray-500">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Still need help?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Our support team is available 24/7 to assist you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>support@swiftvault.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>+234 800 000 0000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
