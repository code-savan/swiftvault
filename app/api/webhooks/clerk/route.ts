import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { createDataClient } from '@/app/lib/supabase/data'
import type { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const headers = Object.fromEntries(request.headers.entries())

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  let event: WebhookEvent

  try {
    event = wh.verify(payload, headers) as WebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  const supabase = createDataClient()

  switch (event.type) {
    case 'user.created': {
      const { id, email_addresses } = event.data
      const email = email_addresses?.[0]?.email_address
      if (!email) break

      // Idempotent upsert — if the row already exists (race with getOrCreateUser),
      // ignoreDuplicates means we silently succeed instead of 500-ing.
      const { error } = await supabase
        .from('users')
        .upsert(
          { id, email },
          { onConflict: 'id', ignoreDuplicates: true },
        )

      if (error) {
        console.error('Failed to upsert user on user.created:', error)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
      break
    }

    case 'user.updated': {
      const { id, email_addresses } = event.data
      const email = email_addresses?.[0]?.email_address
      if (!email) break

      // If the user row doesn't exist yet (out-of-order delivery), create it.
      // Otherwise update the email. Upsert handles both cases.
      const { error } = await supabase
        .from('users')
        .upsert(
          { id, email },
          { onConflict: 'id' },
        )

      if (error) {
        console.error('Failed to upsert user on user.updated:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
      }
      break
    }

    case 'user.deleted': {
      const { id } = event.data

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Failed to delete user:', error)
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
      }
      break
    }
  }

  return NextResponse.json({ success: true })
}
