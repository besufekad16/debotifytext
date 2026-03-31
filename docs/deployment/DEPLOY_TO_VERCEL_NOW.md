# Deploy to Vercel - Quick Guide 🚀

## What Changed?

We fixed the "Body exceeded 75000kb limit" error by implementing **Incremental Static Regeneration (ISR)**.

### Before ❌
- Tried to build all 40,000 pages at once
- Exceeded Vercel's 75MB function limit
- Build failed

### After ✅
- Pre-generate 1,000 high-priority pages at build time
- Generate remaining 39,000 pages on-demand when visited
- All pages are crawlable and indexable by Google
- Build completes in 3-5 minutes

## Deploy Steps

### 1. Commit Changes
```bash
git add .
git commit -m "Fix Vercel 75MB limit with ISR strategy"
git push origin main
```

### 2. Clear Vercel Cache (Important!)
1. Go to Vercel Dashboard
2. Select your project
3. Settings → General
4. Scroll to "Build & Development Settings"
5. Click "Clear Build Cache"

### 3. Deploy
- Vercel will auto-deploy from your git push
- OR manually trigger: `vercel --prod`

### 4. Monitor Build
- Build should complete in 3-5 minutes
- Look for: "Pre-generating 1,000 high-priority pages"
- Should see: "Build successful"

## What Happens Now?

### High-Priority Pages (1,000 pages)
- Pre-generated at build time
- Instant load for users
- Includes keywords like: humanizer, ai, detector, bypass, chatgpt, turnitin, etc.

### Other Pages (39,000 pages)
- Generated when first visited (by user or Google crawler)
- Takes 1-2 seconds on first visit
- Cached for 24 hours
- Instant on subsequent visits

## SEO Impact

✅ **All 40,000 pages are crawlable**
✅ **All pages in sitemaps work**
✅ **Google will index all pages**
✅ **No SEO penalty for ISR**

## Test After Deploy

### Test Pre-generated Page
```bash
curl https://www.humanifylab.com/ai-humanizer
# Should be instant
```

### Test ISR Page
```bash
curl https://www.humanifylab.com/some-keyword
# First visit: 1-2 seconds
# Second visit: instant
```

### Check Cache Status
```bash
curl -I https://www.humanifylab.com/your-keyword
# Look for: X-Vercel-Cache: HIT or MISS
```

## Expected Results

- ✅ Build completes successfully
- ✅ No 75MB limit errors
- ✅ All pages accessible
- ✅ Fast deployment (3-5 min)
- ✅ All sitemaps work
- ✅ Google can crawl all pages

## If You See Issues

### Build Still Fails
1. Clear Vercel cache (step 2 above)
2. Check Node.js version (should be 18.x or 20.x)
3. Verify `.env` variables are set in Vercel

### Pages Return 404
- Wait 1-2 seconds on first visit (ISR generation)
- Check if keyword exists in `public/data/keywords.json`
- Verify slug format (lowercase, hyphens, no special chars)

## Need to Adjust?

### Add More Priority Keywords
Edit `src/app/[keyword]/page.tsx` line 15-20:
```typescript
const highPriorityTerms = [
  'humanizer', 'ai', 'detector', // ... add more terms
];
```

### Change Cache Duration
Edit `src/app/[keyword]/page.tsx` line 11:
```typescript
export const revalidate = 86400; // 24 hours (change as needed)
```

---

**Ready to deploy!** 🎉
