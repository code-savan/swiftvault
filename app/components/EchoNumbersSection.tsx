'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { formatDate, formatCurrency } from '@/app/lib/utils'
import { Phone, MessageSquare } from 'lucide-react'

interface EchoNumber {
  id: string
  phone_number: string
  country: string
  expiry_date: string
  active: boolean
  monthly_cost: number
  messages?: Array<{
    id: string
    from_number: string
    message_body: string
    received_at: string
  }>
}

interface EchoNumbersSectionProps {
  echoNumbers: EchoNumber[]
  onRenew: (numberId: string) => void
}

export function EchoNumbersSection({ echoNumbers, onRenew }: EchoNumbersSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (echoNumbers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Echo Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No Echo numbers yet</p>
            <p className="text-sm mt-1">
              Upgrade from a one-time OTP to get a persistent number with SMS forwarding
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Echo Numbers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {echoNumbers.map((number) => {
          const isExpired = new Date(number.expiry_date) < new Date()
          const isExpiring = !isExpired && new Date(number.expiry_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          const isExpanded = expandedId === number.id

          return (
            <div key={number.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-semibold text-lg">
                      {number.phone_number}
                    </span>
                    <Badge variant={isExpired ? 'destructive' : number.active ? 'success' : 'secondary'}>
                      {isExpired ? 'Expired' : number.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Country: {number.country}</div>
                    <div className={isExpiring ? 'text-yellow-600 font-medium' : ''}>
                      Expires: {formatDate(number.expiry_date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-2">
                    {formatCurrency(number.monthly_cost)}/month
                  </div>
                  {(isExpired || isExpiring) && (
                    <Button
                      size="sm"
                      onClick={() => onRenew(number.id)}
                    >
                      Renew
                    </Button>
                  )}
                </div>
              </div>

              {number.messages && number.messages.length > 0 && (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : number.id)}
                    className="text-green-600"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {number.messages.length} message(s)
                  </Button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                      {number.messages.map((msg) => (
                        <div key={msg.id} className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">From: {msg.from_number}</span>
                            <span className="text-gray-500 text-xs">
                              {formatDate(msg.received_at)}
                            </span>
                          </div>
                          <p className="text-gray-700">{msg.message_body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
