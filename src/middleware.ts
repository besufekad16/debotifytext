import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

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

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
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
