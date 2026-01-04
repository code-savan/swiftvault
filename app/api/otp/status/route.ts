import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { getStatus, setStatus } from '@/app/lib/sms-activate'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const requestId = searchParams.get('id')

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID required' }, { status: 400 })
    }

    // Get OTP request
    const { data: otpRequest } = await supabase
      .from('otp_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', user.id)
      .single()

    if (!otpRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // If already received, return cached data
    if (otpRequest.status === 'received' && otpRequest.otp) {
      return NextResponse.json({
        id: otpRequest.id,
        status: 'received',
        otp: otpRequest.otp,
        phone_number: otpRequest.phone_number,
      })
    }

    // Check status with SMS-Activate
    if (otpRequest.provider_number_id) {
      const status = await getStatus(otpRequest.provider_number_id)

      if (status.status === 'RECEIVED' && status.code) {
        // Update database
        await supabase
          .from('otp_requests')
          .update({
            status: 'received',
            otp: status.code,
          })
          .eq('id', requestId)

        // Mark as completed with SMS-Activate
        await setStatus(otpRequest.provider_number_id, 'COMPLETED')

        return NextResponse.json({
          id: otpRequest.id,
          status: 'received',
          otp: status.code,
          phone_number: otpRequest.phone_number,
        })
      }

      // Check for timeout (5 minutes)
      const createdAt = new Date(otpRequest.created_at)
      const now = new Date()
      const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60)

      if (diffMinutes > 5) {
        await supabase
          .from('otp_requests')
          .update({ status: 'timeout' })
          .eq('id', requestId)

        await setStatus(otpRequest.provider_number_id, 'CANCELLED')

        return NextResponse.json({
          id: otpRequest.id,
          status: 'timeout',
          phone_number: otpRequest.phone_number,
        })
      }
    }

    return NextResponse.json({
      id: otpRequest.id,
      status: otpRequest.status,
      phone_number: otpRequest.phone_number,
    })
  } catch (error: any) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check status' },
      { status: 500 }
    )
  }
}
