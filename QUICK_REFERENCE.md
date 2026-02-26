# Quick Reference Card - HumanifyLab

## 🚨 URGENT: Fix Sign-In Buttons

**Problem:** Buttons not working on localhost

**Solution (5 minutes):**
1. Go to https://dashboard.clerk.com
2. Settings → Domains → Allowed origins
3. Add: `http://localhost:3050`
4. Save
5. Clear browser cache (or use incognito)
6. Restart: `npm run dev`
7. Test buttons ✅

**Verify keys first:**
```bash
node check-clerk-config.js
```

**Full guide:** `FIX_CLERK_BUTTONS_NOW.md`

---

## 🔑 Environment Variables

### Development (.env)
```env
# Clerk - TEST KEYS (for localhost)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Production (Vercel)
```env
# Clerk - PRODUCTION KEYS (for humanifylab.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

---

## 🌐 Important URLs

### Dashboards
- **Clerk:** https://dashboard.clerk.com
- **Vercel:** https://vercel.com/dashboard
- **Polar:** https://polar.sh/dashboard
- **Google Cloud:** https://console.cloud.google.com
- **Search Console:** https://search.google.com/search-console

### Your Site
- **Production:** https://www.humanifylab.com
- **Development:** http://localhost:3050

### Webhooks
- **Polar:** `https://www.humanifylab.com/api/webhooks/polar`
- **Clerk:** `https://www.humanifylab.com/api/webhooks/clerk`

---

## 📋 Quick Commands

```bash
# Check Clerk configuration
node check-clerk-config.js

# Start dev server
npm run dev

# Build for production
npm run build

# Generate keywords
npx tsx scripts/generate-40k-keywords.ts

# Generate sitemaps
npx tsx scripts/generate-sitemaps-40k.ts
```

---

## 🎯 Pricing

### Monthly
- Free: $0 (500 words)
- Basic: $6.99 (7,000 words)
- Pro: $23.99 (25,000 words)
- Ultra: $42.99 (50,000 words)

### Yearly (50.02% discount)
- Basic: $3.49/mo
- Pro: $11.99/mo
- Ultra: $21.49/mo

---

## 📊 SEO Stats

- **Total Pages:** 40,010
- **Pre-generated:** 1,000 (high-priority)
- **On-demand:** 39,000 (ISR)
- **Sitemaps:** 10 (1 main + 1 index + 8 keyword)
- **Build Time:** 5-6 minutes

---

## 🔧 Troubleshooting

### Sign-in buttons not working?
→ `FIX_CLERK_BUTTONS_NOW.md`

### Google OAuth not working?
→ `GOOGLE_OAUTH_SETUP.md`

### Webhook not working?
→ `WEBHOOK_TROUBLESHOOTING.md`

### Credits not updating?
→ `CREDITS_NOT_UPDATING_FIX.md`

---

## 📚 Documentation

### Start Here
1. `COMPLETE_SETUP_GUIDE.md` - Overview
2. `FIX_CLERK_BUTTONS_NOW.md` - Fix buttons
3. `GOOGLE_OAUTH_SETUP.md` - Google OAuth

### Clerk Setup
- `CLERK_LOCALHOST_FIX.md`
- `CLERK_DOMAIN_UPDATE_STEP_BY_STEP.md`
- `CLERK_KEYS_FIX_URGENT.md`

### Other
- `STEP_BY_STEP_GUIDES.md`
- `SEARCH_CONSOLE_SETUP.md`
- `BUILD_OPTIMIZATION_PLAN.md`

---

## ✅ Setup Checklist

### Localhost Development
- [ ] Test keys in `.env`
- [ ] Localhost in Clerk allowed origins
- [ ] Browser cache cleared
- [ ] Dev server running
- [ ] Sign-in buttons working

### Google OAuth
- [ ] OAuth credentials created
- [ ] Redirect URI in Google Cloud Console
- [ ] Client ID/Secret in Clerk
- [ ] Google enabled in Clerk
- [ ] Google sign-in working

### Polar Integration
- [ ] Webhook URL in Polar Dashboard
- [ ] Webhook secret in Vercel
- [ ] Test subscription flow

### Production Deployment
- [ ] Production keys in Vercel
- [ ] Domain updated in Clerk
- [ ] Google OAuth for production
- [ ] Sitemaps submitted
- [ ] Analytics tracking

---

## 🆘 Quick Help

**Clerk not loading?**
1. Check keys: `node check-clerk-config.js`
2. Add localhost to allowed origins
3. Clear cache
4. Restart server

**CORS errors?**
1. Add localhost to Clerk allowed origins
2. Wait 1-2 minutes
3. Clear cache
4. Try incognito window

**Production keys on localhost?**
1. Switch to test keys in `.env`
2. Restart server

**Test keys on production?**
1. Add production keys to Vercel
2. Redeploy

---

## 📞 Contact

**Email:** humanifylab1@gmail.com
**Domain:** www.humanifylab.com
**GitHub:** segnia05

---

**Last Updated:** February 25, 2026
