# 🔍 DEBUG: Why Deployment Still Fails

## Current Status
- ✅ Local API test works (`node test-api-directly.js`)
- ✅ Model configuration is correct (`gemini-2.5-flash`)
- ✅ Code is committed and pushed
- ❌ Production still shows "Failed to humanize text"

## Possible Causes

### 1. Vercel Build Cache Issue
Vercel might be using cached build artifacts with the old model name.

**Solution:**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to Settings → General
4. Scroll to "Build & Development Settings"
5. Click "Clear Build Cache"
6. Redeploy

### 2. Environment Variables Not Set in Vercel
The API keys might not be configured in Vercel's environment.

**Check:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these exist:
   - `AISTUDIOS_API_KEY` = `AIzaSyAA6W9p9gR4SX8ePAYluX2vV1sVGGZ70jY`
   - `OPENAI_API_KEY` = Your OpenAI key
   - `DATABASE_URL` = Your database URL
   - All other env vars from `.env`

**If missing, add them:**
1. Click "Add New"
2. Name: `AISTUDIOS_API_KEY`
3. Value: `AIzaSyAA6W9p9gR4SX8ePAYluX2vV1sVGGZ70jY`
4. Environment: Production, Preview, Development (select all)
5. Click "Save"
6. Redeploy

### 3. Wrong Branch Deployed
Vercel might be deploying from a different branch.

**Check:**
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Verify "Production Branch" is set to `main` (or your branch name)
3. Check recent deployments to see which commit is deployed

### 4. Deployment Failed Silently
The deployment might have errors that aren't obvious.

**Check:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check "Build Logs" for errors
4. Check "Function Logs" for runtime errors

### 5. API Route Not Updated
Next.js might have cached the API route.

**Solution:**
1. In Vercel Dashboard, go to your project
2. Click "Redeploy" button
3. Check "Use existing Build Cache" is UNCHECKED
4. Click "Redeploy"

## Step-by-Step Debugging

### Step 1: Verify Deployment Status
```bash
# Check what's deployed
git log --oneline -5

# Check if your commit is there
git log --grep="gemini-2.5-flash"
```

### Step 2: Check Vercel Deployment
1. Go to https://vercel.com/dashboard
2. Find your project
3. Click on latest deployment
4. Look for your commit message: "fix: use verified Gemini model"
5. If not there, the deployment didn't happen

### Step 3: Force Redeploy
```bash
# Make a small change to force rebuild
cd humanify
echo "# Force rebuild" >> README.md
git add README.md
git commit -m "chore: force rebuild"
git push origin main
```

### Step 4: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project
2. Click "View Function Logs"
3. Try to humanize text on your site
4. Watch the logs in real-time
5. Look for errors mentioning "gemini" or "model"

### Step 5: Test Production API Directly
```bash
# Replace YOUR_DOMAIN with your actual domain
curl -X POST https://YOUR_DOMAIN.vercel.app/api/humanizer/stream \
  -H "Content-Type: application/json" \
  -d '{"text":"Test text here","preset":"default"}'
```

## Common Error Messages & Solutions

### "Model not found" or "Invalid model"
**Cause**: Old code still deployed
**Solution**: Clear build cache and redeploy

### "Unauthorized" or "Invalid API key"
**Cause**: Environment variables not set in Vercel
**Solution**: Add `AISTUDIOS_API_KEY` to Vercel env vars

### "Rate limit exceeded"
**Cause**: Too many requests to Gemini API
**Solution**: Wait a few minutes, or upgrade to paid tier

### "Failed to humanize text" (no other details)
**Cause**: Generic error, need to check logs
**Solution**: Check Vercel Function Logs for actual error

## Nuclear Option: Complete Reset

If nothing works, try this:

```bash
cd humanify

# 1. Delete node_modules and build artifacts
rm -rf node_modules .next

# 2. Reinstall dependencies
npm install

# 3. Test locally
npm run build
npm run start

# 4. If local works, commit and push
git add .
git commit -m "chore: rebuild from scratch"
git push origin main

# 5. In Vercel Dashboard:
#    - Clear build cache
#    - Redeploy
```

## Get Actual Error Message

To see the REAL error, check browser console:

1. Open your website
2. Press F12 (open DevTools)
3. Go to "Console" tab
4. Try to humanize text
5. Look for red error messages
6. Copy the full error and share it

## Check What Model Is Actually Being Used

Add this temporary logging to see what's happening:

1. Go to `humanify/src/server/config/models.ts`
2. Add at the top:
```typescript
console.log("[MODEL CONFIG] DEFAULT_MODEL:", DEFAULT_MODEL);
```
3. Commit and push
4. Check Vercel Function Logs
5. You should see: `[MODEL CONFIG] DEFAULT_MODEL: gemini-2.5-flash`

If you see anything else, the old code is still deployed.

## Still Not Working?

Share these details:
1. Vercel deployment URL
2. Latest commit hash from GitHub
3. Vercel deployment logs (Build Logs tab)
4. Vercel function logs (when you try to humanize)
5. Browser console errors (F12 → Console)
6. Screenshot of the error

This will help identify the exact issue!
