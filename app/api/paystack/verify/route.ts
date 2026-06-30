import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { verifyTransaction } from '@/app/lib/paystack'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { reference } = await request.json()

  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
  }

  try {
    const verification = await verifyTransaction(reference)

    if (!verification.verified) {
      return NextResponse.json(
        { verified: false, error: 'Payment not verified' },
        { status: 400 }
      )
    }

    const meta = verification.metadata as Record<string, unknown> | undefined
    const orderUserId = meta?.userId as string | undefined

    if (orderUserId !== userId) {
      return NextResponse.json({ error: 'User mismatch' }, { status: 403 })
    }

    const serviceId = meta?.serviceId as string
    const link = meta?.link as string
    const quantity = meta?.quantity as number
    const charge = meta?.charge as number
    const serviceName = meta?.serviceName as string
    const category = meta?.category as string

    // Place order with Sizzle
    const SIZZLE_API_KEY = process.env.SIZZLE_API_KEY!
    const SIZZLE_API_URL = process.env.SIZZLE_API_URL!

    const sizzleBody = new URLSearchParams({
      key: SIZZLE_API_KEY,
      action: 'add',
      service: serviceId,
      link,
      quantity: String(quantity),
    })

    const sizzleResponse = await fetch(SIZZLE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: sizzleBody.toString(),
    })

    const sizzleResult = await sizzleResponse.json()

    if (!sizzleResponse.ok || (sizzleResult.status !== 'success' && !sizzleResult.order)) {
      // Payment succeeded but Sizzle failed — store as pending for manual resolution
      await supabase.from('boosting_orders').insert({
        user_id: userId,
        service_id: serviceId,
        service_name: serviceName,
        link,
        quantity,
        charge,
        status: 'payment_received',
        sizzle_order_id: null,
      })

      return NextResponse.json({
        verified: true,
        orderStatus: 'payment_received',
        message: 'Payment received. Order will be processed shortly.',
      })
    }

    const sizzleOrderId = sizzleResult.order.toString()

    // Store the order
    await supabase.from('boosting_orders').insert({
      user_id: userId,
      service_id: serviceId,
      service_name: serviceName,
      link,
      quantity,
      charge,
      status: 'pending',
      sizzle_order_id: sizzleOrderId,
    })

    return NextResponse.json({
      verified: true,
      orderStatus: 'pending',
      sizzleOrderId,
    })
  } catch (error) {
    console.error('Paystack verify failed:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
