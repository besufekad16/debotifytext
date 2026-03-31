# Clerk Production Domain Fix - URGENT

## Problem Identified

Your Clerk production keys are configured for **"unrobotictext.com"** but your actual domain is **"humanifylab.com"**.

Error from console:
```
Clerk: Production Keys are only allowed for domain "unrobotictext.com"
```

This means your Clerk application is still pointing to the old domain.

## Solution: Update Clerk Domain Configuration

### Step 1: Go to Clerk Dashboard

1. Visit https://dashboard.clerk.com
2. Log in to your account
3. Select your application

### Step 2: Update Domain Settings

1. In the sidebar, click **"Domains"** or **"Settings"**
2. Look for **"Home URL"** or **"Application URLs"**
3. You'll see it's currently set to: `unrobotictext.com`

### Step 3: Change to HumanifyLab Domain

Update ALL URLs to use `humanifylab.com`:

**Home URL:**
```
https://www.humanifylab.com
```

**Allowed Origins (CORS):**
```
https://www.humanifylab.com
https://humanifylab.com
http://localhost:3050 (for development)
```

**Redirect URLs:**
```
https://www.humanifylab.com/*
https://humanifylab.com/*
```

### Step 4: Save Changes

Click "Save" or "Update" to apply the changes.

### Step 5: Regenerate Production Keys (If Needed)

If the domain change doesn't work, you may need to:

1. Go to **"API Keys"** in Clerk Dashboard
2. Click **"Regenerate"** for production keys
3. Copy the NEW production keys
4. Update them in Vercel:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Step 6: Redeploy on Vercel

After updating Clerk domain settings:

1. Go to Vercel Dashboard
2. Go to your project
3. Click "Deployments"
4. Click "Redeploy" on the latest deployment
5. OR push a new commit to trigger deployment

## Alternative: Create New Clerk Application

If you can't change the domain on the existing application, create a new one:

### Option A: Create New Application

1. In Clerk Dashboard, click **"+ Create Application"**
2. Name it: "HumanifyLab"
3. Configure domain as: `humanifylab.com`
4. Get the new production keys
5. Update Vercel environment variables

### Option B: Use the Old Domain

If you want to keep using `unrobotictext.com`:

1. Update your Vercel project domain to `unrobotictext.com`
2. Update DNS records
3. Update all references in your code

**Recommended:** Use Option A (create new application for humanifylab.com)

## Detailed Steps for Creating New Application

### 1. Create Application in Clerk

```
Dashboard → + Create Application
Name: HumanifyLab
```

### 2. Configure Application

**Home URL:**
```
https://www.humanifylab.com
```

**Sign-in URL:**
```
https://www.humanifylab.com/sign-in
```

**Sign-up URL:**
```
https://www.humanifylab.com/sign-up
```

**After sign-in URL:**
```
https://www.humanifylab.com
```

**After sign-up URL:**
```
https://www.humanifylab.com
```

### 3. Enable Authentication Methods

- ✅ Email address
- ✅ Password
- ✅ Google OAuth (optional)
- ✅ Email verification

### 4. Get Production Keys

Go to **API Keys** and copy:
```
Publishable Key: pk_live_xxxxxxxxxxxxx
Secret Key: sk_live_xxxxxxxxxxxxx
```

### 5. Update Vercel Environment Variables

**For Production Environment:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_new_key_here
CLERK_SECRET_KEY = sk_live_new_secret_here
```

Make sure to select **"Production"** environment only.

### 6. Redeploy

Push a commit or manually redeploy in Vercel.

## Verification Checklist

After making changes, verify:

- [ ] Clerk application domain is `humanifylab.com`
- [ ] Production keys are for the correct application
- [ ] Vercel environment variables are updated
- [ ] Vercel project is redeployed
- [ ] Visit https://www.humanifylab.com
- [ ] Click "Sign In" button
- [ ] Modal opens without errors
- [ ] Can create account and sign in

## Common Issues

### Issue 1: Keys Updated But Still Not Working

**Solution:** 
- Clear browser cache
- Try incognito/private window
- Check Vercel deployment logs
- Verify environment variables are in "Production" environment

### Issue 2: CORS Errors Still Appearing

**Solution:**
- In Clerk Dashboard → Domains
- Add both `www.humanifylab.com` and `humanifylab.com`
- Add `https://` prefix
- Save and wait 5 minutes for propagation

### Issue 3: Modal Opens But Shows Error

**Solution:**
- Check Clerk Dashboard → Logs
- Look for authentication errors
- Verify email settings are configured
- Check if email verification is required

## Testing After Fix

### Test on Production (humanifylab.com)

1. Visit https://www.humanifylab.com
2. Open browser console (F12)
3. Click "Sign In" button
4. Check for errors:
   - ✅ No CORS errors
   - ✅ No domain restriction errors
   - ✅ Modal opens
   - ✅ Can sign in/sign up

### Expected Console Output (Success)

```
✅ Clerk loaded successfully
✅ No CORS errors
✅ No domain errors
```

### Expected Console Output (Still Failing)

```
❌ Error: Production Keys are only allowed for domain "unrobotictext.com"
→ Domain not updated in Clerk Dashboard

❌ CORS error from clerk.humanifylab.com
→ Domain not added to allowed origins

❌ Failed to load Clerk
→ Keys not updated in Vercel
```

## Quick Fix Summary

**Most Likely Solution:**

1. Go to Clerk Dashboard
2. Settings → Domains
3. Change from `unrobotictext.com` to `humanifylab.com`
4. Save
5. Redeploy on Vercel
6. Test on production site

**If that doesn't work:**

1. Create NEW Clerk application for `humanifylab.com`
2. Get NEW production keys
3. Update Vercel environment variables
4. Redeploy
5. Test

---

**The core issue:** Your Clerk application is configured for `unrobotictext.com` but your site is `humanifylab.com`. You must update the domain in Clerk Dashboard.
