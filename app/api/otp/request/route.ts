import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { getNumber } from '@/app/lib/sms-activate'
import { validateReferralCode, applyReferralCommission } from '@/app/actions/referral'
import { deductWallet } from '@/app/actions/wallet'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { country, service, price, serviceName, countryName, referralCode } = body

    if (!country || !service || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate price with discount
    let basePrice = price
    let discount = 0
    let referralData = null

    if (referralCode) {
      referralData = await validateReferralCode(referralCode)
      if (referralData.valid) {
        discount = (basePrice * referralData.discount_percent) / 100
      }
    }

    const finalPrice = basePrice - discount

    // Check wallet balance
    const { data: userData } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single()

    const balance = userData?.wallet_balance || 0

    if (balance < finalPrice) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 })
    }

    // Request number from SMS-Activate
    const numberData = await getNumber(country, service)

    // Deduct from wallet
    await deductWallet(
      user.id,
      finalPrice,
      `${serviceName || service} OTP - ${countryName || country}`,
      referralData?.referral_code_id
    )

    // Create OTP request record
    const { data: otpRequest } = await supabase
      .from('otp_requests')
      .insert({
        user_id: user.id,
        country_code: country,
        service,
        provider_number_id: numberData.activationId,
        phone_number: numberData.phoneNumber,
        status: 'pending',
        amount_paid: finalPrice,
        referral_code_id: referralData?.referral_code_id,
      })
      .select()
      .single()

    // Apply referral commission if applicable
    if (referralData?.valid && referralData.influencer_id) {
      const commission = (finalPrice * referralData.commission_percent) / 100
      await applyReferralCommission(
        referralData.influencer_id,
        commission,
        referralData.referral_code_id
      )
    }

    return NextResponse.json({
      success: true,
      request: otpRequest,
    })
  } catch (error: any) {
    console.error('OTP request error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to request OTP number' },
      { status: 500 }
    )
  }
}
