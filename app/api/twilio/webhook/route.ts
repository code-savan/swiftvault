import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/app/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const from = formData.get('From') as string
    const to = formData.get('To') as string
    const body = formData.get('Body') as string

    if (!from || !to || !body) {
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Find Echo number
    const { data: echoNumber } = await supabase
      .from('echo_numbers')
      .select('*')
      .eq('phone_number', to)
      .eq('active', true)
      .single()

    if (!echoNumber) {
      return NextResponse.json({ error: 'Number not found' }, { status: 404 })
    }

    // Store message
    await supabase
      .from('echo_messages')
      .insert({
        echo_number_id: echoNumber.id,
        from_number: from,
        message_body: body,
      })

    // You could also send an email notification here
    // or trigger a realtime notification

    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        headers: {
          'Content-Type': 'text/xml',
        },
      }
    )
  } catch (error: any) {
    console.error('Twilio webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
