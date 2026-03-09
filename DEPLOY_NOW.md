# 🚀 DEPLOY NOW - Fix "Failed to humanize text" Error

## The Problem
Your LOCAL code is fixed, but Vercel is still running the OLD code with the broken model name.

## The Solution
You need to commit and push the changes to trigger a Vercel deployment.

## Step-by-Step Deployment

### 1. Check what changed
```bash
cd humanify
git status
git diff src/server/config/models.ts
```

### 2. Add all changes
```bash
git add .
```

### 3. Commit with a clear message
```bash
git commit -m "fix: use verified stable Gemini model (gemini-2.5-flash) to fix humanization errors"
```

### 4. Push to trigger Vercel deployment
```bash
git push origin main
```

### 5. Wait for Vercel to deploy (2-3 minutes)
- Go to your Vercel dashboard
- Watch the deployment progress
- Wait for "Deployment Complete" status

### 6. Test on production
- Go to your live website
- Try humanizing some text
- Should work now!

## What Was Fixed

### Before (BROKEN)
```typescript
export const DEFAULT_MODEL = "gemini-3-flash-preview"; // ❌ Doesn't exist
```

### After (FIXED)
```typescript
export const DEFAULT_MODEL = "gemini-2.5-flash"; // ✅ Verified stable model
```

## If It Still Fails After Deployment

### Check Vercel Environment Variables
Make sure these are set in Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these exist:
   - `AISTUDIOS_API_KEY` = Your Google AI Studio API key
   - `OPENAI_API_KEY` = Your OpenAI API key

### Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Click "View Function Logs"
4. Look for errors related to Gemini API

### Common Issues

**Issue**: "Model not found" in logs
**Solution**: API key might be invalid or doesn't have access to gemini-2.5-flash

**Issue**: "Rate limit exceeded"
**Solution**: You're hitting Google's free tier limits (15 requests/minute)

**Issue**: "Failed to humanize text" but no logs
**Solution**: Check if the deployment actually updated (look at commit hash)

## Quick Test Command

After deployment, test the API directly:
```bash
curl -X POST https://your-domain.vercel.app/api/humanizer/stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{"text":"This is a test. It should work now.","preset":"default"}'
```

## Verification Checklist

- [ ] Changes committed locally
- [ ] Changes pushed to GitHub
- [ ] Vercel deployment triggered
- [ ] Deployment completed successfully
- [ ] Environment variables set in Vercel
- [ ] Tested on production website
- [ ] Humanization works!

## Need Help?

If it still doesn't work after deployment:
1. Share the Vercel deployment logs
2. Share any browser console errors
3. Confirm the environment variables are set correctly
