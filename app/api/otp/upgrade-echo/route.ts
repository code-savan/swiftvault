import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { provisionTwilioNumber, getEchoCost } from '@/app/lib/twilio'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { country } = body

    // Calculate cost
    const monthlyCost = getEchoCost(country)

    // Check wallet balance
    const { data: userData } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single()

    const balance = userData?.wallet_balance || 0

    if (balance < monthlyCost) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 })
    }

    // Provision Twilio number
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/webhook`
    const twilioNumber = await provisionTwilioNumber({
      country,
      smsUrl: webhookUrl,
    })

    // Deduct from wallet
    const newBalance = balance - monthlyCost
    await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', user.id)

    // Create Echo number record
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30) // 30 days from now

    const { data: echoNumber } = await supabase
      .from('echo_numbers')
      .insert({
        user_id: user.id,
        twilio_sid: twilioNumber.sid,
        phone_number: twilioNumber.phoneNumber,
        country,
        expiry_date: expiryDate.toISOString(),
        active: true,
        monthly_cost: monthlyCost,
      })
      .select()
      .single()

    // Create transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        amount: -monthlyCost,
        type: 'purchase',
        description: `Echo number: ${twilioNumber.phoneNumber}`,
        status: 'completed',
      })

    return NextResponse.json({
      success: true,
      number: echoNumber,
    })
  } catch (error: any) {
    console.error('Echo upgrade error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upgrade to Echo' },
      { status: 500 }
    )
  }
}
