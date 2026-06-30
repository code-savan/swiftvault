import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/onboarding',
])

export default clerkMiddleware(async (auth, req) => {
  const session = await auth()
  if (isProtectedRoute(req) && !session.userId) {
    session.redirectToSignIn()
  }
})

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}