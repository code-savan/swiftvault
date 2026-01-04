import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/app/lib/supabase/server'
import { verifyPayment } from '@/app/lib/paystack'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Verify Paystack signature
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle successful payment
    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data

      // Verify payment with Paystack
      const verification = await verifyPayment(reference)

      if (verification.data.status === 'success') {
        const supabase = await createAdminClient()
        const userId = metadata.user_id
        const amountInNaira = amount / 100

        // Update transaction status
        await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('paystack_reference', reference)

        if (metadata.type === 'topup') {
          // Credit wallet
          const { data: userData } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', userId)
            .single()

          const currentBalance = userData?.wallet_balance || 0
          const newBalance = currentBalance + amountInNaira

          await supabase
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('id', userId)
        }

        return NextResponse.json({ received: true })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
