import { NextRequest, NextResponse } from 'next/server'
import { getFormattedServices } from '@/app/lib/sms-activate'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const country = searchParams.get('country')

    if (!country) {
      return NextResponse.json(
        { success: false, error: 'Country parameter required' },
        { status: 400 }
      )
    }

    const services = await getFormattedServices(country)

    return NextResponse.json({
      success: true,
      services,
    })
  } catch (error: any) {
    console.error('Services API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch services',
        services: []
      },
      { status: 500 }
    )
  }
}

// Cache for 30 minutes
export const revalidate = 1800
