'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'sonner'
import { X, Wallet, ArrowUpRight, ChevronRight, Banknote, CreditCard, Zap, Check } from 'lucide-react'

interface FundWalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userEmail: string
  balance?: number
}

const PRESET_AMOUNTS = [
  { value: 5000, bonus: 0, label: '₦5,000' },
  { value: 10000, bonus: 250, label: '₦10,000', bonusLabel: '+₦250' },
  { value: 20000, bonus: 750, label: '₦20,000', bonusLabel: '+₦750' },
  { value: 50000, bonus: 2500, label: '₦50,000', bonusLabel: '+₦2,500' },
  { value: 100000, bonus: 6000, label: '₦100,000', bonusLabel: '+₦6,000' },
]

export function FundWalletModal({ open, onOpenChange, userEmail, balance }: FundWalletModalProps) {
  const [amount, setAmount] = useState<number>(10000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'amount' | 'confirm' | 'success'>('amount')

  const selectedPreset = PRESET_AMOUNTS.find(p => p.value === amount)
  const bonus = selectedPreset?.bonus || 0
  const fee = Math.round(amount * 0.015)
  const total = amount + fee

  const handleFundWallet = async () => {
    if (amount < 1000) {
      toast.error('Minimum amount is ₦1,000')
      return
    }

    setLoading(true)
    try {
      if (paymentMethod === 'card') {
        const response = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, email: userEmail, type: 'topup' }),
        })

        const data = await response.json()

        if (data.success && data.authorization_url) {
          window.location.href = data.authorization_url
        } else {
          toast.error(data.error || 'Failed to initialize payment')
        }
      } else {
        setStep('success')
        toast.success('Bank transfer details generated')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAmountSelect = (val: number) => {
    setAmount(val)
    setCustomAmount('')
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomAmount(val)
    if (val) {
      const num = parseInt(val)
      if (!isNaN(num)) setAmount(num)
    }
  }

  const resetModal = () => {
    setStep('amount')
    setLoading(false)
    onOpenChange(false)
  }

  return (
    <>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={resetModal} />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white border-l border-[var(--color-border)] z-50 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              {step === 'success' ? 'Deposit Instructions' : step === 'confirm' ? 'Confirm Deposit' : 'Add Funds'}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {step === 'success'
                ? 'Complete your deposit via bank transfer'
                : step === 'confirm'
                ? 'Review your deposit details'
                : 'Choose an amount to add to your wallet'
              }
            </p>
          </div>
          <button onClick={resetModal} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]">
            <X className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6">
          {step === 'success' ? (
            <div className="text-center pt-8">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-accent-light)] flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Deposit Instructions</h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">
                Transfer the amount below to complete your deposit
              </p>

              <div className="bg-[var(--color-bg)] border border-[var(--color-border)] p-5 mb-6 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--color-text-muted)]">Amount</span>
                  <span className="text-lg font-bold text-[var(--color-text-primary)]">₦{amount.toLocaleString()}</span>
                </div>
                <div className="border-t border-[var(--color-border)] pt-3">
                  <span className="text-sm text-[var(--color-text-muted)]">Bank</span>
                  <p className="font-semibold text-[var(--color-text-primary)]">SwiftVult Finance Bank</p>
                </div>
                <div>
                  <span className="text-sm text-[var(--color-text-muted)]">Account Number</span>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-mono font-bold text-[var(--color-text-primary)] tracking-wider">0123456789</p>
                    <button
                      onClick={() => { navigator.clipboard.writeText('0123456789'); toast.success('Copied') }}
                      className="text-xs text-[var(--color-accent)] font-medium hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-[var(--color-text-muted)]">Reference</span>
                  <p className="font-mono text-sm text-[var(--color-text-primary)]">SV-{Date.now().toString(36).toUpperCase()}</p>
                </div>
              </div>

              <Button onClick={() => resetModal()} className="w-full">
                Done
              </Button>
            </div>
          ) : step === 'amount' ? (
            <>
              {/* Balance */}
              {balance !== undefined && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] mb-5">
                  <Wallet className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <span className="text-xs text-[var(--color-text-muted)]">Current balance:</span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">₦{balance.toLocaleString()}</span>
                </div>
              )}

              {/* Preset amounts */}
              <div className="mb-4">
                <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2.5 block">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {PRESET_AMOUNTS.map((preset) => {
                    const isSelected = amount === preset.value && !customAmount
                    return (
                        <button
                          key={preset.value}
                          onClick={() => handleAmountSelect(preset.value)}
                          className={`
                            relative flex flex-col items-center py-3.5 px-3 rounded-lg border-2 transition-all duration-150
                            ${isSelected
                            ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                            : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-muted)]'
                          }
                        `}
                      >
                        <span className={`text-sm font-bold ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
                          {preset.label}
                        </span>
                        {preset.bonusLabel && (
                          <span className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent)]'}`}>
                            {preset.bonusLabel} bonus
                          </span>
                        )}
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom amount */}
              <div className="mb-5">
                <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">
                  Or Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--color-text-muted)]">₦</span>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Enter amount (min ₦1,000)"
                    min={1000}
                    className="pl-8 h-11"
                  />
                </div>
              </div>

              {/* Payment method */}
              <div className="mb-5">
                <label className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2.5 block">
                  Payment Method
                </label>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 flex items-center gap-2.5 py-3 px-4 rounded-lg border-2 transition-all duration-150 ${
                      paymentMethod === 'card'
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                    }`}
                  >
                    <CreditCard className={`w-4 h-4 ${paymentMethod === 'card' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>Card</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">Instant deposit</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('transfer')}
                          className={`flex-1 flex items-center gap-2.5 py-3 px-4 rounded-lg border-2 transition-all duration-150 ${
                      paymentMethod === 'transfer'
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent-light)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                    }`}
                  >
                    <Banknote className={`w-4 h-4 ${paymentMethod === 'transfer' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`} />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${paymentMethod === 'transfer' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>Transfer</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">1-5 mins</p>
                    </div>
                  </button>
                </div>
              </div>

              <Button
                onClick={() => setStep('confirm')}
                disabled={amount < 1000}
                className="w-full h-11"
              >
                {paymentMethod === 'card' ? 'Continue to Payment' : 'Generate Transfer Details'}
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </>
          ) : (
            /* Confirm step */
            <>
              <div className="bg-[var(--color-bg)] border border-[var(--color-border)] p-4 space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Amount</span>
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">₦{amount.toLocaleString()}</span>
                </div>
                {bonus > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-muted)]">Bonus</span>
                    <span className="text-sm font-semibold text-[var(--color-accent)]">+₦{bonus.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">Processing Fee (1.5%)</span>
                  <span className="text-sm text-[var(--color-text-muted)]">₦{fee.toLocaleString()}</span>
                </div>
                <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">You'll be charged</span>
                  <span className="text-lg font-bold text-[var(--color-text-primary)]">₦{total.toLocaleString()}</span>
                </div>
                <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">You'll receive</span>
                  <span className="text-lg font-bold text-[var(--color-accent)]">₦{(amount + bonus).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('amount')} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleFundWallet} disabled={loading} className="flex-1">
                  {loading ? (
                    <span>Processing...</span>
                  ) : paymentMethod === 'card' ? (
                    <>Pay with Card</>
                  ) : (
                    <>Generate Account</>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )}
</>
)
}
