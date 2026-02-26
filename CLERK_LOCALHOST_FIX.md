# Fix Clerk Sign-In Buttons on Localhost - Complete Guide

## Current Status ✅

You're now using **TEST keys** in `.env`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bG92ZWQtam9leS0yNC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_e9fgfDn4z2vjw05EumANTGJ9602RbSWBu8irN4ZPxK
```

This is correct! ✅

## Problem: CORS Errors

The console errors show:
```
Access to clerk.humanifylab.com blocked from localhost:3050
Failed to load resource: net::ERR_FAILED
ClerkRuntimeError: Failed to load Clerk
```

This means your Clerk application is still configured for `humanifylab.com` domain, not localhost.

---

## Solution: Configure Clerk for Localhost

### Step 1: Go to Clerk Dashboard

1. Visit: https://dashboard.clerk.com
2. Log in
3. Select your application

### Step 2: Check Your Application Domain

Look at the URL in your browser when you're in the Clerk Dashboard. It should show something like:
```
https://dashboard.clerk.com/apps/app_xxxxx/instances/ins_xxxxx
```

The test keys you have (`pk_test_bG92ZWQtam9leS0yNC5jbGVyay5hY2NvdW50cy5kZXYk`) decode to:
```
Domain: loved-joey-24.clerk.accounts.dev
```

This is a **development instance** which is perfect for localhost! ✅

### Step 3: Configure Allowed Origins

1. In Clerk Dashboard, go to **"Settings"** (left sidebar)
2. Look for **"Domains"** or **"Paths"** section
3. Find **"Allowed origins"** or **"CORS origins"**
4. Add these origins:

```
http://localhost:3050
http://localhost:3000
http://127.0.0.1:3050
```

Click **"Add origin"** for each one.

### Step 4: Configure Redirect URLs

Still in Settings → Domains/Paths:

1. **Home URL**: `http://localhost:3050`
2. **Sign-in URL**: `http://localhost:3050/sign-in`
3. **Sign-up URL**: `http://localhost:3050/sign-up`
4. **After sign-in redirect**: `http://localhost:3050`
5. **After sign-up redirect**: `http://localhost:3050`

### Step 5: Save Changes

Click **"Save"** at the bottom of the page.

---

## Alternative: Use Clerk's Default Development Instance

If you can't find the settings above, Clerk test keys should work automatically on localhost. The issue might be that your app is trying to load from the wrong domain.

### Check Your Clerk Configuration

Look for any hardcoded Clerk domains in your code:

1. Check `next.config.js` or `next.config.mjs`
2. Check for any `CLERK_FRONTEND_API` or `CLERK_API_URL` environment variables
3. Make sure you don't have any custom Clerk domain configuration

---

## Step 6: Clear Browser Cache

After updating Clerk settings:

1. **Close all browser tabs** with localhost:3050
2. **Clear browser cache**:
   - Chrome: Ctrl+Shift+Delete → Select "Cached images and files" → Clear
   - Or use Incognito/Private window
3. **Restart your dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## Step 7: Test

1. Open http://localhost:3050
2. Open browser console (F12)
3. Click "Sign In" or "Get Started Free"
4. **Modal should open!** ✅

### Expected Result:
- ✅ Modal opens
- ✅ No CORS errors
- ✅ Can sign in/sign up

---

## If Still Not Working: Check Environment Variables

Make sure you don't have any conflicting environment variables:

### Check `.env.local` (if it exists)

```bash
# Check if .env.local exists
ls -la .env.local
```

If it exists, make sure it doesn't have conflicting Clerk keys.

### Check Vercel Environment Variables (if running on Vercel preview)

If you're testing on a Vercel preview deployment (not localhost), you need to use production keys, not test keys.

---

## Troubleshooting Checklist

- [ ] Using test keys (`pk_test_` and `sk_test_`) in `.env`
- [ ] Clerk Dashboard → Settings → Allowed origins includes `http://localhost:3050`
- [ ] No conflicting environment variables in `.env.local`
- [ ] Browser cache cleared
- [ ] Dev server restarted
- [ ] Testing in fresh browser tab or incognito window

---

## Quick Test: Verify Clerk Keys

Run this in your terminal to verify your keys are loaded:

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
$env:CLERK_SECRET_KEY

# Or check in Node
node -e "require('dotenv').config(); console.log('Publishable:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY); console.log('Secret:', process.env.CLERK_SECRET_KEY?.substring(0, 20) + '...');"
```

You should see:
```
Publishable: pk_test_bG92ZWQtam9leS0yNC5jbGVyay5hY2NvdW50cy5kZXYk
Secret: sk_test_e9fgfDn4z2vjw...
```

---

## For Production (humanifylab.com)

When you're ready to deploy to production:

### 1. Create Production Clerk Application

1. In Clerk Dashboard, click **"+ Create Application"**
2. Name: **HumanifyLab Production**
3. Click **"Create"**

### 2. Configure Production Domain

1. Settings → Domains
2. **Home URL**: `https://www.humanifylab.com`
3. **Sign-in URL**: `https://www.humanifylab.com/sign-in`
4. **Sign-up URL**: `https://www.humanifylab.com/sign-up`
5. **Allowed origins**:
   ```
   https://www.humanifylab.com
   https://humanifylab.com
   ```

### 3. Get Production Keys

1. Go to **"API Keys"**
2. Copy **Production keys** (pk_live_ and sk_live_)

### 4. Update Vercel Environment Variables

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_xxxxx
   CLERK_SECRET_KEY = sk_live_xxxxx
   Environment: Production
   ```
3. Redeploy

---

## Summary

**For localhost development:**
- Use test keys (`pk_test_`, `sk_test_`) ✅ (You already have these!)
- Add `http://localhost:3050` to Clerk allowed origins
- Clear cache and restart server

**For production (humanifylab.com):**
- Use production keys (`pk_live_`, `sk_live_`)
- Configure domain as `humanifylab.com` in Clerk
- Update Vercel environment variables

---

## Need More Help?

If you're still stuck, please share:
1. Screenshot of Clerk Dashboard → Settings → Domains page
2. Console errors (F12 → Console tab)
3. Network tab errors (F12 → Network tab → filter by "clerk")

The most common issue is that localhost is not added to allowed origins in Clerk Dashboard.
