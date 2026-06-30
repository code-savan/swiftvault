import { NextResponse } from 'next/server'
import { syncAllPendingOrders } from '@/app/actions/boosting'

export async function GET() {
  try {
    const result = await syncAllPendingOrders()
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
