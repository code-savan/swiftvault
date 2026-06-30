import { NextRequest, NextResponse } from 'next/server'
import { currentUserId } from '@/app/lib/clerk/server'
import { createDataClient } from '@/app/lib/supabase/data'
import { provisionTwilioNumber, getEchoCost } from '@/app/lib/twilio'

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createDataClient()
    const body = await request.json()
    const { country } = body

    const monthlyCost = getEchoCost(country)

    const { data: userData } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()

    const balance = userData?.wallet_balance || 0

    if (balance < monthlyCost) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 })
    }

    const twilioResult = await provisionTwilioNumber(country) as any

    if (!twilioResult.success) {
      return NextResponse.json({ error: twilioResult.error || 'Failed to provision number' }, { status: 500 })
    }

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)

    const { data: echoNumber } = await supabase
      .from('echo_numbers')
      .insert({
        user_id: userId,
        twilio_sid: twilioResult.sid!,
        phone_number: twilioResult.phoneNumber!,
        country,
        expiry_date: expiryDate.toISOString(),
        active: true,
        monthly_cost: monthlyCost,
      })
      .select()
      .single()

    const newBalance = balance - monthlyCost
    await supabase
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId)

    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: -monthlyCost,
        type: 'purchase',
        description: `Echo number: ${twilioResult.phoneNumber}`,
        status: 'completed',
      })

    return NextResponse.json({
      success: true,
      number: echoNumber,
    })
  } catch (error: any) {
    console.error('Echo number provision error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
