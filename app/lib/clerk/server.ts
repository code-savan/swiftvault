import { auth, clerkClient } from '@clerk/nextjs/server'
import { createDataClient } from '@/app/lib/supabase/data'

/**
 * Returns the Clerk user ID for the current request, or null if unauthenticated.
 *
 * Uses Clerk's native `auth()` which reads the session from the request context
 * populated by `clerkMiddleware`. Works in Server Components, Route Handlers,
 * and Server Actions without any manual token passing.
 *
 * Requires `middleware.ts` to be active (see project root).
 */
export async function currentUserId(): Promise<string | null> {
  try {
    const { userId } = await auth()
    return userId
  } catch (error) {
    console.error('auth() error:', error)
    return null
  }
}

/**
 * Require an authenticated session. Returns the user ID, or null if not signed in.
 *
 * Use this in Server Actions and Route Handlers that need a user. Callers should
 * check for null and respond appropriately (throw / return 401).
 */
export async function requireAuth(): Promise<string | null> {
  return currentUserId()
}

/**
 * Fetch the user's primary email address from Clerk.
 * Falls back to null if the user has no email.
 */
export async function currentUserEmail(): Promise<string | null> {
  const userId = await currentUserId()
  if (!userId) return null

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.primaryEmailAddress?.emailAddress ?? null
  } catch (error) {
    console.error('Failed to fetch user email from Clerk:', error)
    return null
  }
}

export function getDataClient() {
  return createDataClient()
}
