import { NextResponse } from 'next/server'
import { getFormattedCountries } from '@/app/lib/sms-activate'

export async function GET() {
  try {
    const countries = await getFormattedCountries()

    return NextResponse.json({
      success: true,
      countries,
    })
  } catch (error: any) {
    console.error('Countries API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch countries',
        countries: []
      },
      { status: 500 }
    )
  }
}

// Cache for 1 hour
export const revalidate = 3600
