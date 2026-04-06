import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'
import { db } from '~/server/db'

// Note: With ISR and dynamicParams=true, we don't need to list all SEO routes
// All routes are public by default unless explicitly protected
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/contact(.*)',
  '/faq(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/pricing(.*)',
  '/responsible-use(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/webhooks/polar(.*)',
  '/api/polar/products(.*)',
  '/api/humanize(.*)',
  '/sitemap.xml',
  '/robots.txt',
  '/sitemap',
  '/robots',
  // All dynamic [keyword] routes are public (handled by dynamicParams)
  '/:keyword',
])

const COOKIE_NAME = 'ref'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days in seconds

export default clerkMiddleware(async (auth, request: NextRequest) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  // Referral cookie tracking — runs on every request
  const refParam = request.nextUrl.searchParams.get(COOKIE_NAME)

  if (refParam) {
    try {
      // Validate the code exists in DB before setting cookie
      const affiliate = await db.affiliate.findUnique({
        where: { referralCode: refParam },
        select: { referralCode: true },
      })

      if (affiliate) {
        const response = NextResponse.next()
        response.cookies.set(COOKIE_NAME, affiliate.referralCode, {
          maxAge: COOKIE_MAX_AGE,
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
        })
        return response
      }
    } catch {
      // DB error — silently skip, don't break the request
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // Also skip SEO files: sitemap.xml, robots.txt
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
