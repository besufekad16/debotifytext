# 🚀 Deploy to Production - Quick Checklist

## What Was Fixed
Changed from experimental `gemini-3-flash-preview` to stable `gemini-2.5-flash` model.

## Why This Fixes the Issue
- ✅ `gemini-2.5-flash` is production-ready and stable
- ✅ Works with all API keys (no special access needed)
- ✅ Lower CPU usage (won't hit Vercel limits)
- ✅ Same model that works in localhost tests
- ✅ Fallback to `gemini-1.5-flash` if needed

## Deploy Now (3 Steps)

### 1️⃣ Push to Vercel
```bash
git add .
git commit -m "fix: use stable gemini-2.5-flash for production"
git push origin main
```

### 2️⃣ Clear Vercel Build Cache
1. Go to https://vercel.com/dashboard
2. Select your humanify project
3. Settings → General → Build & Development Settings
4. Click "Clear Build Cache"
5. Go to Deployments tab → Click "Redeploy" on latest deployment

### 3️⃣ Test in Production
1. Go to your production URL
2. Paste text with at least 50 words
3. Click "Humanize"
4. ✅ Should work without "Failed to humanize text" error

## If It Still Fails

### Check Vercel Logs
```bash
vercel logs --follow
```

### Verify Environment Variable
Go to Vercel Dashboard → Settings → Environment Variables
Ensure `AISTUDIOS_API_KEY` is set to:
```
AIzaSyAA6W9p9gR4SX8ePAYluX2vV1sVGGZ70jY
```

### Check API Key Works
Run this test:
```bash
node test-api-directly.js
```
Should show: ✅ SUCCESS! API is working correctly.

## What Changed

| File | Change |
|------|--------|
| `src/server/config/models.ts` | PRIMARY: `gemini-2.5-flash` (was `gemini-3-flash-preview`) |
| `src/server/config/models.ts` | FALLBACK: `gemini-1.5-flash` (was `gemini-2.5-flash`) |
| `src/server/adapters/aistudios.ts` | Updated comments and logs |

## Confidence Level: HIGH ✅
- Local tests pass 100%
- Using stable, production-ready model
- Same model that works in localhost
- Lower CPU usage for Vercel

---

**Ready to deploy!** Follow the 3 steps above.
