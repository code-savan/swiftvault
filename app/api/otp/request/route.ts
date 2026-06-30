import { NextRequest, NextResponse } from 'next/server'
import { currentUserId } from '@/app/lib/clerk/server'
import { createDataClient } from '@/app/lib/supabase/data'
import { getNumber, getFormattedServices } from '@/app/lib/sms-activate'

export async function POST(request: NextRequest) {
  try {
    const userId = await currentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createDataClient()
    const body = await request.json()
    const { country, service, serviceName, countryName, referralCode } = body

    if (!country || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Server-side price recalculation — never trust client price
    const formattedServices = await getFormattedServices(country)
    const matched = formattedServices.find((s) => s.code === service)
    if (!matched) {
      return NextResponse.json({ error: 'Invalid service for this country' }, { status: 400 })
    }
    let basePrice = matched.price
    let discount = 0
    let referralData: any = null

    if (referralCode) {
      const { data: refCode } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', referralCode.toUpperCase())
        .eq('active', true)
        .single()

      if (refCode) {
        referralData = refCode
        discount = Math.round((basePrice * refCode.discount_percent) / 100)
        basePrice = basePrice - discount
      }
    }

    const result = await getNumber(country, service)

    if (!result.phoneNumber) {
      return NextResponse.json({ error: 'Failed to get number' }, { status: 500 })
    }

    // Atomic wallet deduction + transaction insert
    const { data: walletResult } = await supabase.rpc('deduct_wallet', {
      p_user_id: userId,
      p_amount: basePrice,
      p_description: `${serviceName || service} OTP - ${countryName || country} (${result.phoneNumber})`,
      p_referral_code_id: referralData?.id || null,
    })

    const walletData = walletResult as unknown as { success: boolean; error?: string }
    if (!walletData?.success) {
      return NextResponse.json({ error: walletData?.error || 'Payment failed' }, { status: 400 })
    }

    const { data: otpRequest } = await supabase
      .from('otp_requests')
      .insert({
        user_id: userId,
        country_code: country,
        service,
        phone_number: result.phoneNumber,
        provider_number_id: result.activationId.toString(),
        status: 'pending',
        amount_paid: basePrice,
        referral_code_id: referralData?.id || null,
      })
      .select()
      .single()

    // Referral commission via atomic RPC
    if (referralData && otpRequest) {
      const commission = Math.round((basePrice * referralData.commission_percent) / 100)
      await supabase.rpc('transfer_commission', {
        p_influencer_id: referralData.influencer_id,
        p_amount: commission,
        p_referral_code_id: referralData.id,
        p_description: `Commission from ${serviceName || service} OTP`,
      })
    }

    return NextResponse.json({
      success: true,
      id: otpRequest?.id,
      phoneNumber: result.phoneNumber,
      amountCharged: basePrice,
      discount,
    })
  } catch (error: any) {
    console.error('OTP request error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
