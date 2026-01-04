'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Select } from './ui/select'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { toast } from 'sonner'
import { Copy, RefreshCw, Loader2 } from 'lucide-react'

interface CountryOption {
  code: string
  name: string
}

interface ServiceOption {
  code: string
  name: string
  price: number
  available: boolean
}

interface BuyOTPSectionProps {
  walletBalance: number
  referralDiscount: number
  onPurchaseSuccess: () => void
}

export function BuyOTPSection({ walletBalance, referralDiscount, onPurchaseSuccess }: BuyOTPSectionProps) {
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [services, setServices] = useState<ServiceOption[]>([])
  const [country, setCountry] = useState('')
  const [service, setService] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingServices, setLoadingServices] = useState(false)
  const [activeRequest, setActiveRequest] = useState<any>(null)
  const [polling, setPolling] = useState(false)

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries()
  }, [])

  // Fetch services when country changes
  useEffect(() => {
    if (country) {
      fetchServices(country)
    }
  }, [country])

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true)
      const response = await fetch('/api/sms-activate/countries')
      const data = await response.json()

      if (data.success && data.countries.length > 0) {
        setCountries(data.countries)
        setCountry(data.countries[0].code)
      } else {
        toast.error('Failed to load countries')
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error)
      toast.error('Failed to load countries')
    } finally {
      setLoadingCountries(false)
    }
  }

  const fetchServices = async (countryCode: string) => {
    try {
      setLoadingServices(true)
      setService('')
      const response = await fetch(`/api/sms-activate/services?country=${countryCode}`)
      const data = await response.json()

      if (data.success && data.services.length > 0) {
        setServices(data.services)
        // Auto-select first available service
        const firstAvailable = data.services.find((s: ServiceOption) => s.available)
        if (firstAvailable) {
          setService(firstAvailable.code)
        }
      } else {
        toast.error('No services available for this country')
        setServices([])
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
      toast.error('Failed to load services')
      setServices([])
    } finally {
      setLoadingServices(false)
    }
  }

  const selectedService = services.find(s => s.code === service)
  const basePrice = selectedService?.price || 0
  const discount = (basePrice * referralDiscount) / 100
  const finalPrice = basePrice - discount

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (activeRequest && activeRequest.status === 'pending') {
      setPolling(true)
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/otp/status?id=${activeRequest.id}`)
          const data = await response.json()

          if (data.status === 'received' && data.otp) {
            setActiveRequest(data)
            setPolling(false)
            toast.success('OTP received!')
            clearInterval(interval)
          } else if (data.status === 'failed' || data.status === 'timeout') {
            setActiveRequest(null)
            setPolling(false)
            toast.error('Failed to receive OTP')
            clearInterval(interval)
          }
        } catch (error) {
          console.error('Polling error:', error)
        }
      }, 10000) // Poll every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeRequest])

  const handleBuyOTP = async () => {
    if (!selectedService) {
      toast.error('Please select a service')
      return
    }

    if (!selectedService.available) {
      toast.error('This service is currently unavailable')
      return
    }

    if (walletBalance < finalPrice) {
      toast.error('Insufficient wallet balance')
      return
    }

    setLoading(true)
    try {
      const selectedCountry = countries.find(c => c.code === country)

      const response = await fetch('/api/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          service,
          price: basePrice,
          serviceName: selectedService.name,
          countryName: selectedCountry?.name,
          referralDiscount,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setActiveRequest(data.request)
        onPurchaseSuccess()
        toast.success('Number purchased! Waiting for OTP...')
      } else {
        toast.error(data.error || 'Failed to purchase number')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy One-Time OTP Number</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!activeRequest ? (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              {loadingCountries ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                </div>
              ) : (
                <Select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={loadingCountries}
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Service</label>
              {loadingServices ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                </div>
              ) : services.length === 0 ? (
                <div className="text-sm text-gray-500 py-3 text-center">
                  No services available for this country
                </div>
              ) : (
                <Select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  disabled={loadingServices || services.length === 0}
                >
                  {services.map((s) => (
                    <option key={s.code} value={s.code} disabled={!s.available}>
                      {s.name} - ₦{s.price.toLocaleString()} {!s.available && '(Unavailable)'}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Price:</span>
                <span className="font-medium">₦{basePrice.toLocaleString()}</span>
              </div>
              {referralDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({referralDiscount}%):</span>
                  <span>-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total:</span>
                <span>₦{finalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={handleBuyOTP}
              disabled={loading || walletBalance < finalPrice || !service || loadingServices || !selectedService?.available}
              className="w-full"
            >
              {loading ? 'Processing...' : !selectedService?.available ? 'Service Unavailable' : 'Buy Number'}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Phone Number</span>
                <Badge variant="success">
                  {activeRequest.status === 'pending' ? 'Waiting...' : 'Received'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-mono font-bold text-green-900">
                  {activeRequest.phone_number}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(activeRequest.phone_number)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {activeRequest.otp ? (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">OTP Code</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-blue-900">
                    {activeRequest.otp}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(activeRequest.otp)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                <span>Waiting for OTP...</span>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setActiveRequest(null)}
            >
              Buy Another Number
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
