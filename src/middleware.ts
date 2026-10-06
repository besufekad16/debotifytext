import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

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
  '/affiliate(.*)',
  // Topic hubs MUST be public — Googlebot uses them as the HTML crawl graph
  // into tens of thousands of PSEO pages. Auth-blocking /topics/[cluster]
  // orphans long-tail URLs behind XML-only discovery.
  '/topics(.*)',
  '/guides(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/webhooks/polar(.*)',
  '/api/polar/products(.*)',
  '/api/polar/unlimited-spots(.*)',
  '/api/polar/lifetime',
  '/api/humanize(.*)',
  '/sitemap.xml',
  '/robots.txt',
  '/sitemap',
  '/robots',
  // Live PSEO is /:keyword. /guides/:keyword 308s onto the same slug.
  '/:keyword',
])

const COOKIE_NAME = 'ref'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export default clerkMiddleware(async (auth, request: NextRequest) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  // Referral cookie tracking — set directly from URL param, no DB call needed
  // (Edge runtime can't use Prisma — validation happens in the webhook instead)
  const refParam = request.nextUrl.searchParams.get(COOKIE_NAME)

  if (refParam && refParam.length > 0 && refParam.length < 64) {
    const pathname = request.nextUrl.pathname
    const isApiOrInternal = pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.includes('.')

    if (!isApiOrInternal) {
      const existingCookie = request.cookies.get(COOKIE_NAME)?.value
      if (existingCookie !== refParam) {
        const response = NextResponse.next()
        response.cookies.set(COOKIE_NAME, refParam, {
          maxAge: COOKIE_MAX_AGE,
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        return response
      }
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    '/(api|trpc)(.*)',
  ],
}
