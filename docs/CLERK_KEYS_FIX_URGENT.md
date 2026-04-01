# URGENT: Clerk Keys Fix - Production vs Development Keys

## Problem Identified ✅

You're using **PRODUCTION keys** (`pk_live_` and `sk_live_`) which only work on `humanifylab.com`.

When you run locally on `localhost:3050`, Clerk blocks the request because production keys are domain-restricted.

## Error Breakdown

```
Error: Production Keys are only allowed for domain "unrobotictext.com"
CORS Error: Access to clerk.humanifylab.com blocked from localhost:3050
```

This means:
- Your production keys are tied to `humanifylab.com` domain
- They don't work on `localhost`
- You need **development keys** for local development

## Solution: Get Development Keys

### Step 1: Go to Clerk Dashboard

1. Visit https://dashboard.clerk.com
2. Log in to your account
3. Select your application (or create a new one for development)

### Step 2: Get Development Keys

1. In the sidebar, click **"API Keys"**
2. You'll see TWO sets of keys:

**Development Keys** (for localhost):
```
Publishable Key: pk_test_xxxxxxxxxxxxx
Secret Key: sk_test_xxxxxxxxxxxxx
```

**Production Keys** (for humanifylab.com):
```
Publishable Key: pk_live_xxxxxxxxxxxxx
Secret Key: sk_live_xxxxxxxxxxxxx
```

### Step 3: Copy Development Keys

Copy the **TEST keys** (pk_test_ and sk_test_)

### Step 4: Update Your .env File

Replace your current keys with the development keys:

```env
# Clerk - DEVELOPMENT KEYS (for localhost)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_test_key_here
CLERK_SECRET_KEY=sk_test_your_actual_test_secret_here
```

**IMPORTANT:** Use `pk_test_` and `sk_test_` keys, NOT `pk_live_` and `sk_live_`

### Step 5: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 6: Test

1. Open http://localhost:3050
2. Click "Sign In" or "Get Started Free"
3. Modal should now open!

## For Production Deployment

When deploying to Vercel, you'll use the **PRODUCTION keys**:

### Vercel Environment Variables

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add TWO sets of keys:

**For Development/Preview:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_xxxxx (Development)
CLERK_SECRET_KEY = sk_test_xxxxx (Development)
Environment: Development, Preview
```

**For Production:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_xxxxx (Production)
CLERK_SECRET_KEY = sk_live_xxxxx (Production)
Environment: Production
```

## Quick Reference

### Development (localhost)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Production (humanifylab.com)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

## Configure Clerk Application URLs

Make sure your Clerk application has the correct URLs configured:

### In Clerk Dashboard → Settings → Domains

**Development:**
- Add: `http://localhost:3050`
- Add: `http://localhost:3000` (backup)

**Production:**
- Add: `https://www.humanifylab.com`
- Add: `https://humanifylab.com`

## Why This Happens

Clerk uses different keys for different environments:

- **Test keys** (`pk_test_`, `sk_test_`): Work on localhost and any domain
- **Live keys** (`pk_live_`, `sk_live_`): Only work on your configured production domain

This is a security feature to prevent unauthorized use of your production authentication.

## After Fixing

Once you update to test keys and restart:

✅ Sign-in modal will open
✅ Sign-up modal will open
✅ "Get Started Free" button will work
✅ No CORS errors
✅ No domain restriction errors

---

**Action Required:** Get your `pk_test_` and `sk_test_` keys from Clerk Dashboard and update .env file!
