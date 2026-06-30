'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { getDataClient } from '@/app/lib/clerk/server'

/**
 * Ensures a user row exists in Supabase for the currently authenticated Clerk user.
 *
 * Strategy:
 *  1. Fetch the user's email from Clerk (required — schema's `email` is NOT NULL).
 *  2. Idempotent upsert with the email so the row is always valid.
 *
 * Safe to call concurrently (e.g. Clerk webhook + first dashboard load) because
 * the upsert deduplicates on the primary key.
 *
 * Returns the user row, or throws if unauthenticated / unrecoverable.
 */
export async function getOrCreateUser() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Fetch email from Clerk. Fall back to a deterministic placeholder only if Clerk
  // has no primary email (e.g. OAuth-only accounts without a verified email).
  // We MUST provide an email because `public.users.email` is NOT NULL.
  let email: string | null = null
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses?.[0]?.emailAddress ??
      null
  } catch (error) {
    console.error('Failed to fetch user from Clerk:', error)
  }

  if (!email) {
    // Last-resort fallback so we never violate the NOT NULL constraint.
    // The Clerk webhook / next dashboard load will overwrite this once an email exists.
    email = `${userId}@no-email.clerk.dev`
  }

  const supabase = getDataClient()

  // Idempotent upsert: insert if missing, update email if exists.
  // `onConflict: 'id'` makes this safe under the webhook race.
  const { data, error } = await supabase
    .from('users')
    .upsert(
      { id: userId, email, wallet_balance: 0 },
      { onConflict: 'id' },
    )
    .select()
    .single()

  if (error) {
    // The upsert failed for a reason other than a race (e.g. RLS, connection).
    // Try a plain select as a final fallback in case another process inserted it.
    console.error('getOrCreateUser upsert failed:', JSON.stringify(error))
    const { data: existing, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (selectError || !existing) {
      console.error('getOrCreateUser fallback select failed:', JSON.stringify(selectError))
      throw new Error('Failed to create or load user record')
    }

    return existing
  }

  return data
}

/**
 * Sync the user's email from Clerk into Supabase.
 * Safe to call on every dashboard load as a lightweight consistency check.
 */
export async function syncUserEmail(email?: string | null) {
  const { userId } = await auth()
  if (!userId || !email) return null

  const supabase = getDataClient()

  const { data, error } = await supabase
    .from('users')
    .update({ email })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Failed to sync user email:', JSON.stringify(error))
  }

  return data
}

/**
 * Complete the onboarding profile.
 * Saves full_name, phone_number, auto-generates a unique username.
 */
export async function completeOnboarding(data: {
  full_name: string
  phone_number: string
  referral_code?: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = getDataClient()

  const firstName = data.full_name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '')

  // Find a unique username
  let username = firstName
  let suffix = 1
  while (true) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (!existing) break
    suffix++
    username = `${firstName}${suffix}`
  }

  const updateData: Record<string, any> = {
    full_name: data.full_name.trim(),
    phone_number: data.phone_number.trim(),
    username,
  }

  // Handle referral code
  if (data.referral_code) {
    const { data: refCode } = await supabase
      .from('referral_codes')
      .select('influencer_id')
      .eq('code', data.referral_code.toUpperCase())
      .eq('active', true)
      .single()

    if (refCode) {
      updateData.referred_by = refCode.influencer_id
    }
  }

  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    console.error('completeOnboarding failed:', JSON.stringify(error))
    throw new Error('Failed to save profile')
  }

  return { username }
}
