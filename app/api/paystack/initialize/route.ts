import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { initializeTransaction } from '@/app/lib/paystack'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { serviceId, link, quantity, serviceName, category } =
    await request.json()

  if (!serviceId || !link || !quantity) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch service from DB — never trust client rate/markupRate
  const { data: service, error: svcError } = await supabase
    .from('boosting_services')
    .select('rate, markup_rate')
    .eq('id', serviceId)
    .single()

  if (svcError || !service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 400 })
  }

  const charge = Math.ceil((service.rate * quantity) / 1000 * service.markup_rate * 100) / 100

  // Get user email
  const { data: user } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single()

  if (!user?.email) {
    return NextResponse.json({ error: 'User email not found' }, { status: 400 })
  }

  try {
    const result = await initializeTransaction({
      email: user.email,
      amount: Math.round(charge * 100),
      metadata: {
        userId,
        serviceId,
        link,
        quantity,
        charge,
        serviceName,
        category,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Paystack initialize failed:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
