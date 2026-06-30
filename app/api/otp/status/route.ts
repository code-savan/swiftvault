import { NextRequest, NextResponse } from 'next/server'
import { currentUserId } from '@/app/lib/clerk/server'
import { createDataClient } from '@/app/lib/supabase/data'
import { getStatus, setStatus } from '@/app/lib/sms-activate'

export async function GET(request: NextRequest) {
  try {
    const userId = await currentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createDataClient()
    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get('id')

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
    }

    const { data: otpRequest } = await supabase
      .from('otp_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', userId)
      .single()

    if (!otpRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    if (otpRequest.otp) {
      return NextResponse.json({
        status: 'received',
        otp: otpRequest.otp,
        phoneNumber: otpRequest.phone_number,
      })
    }

    const smsStatus = await getStatus(otpRequest.provider_number_id!) as any

    if (smsStatus.status === 'success' && smsStatus.otp) {
      await supabase
        .from('otp_requests')
        .update({ status: 'received', otp: smsStatus.otp })
        .eq('id', requestId)

      return NextResponse.json({
        status: 'received',
        otp: smsStatus.otp,
        phoneNumber: otpRequest.phone_number,
      })
    }

    if (smsStatus.status === 'canceled' || smsStatus.status === 'expired') {
      await supabase
        .from('otp_requests')
        .update({ status: 'failed' })
        .eq('id', requestId)

      await setStatus(otpRequest.provider_number_id!, 'cancel' as any)

      return NextResponse.json({ status: 'failed' })
    }

    return NextResponse.json({ status: 'pending' })
  } catch (error: any) {
    console.error('OTP status error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
