'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'sonner'

interface FundWalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
}

const PRESET_AMOUNTS = [5000, 10000, 20000, 50000]

export function FundWalletModal({ open, onOpenChange, userEmail }: FundWalletModalProps) {
  const [amount, setAmount] = useState<number>(10000)
  const [loading, setLoading] = useState(false)

  const handleFundWallet = async () => {
    if (amount < 1000) {
      toast.error('Minimum amount is ₦1,000')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          email: userEmail,
          type: 'topup',
        }),
      })

      const data = await response.json()

      if (data.success && data.authorization_url) {
        window.location.href = data.authorization_url
      } else {
        toast.error(data.error || 'Failed to initialize payment')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fund Your Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {PRESET_AMOUNTS.map((preset) => (
              <Button
                key={preset}
                variant={amount === preset ? 'default' : 'outline'}
                onClick={() => setAmount(preset)}
              >
                ₦{preset.toLocaleString()}
              </Button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Custom Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
              min={1000}
            />
          </div>
          <Button
            onClick={handleFundWallet}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Processing...' : `Pay ₦${amount.toLocaleString()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
