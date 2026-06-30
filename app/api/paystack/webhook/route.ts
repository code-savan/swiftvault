import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const expectedSignature = crypto
    .createHmac('sha512', secret)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === 'charge.success') {
    const data = event.data
    const meta = data.metadata || {}
    const reference = data.reference

    // Check if already processed
    const { data: existing } = await supabase
      .from('boosting_orders')
      .select('id')
      .eq('sizzle_order_id', reference)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ status: 'already_processed' })
    }

    const userId = meta.userId as string
    const serviceId = meta.serviceId as string
    const link = meta.link as string
    const quantity = meta.quantity as number
    const charge = meta.charge as number
    const serviceName = meta.serviceName as string

    const SIZZLE_API_KEY = process.env.SIZZLE_API_KEY!
    const SIZZLE_API_URL = process.env.SIZZLE_API_URL!

    const sizzleBody = new URLSearchParams({
      key: SIZZLE_API_KEY,
      action: 'add',
      service: serviceId,
      link,
      quantity: String(quantity),
    })

    try {
      const sizzleRes = await fetch(SIZZLE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: sizzleBody.toString(),
      })

      const sizzleResult = await sizzleRes.json()

      if (sizzleRes.ok && (sizzleResult.status === 'success' || sizzleResult.order)) {
        await supabase.from('boosting_orders').insert({
          user_id: userId,
          service_id: serviceId,
          service_name: serviceName,
          link,
          quantity,
          charge,
          status: 'pending',
          sizzle_order_id: sizzleResult.order?.toString() || reference,
        })
      } else {
        await supabase.from('boosting_orders').insert({
          user_id: userId,
          service_id: serviceId,
          service_name: serviceName,
          link,
          quantity,
          charge,
          status: 'payment_received',
          sizzle_order_id: reference,
        })
      }
    } catch {
      await supabase.from('boosting_orders').insert({
        user_id: userId,
        service_id: serviceId,
        service_name: serviceName,
        link,
        quantity,
        charge,
        status: 'payment_received',
        sizzle_order_id: reference,
      })
    }
  }

  return NextResponse.json({ status: 'ok' })
}
