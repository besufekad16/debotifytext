# Complete Setup Guide - HumanifyLab

This guide covers all the setup steps for your HumanifyLab application.

---

## 🚀 Quick Start (For Localhost Development)

### 1. Fix Clerk Sign-In Buttons (10 minutes)

**Problem:** Sign-in/sign-up buttons not working on localhost.

**Solution:** Follow `FIX_CLERK_BUTTONS_NOW.md`

**Quick steps:**
1. Run `node check-clerk-config.js` to verify keys
2. Add `http://localhost:3050` to Clerk allowed origins
3. Clear browser cache
4. Restart dev server: `npm run dev`
5. Test buttons

**Status:** ✅ You have TEST keys configured correctly!

---

## 🔐 Authentication Setup

### Clerk Configuration

**Current Status:**
- ✅ Test keys configured in `.env`
- ✅ Middleware configured
- ✅ TooltipProvider added to layout
- ⚠️ Need to add localhost to Clerk allowed origins

**Files:**
- `.env` - Environment variables
- `src/middleware.ts` - Clerk middleware
- `src/app/layout.tsx` - Clerk provider
- `src/components/ModernNavbar.tsx` - Sign-in buttons

**Guides:**
- `FIX_CLERK_BUTTONS_NOW.md` - Fix sign-in buttons (START HERE!)
- `CLERK_LOCALHOST_FIX.md` - Detailed localhost setup
- `CLERK_DOMAIN_UPDATE_STEP_BY_STEP.md` - Update domain for production
- `CLERK_KEYS_FIX_URGENT.md` - Understanding test vs production keys

---

## 🔑 Google OAuth Setup

**Problem:** Need to configure Google sign-in.

**Solution:** Follow `GOOGLE_OAUTH_SETUP.md`

**Quick steps:**
1. Get redirect URI from Clerk Dashboard
2. Create OAuth credentials in Google Cloud Console
3. Add redirect URI to Google Cloud Console
4. Add Client ID and Secret to Clerk
5. Enable Google in Clerk

**Redirect URI format:**
```
https://clerk.humanifylab.com/v1/oauth_callback
```
(Get exact URL from Clerk Dashboard)

---

## 💳 Payment Integration

### Polar Webhook

**Webhook URL:**
```
https://www.humanifylab.com/api/webhooks/polar
```

**Setup:**
1. Go to Polar Dashboard: https://polar.sh/dashboard
2. Go to Settings → Webhooks
3. Add webhook URL: `https://www.humanifylab.com/api/webhooks/polar`
4. Copy webhook secret
5. Add to Vercel environment variables:
   ```
   POLAR_WEBHOOK_SECRET=polar_whs_xxxxx
   ```
6. Redeploy on Vercel

**Implementation:**
- `src/app/api/webhooks/polar/route.ts` - Webhook handler
- Handles: subscription created, updated, active, canceled, revoked
- Also handles: order and checkout events

---

## 🌐 SEO Configuration

### Sitemap Structure

**Main sitemap:**
- `public/sitemap.xml` - 10 main pages

**Keyword sitemaps:**
- `public/sitemaps/sitemap-1.xml` through `sitemap-8.xml` - 40,000 keyword pages
- `public/sitemaps/sitemap-index.xml` - Index of all sitemaps

**Robots.txt:**
- `public/robots.txt` - Lists all sitemaps, disallows private pages

### ISR Configuration

**Pre-generated pages:** 1,000 high-priority keyword pages
**On-demand pages:** 39,000 keyword pages (generated when first visited)
**Revalidation:** 24 hours (86400 seconds)

**Implementation:**
- `src/app/[keyword]/page.tsx` - Dynamic keyword pages with ISR
- `scripts/generate-40k-keywords.ts` - Keyword generator
- `scripts/generate-sitemaps-40k.ts` - Sitemap generator

**Build time:** 5-6 minutes
**All pages are crawlable and indexable by Google via ISR** ✅

---

## 📊 Analytics

### Google Analytics

**Tracking ID:** G-6C1TZBERFK

**Implementation:**
- `src/app/layout.tsx` - Google Analytics script
- Google Tag Manager: GTM-TK39PV2F

### Google Search Console

**Verification:**
- Method 1: HTML file - `public/google-site-verification.html`
- Method 2: Meta tag in `src/app/layout.tsx`

**Setup:**
1. Go to: https://search.google.com/search-console
2. Add property: `https://www.humanifylab.com`
3. Verify using HTML file or meta tag
4. Submit sitemaps:
   - `https://www.humanifylab.com/sitemap.xml`
   - `https://www.humanifylab.com/sitemaps/sitemap-index.xml`

---

## 🎨 Features Implemented

### 1. Pricing Modal
- Shows 2 seconds after sign-in for free users
- Won't show again for 7 days after dismissal
- 4 pricing tiers: Free, Basic ($6.99), Pro ($23.99), Ultra ($42.99)

**Files:**
- `src/hooks/usePricingModal.ts`
- `src/components/PricingModal.tsx`

### 2. Social Proof Notifications
- Bottom-left corner notifications
- Random "Someone just humanized X words using [Plan]!" messages
- Only shows paid plans (Basic, Pro, Ultra)
- Display time: 2 seconds
- Next notification: 1.1 seconds after previous disappears

**Files:**
- `src/components/SocialProofNotification.tsx`

### 3. Professional Content
- Removed AI detection evasion language
- Focus on professional writing enhancement
- Age restriction: 18+ for students
- SEO keywords unchanged

**Files:**
- `src/lib/pseo-content.ts`
- `src/lib/polar-products.ts`
- `src/app/UnifiedHomePage.tsx`

---

## 🚀 Deployment

### Vercel Configuration

**Environment Variables:**

```env
# Database
DATABASE_URL=postgresql://...

# Clerk (Development)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Polar
POLAR_ACCESS_TOKEN=polar_oat_...
POLAR_WEBHOOK_SECRET=polar_whs_...
POLAR_ENV=production

# Polar Products
POLAR_PRODUCT_SMALL=...
POLAR_PRODUCT_MEDIUM=...
POLAR_PRODUCT_LARGE=...
POLAR_PRODUCT_YEARLY_SMALL=...
POLAR_PRODUCT_YEARLY_MEDIUM=...
POLAR_PRODUCT_YEARLY_LARGE=...
POLAR_CREDITS_5000=...
POLAR_CREDITS_20000=...
POLAR_CREDITS_45000=...

# Email
RESEND_API_KEY=re_...

# Google OAuth
CLIENT_ID=...apps.googleusercontent.com
CLIENT_SECRET=GOCSPX-...

# AI Services
AISTUDIOS_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-proj-...
```

**Build Configuration:**
- `vercel.json` - Minimal configuration
- `next.config.js` - ISR and optimization settings

**Deployment Steps:**
1. Push to GitHub
2. Vercel auto-deploys
3. Check deployment logs
4. Test on production

---

## 📝 Pricing Plans

### Monthly Plans

| Plan | Price | Word Limit | Features |
|------|-------|------------|----------|
| Free | $0 | 500 words | Basic humanization |
| Basic | $6.99 | 7,000 words | All presets, priority support |
| Pro | $23.99 | 25,000 words | All presets, priority support |
| Ultra | $42.99 | 50,000 words | All presets, priority support |

### Yearly Plans (50.02% discount)

| Plan | Price | Word Limit |
|------|-------|------------|
| Basic | $3.49/mo | 7,000 words |
| Pro | $11.99/mo | 25,000 words |
| Ultra | $21.49/mo | 50,000 words |

### Credit Top-Ups

| Credits | Price |
|---------|-------|
| 5,000 | TBD |
| 20,000 | TBD |
| 45,000 | TBD |

---

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing

```bash
# Check Clerk configuration
node check-clerk-config.js

# Test Polar checkout
node test-polar-checkout.js

# Check user status
psql $DATABASE_URL -f check-user-status.sql
```

### Scripts

- `scripts/generate-40k-keywords.ts` - Generate keywords
- `scripts/generate-sitemaps-40k.ts` - Generate sitemaps
- `scripts/request-indexing.ts` - Request Google indexing
- `seo/search-console-submitter.ts` - Submit to Search Console

---

## 📚 Documentation Files

### Setup Guides
- `COMPLETE_SETUP_GUIDE.md` - This file (overview)
- `FIX_CLERK_BUTTONS_NOW.md` - Fix sign-in buttons (START HERE!)
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth configuration
- `STEP_BY_STEP_GUIDES.md` - Various setup guides

### Clerk Guides
- `CLERK_LOCALHOST_FIX.md` - Localhost configuration
- `CLERK_DOMAIN_UPDATE_STEP_BY_STEP.md` - Production domain setup
- `CLERK_KEYS_FIX_URGENT.md` - Understanding keys

### SEO Guides
- `SEARCH_CONSOLE_SETUP.md` - Google Search Console
- `PRIORITY_PAGES_FOR_INDEXING.md` - Priority pages
- `BUILD_OPTIMIZATION_PLAN.md` - Build optimization

### Other Guides
- `WEBHOOK_TROUBLESHOOTING.md` - Polar webhook issues
- `CREDITS_NOT_UPDATING_FIX.md` - Credit system issues
- `GOOGLE_CONFIGURATION_COMPLETE.md` - Google Analytics setup

---

## ✅ Current Status

### Working
- ✅ Pricing modal
- ✅ Social proof notifications
- ✅ Professional content
- ✅ 40,000 keyword pages with ISR
- ✅ Sitemap structure
- ✅ Google Analytics
- ✅ Polar webhook endpoint
- ✅ Test keys configured

### Needs Setup
- ⚠️ Clerk localhost configuration (add allowed origins)
- ⚠️ Google OAuth credentials
- ⚠️ Polar webhook secret in Vercel
- ⚠️ Google Search Console verification

### For Production
- 🔄 Update Clerk domain to humanifylab.com
- 🔄 Use production Clerk keys
- 🔄 Configure Google OAuth for production
- 🔄 Submit sitemaps to Google Search Console

---

## 🎯 Next Steps

### Immediate (For Localhost)
1. **Fix Clerk buttons** - Follow `FIX_CLERK_BUTTONS_NOW.md`
   - Add localhost to Clerk allowed origins
   - Clear cache and restart server
   - Test sign-in buttons

### Short Term (This Week)
2. **Setup Google OAuth** - Follow `GOOGLE_OAUTH_SETUP.md`
   - Create OAuth credentials
   - Configure in Clerk
   - Test Google sign-in

3. **Configure Polar Webhook**
   - Add webhook URL to Polar Dashboard
   - Add webhook secret to Vercel
   - Test subscription flow

### Medium Term (Before Launch)
4. **Update Clerk for Production**
   - Follow `CLERK_DOMAIN_UPDATE_STEP_BY_STEP.md`
   - Update domain to humanifylab.com
   - Use production keys in Vercel
   - Test on production

5. **Setup Google Search Console**
   - Verify domain
   - Submit sitemaps
   - Monitor indexing

### Long Term (Post-Launch)
6. **Monitor and Optimize**
   - Check Google Analytics
   - Monitor Search Console
   - Track subscription conversions
   - Optimize SEO based on data

---

## 🆘 Getting Help

### If Sign-In Buttons Don't Work
1. Run: `node check-clerk-config.js`
2. Check: `FIX_CLERK_BUTTONS_NOW.md`
3. Verify: Localhost in Clerk allowed origins
4. Clear: Browser cache
5. Restart: Dev server

### If Google OAuth Doesn't Work
1. Check: `GOOGLE_OAUTH_SETUP.md`
2. Verify: Redirect URI matches Clerk
3. Check: Client ID and Secret in Clerk
4. Verify: Google OAuth enabled in Clerk

### If Webhook Doesn't Work
1. Check: `WEBHOOK_TROUBLESHOOTING.md`
2. Verify: Webhook URL in Polar Dashboard
3. Check: Webhook secret in Vercel
4. Test: Using Polar test mode

---

## 📞 Contact

**Email:** segnia05@gmail.com
**Domain:** www.humanifylab.com
**GitHub:** segnia05

---

**Last Updated:** February 25, 2026

**Version:** 1.0.0

---

## 🎉 Summary

Your HumanifyLab application is almost ready! The main thing you need to do now is:

1. **Add localhost to Clerk allowed origins** (5 minutes)
2. **Test sign-in buttons** (1 minute)
3. **Setup Google OAuth** (10 minutes)
4. **Configure Polar webhook** (5 minutes)

Then you're ready to deploy to production! 🚀
