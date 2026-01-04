import { NextRequest, NextResponse } from 'next/server'
import { validateReferralCode } from '@/app/actions/referral'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    const result = await validateReferralCode(code)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Referral validation error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
