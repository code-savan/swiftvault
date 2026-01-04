import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { initializePayment } from '@/app/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, email, type, metadata } = body

    // Generate unique reference
    const reference = `${type}_${user.id}_${Date.now()}`

    // Create pending transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        amount,
        type: type === 'topup' ? 'topup' : 'purchase',
        description: type === 'topup' ? 'Wallet top-up' : metadata?.description || 'Purchase',
        status: 'pending',
        paystack_reference: reference,
      })

    // Initialize Paystack payment
    const response = await initializePayment({
      email,
      amount: amount * 100, // Convert to kobo
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      metadata: {
        user_id: user.id,
        type,
        ...metadata,
      },
    })

    return NextResponse.json({
      success: true,
      authorization_url: response.data.authorization_url,
      reference: response.data.reference,
    })
  } catch (error: any) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
