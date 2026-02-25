# Clerk Sign-In/Sign-Up Not Working - Troubleshooting Guide

## Date: February 25, 2026

## Problem

Sign-in, sign-up, and "Get Started Free" buttons are not working when clicked.

## Most Likely Causes

### 1. Missing Clerk Environment Variables ⚠️

The most common issue is missing or incorrect Clerk API keys.

#### Check Your .env File

Open your `.env` file and verify these variables are set:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

#### Get Your Clerk Keys

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "API Keys" in the sidebar
4. Copy both keys:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`

#### Update .env File

```env
# Replace with your actual keys from Clerk Dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
```

### 2. Vercel Environment Variables Not Set

If deploying to Vercel, you need to set the environment variables there too.

#### Set in Vercel Dashboard

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add both variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_test_xxxxx`
   - `CLERK_SECRET_KEY` = `sk_test_xxxxx`
5. Select all environments (Production, Preview, Development)
6. Click "Save"
7. Redeploy your project

### 3. Clerk Application Not Configured

#### Check Clerk Dashboard Settings

1. Go to https://dashboard.clerk.com
2. Select your application
3. Verify these settings:

**Application URLs:**
- Development: `http://localhost:3050`
- Production: `https://www.humanifylab.com`

**Sign-in Options:**
- Email address: ✅ Enabled
- Password: ✅ Enabled
- Google OAuth: ✅ Enabled (optional)

**Redirect URLs:**
- Sign-in redirect: `/`
- Sign-up redirect: `/`
- After sign-out: `/`

## Quick Fix Steps

### Step 1: Verify Local Environment

```bash
# Check if .env file exists
ls -la .env

# Check if Clerk keys are set (should show pk_test and sk_test)
grep CLERK .env
```

### Step 2: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

### Step 3: Check Browser Console

1. Open your browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Click a sign-in button
5. Look for errors

**Common Errors:**

```
❌ "Clerk: Missing publishable key"
→ Solution: Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env

❌ "Clerk: Invalid publishable key"
→ Solution: Check key format (should start with pk_test_ or pk_live_)

❌ "Network error"
→ Solution: Check internet connection, Clerk service status
```

### Step 4: Test Sign-In Modal

```bash
# In browser console, test if Clerk is loaded
window.Clerk

# Should show Clerk object, not undefined
```

## Detailed Troubleshooting

### Check 1: Environment Variables Loaded

Create a test page to verify environment variables:

```typescript
// src/app/test-clerk/page.tsx
export default function TestClerk() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  return (
    <div>
      <h1>Clerk Configuration Test</h1>
      <p>Publishable Key: {publishableKey ? '✅ Set' : '❌ Missing'}</p>
      <p>Key Preview: {publishableKey?.substring(0, 20)}...</p>
    </div>
  );
}
```

Visit `/test-clerk` and check if the key is shown.

### Check 2: Clerk Provider Loaded

Verify Clerk is properly wrapped in your app:

```typescript
// src/app/layout.tsx should have:
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Check 3: Button Implementation

Verify buttons are using correct Clerk components:

```typescript
// Should look like this:
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal">
  <Button>Sign In</Button>
</SignInButton>

<SignUpButton mode="modal">
  <Button>Get Started Free</Button>
</SignUpButton>
```

### Check 4: Middleware Configuration

Verify middleware allows sign-in/sign-up routes:

```typescript
// src/middleware.ts
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',  // ✅ Should be here
  '/sign-up(.*)',  // ✅ Should be here
  // ...
])
```

## Testing After Fix

### Test 1: Click Sign-In Button
1. Go to homepage
2. Click "Log in" or "Sign In"
3. Modal should open with sign-in form
4. Try signing in with email/password

### Test 2: Click Sign-Up Button
1. Go to homepage
2. Click "Get Started Free" or "Sign Up"
3. Modal should open with sign-up form
4. Try creating an account

### Test 3: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Click sign-in button
4. Should see requests to `clerk.com` or `clerk.dev`

## Common Issues & Solutions

### Issue 1: Modal Opens But Shows Error

**Error:** "Application not found"
**Solution:** 
- Check if Clerk application exists in dashboard
- Verify publishable key matches the application

### Issue 2: Modal Opens But Can't Sign In

**Error:** "Invalid credentials"
**Solution:**
- Create a new account first
- Check if email verification is required
- Verify password meets requirements

### Issue 3: Modal Doesn't Open At All

**Possible Causes:**
1. JavaScript error blocking modal
2. Missing Clerk publishable key
3. Clerk script not loaded
4. Browser blocking popups

**Solutions:**
1. Check browser console for errors
2. Verify environment variables
3. Check network tab for failed requests
4. Disable popup blockers

### Issue 4: Works Locally But Not on Vercel

**Solution:**
1. Set environment variables in Vercel Dashboard
2. Make sure to select all environments
3. Redeploy after adding variables
4. Clear browser cache

## Verification Checklist

- [ ] `.env` file exists with Clerk keys
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_test_` or `pk_live_`
- [ ] `CLERK_SECRET_KEY` starts with `sk_test_` or `sk_live_`
- [ ] Development server restarted after adding keys
- [ ] Vercel environment variables set (if deployed)
- [ ] Clerk application configured in dashboard
- [ ] Application URLs match your domain
- [ ] Browser console shows no errors
- [ ] Network tab shows requests to Clerk

## Quick Test Commands

```bash
# Check if environment variables are set
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Restart development server
npm run dev

# Build and test locally
npm run build
npm run start
```

## Still Not Working?

### Option 1: Check Clerk Status
Visit https://status.clerk.com to see if Clerk services are operational.

### Option 2: Check Clerk Logs
1. Go to Clerk Dashboard
2. Navigate to "Logs" section
3. Look for failed authentication attempts
4. Check error messages

### Option 3: Contact Support
If nothing works:
1. Check Clerk documentation: https://clerk.com/docs
2. Join Clerk Discord: https://clerk.com/discord
3. Contact Clerk support: support@clerk.com

## Expected Behavior After Fix

### ✅ Sign-In Button
- Click button → Modal opens
- Enter email/password → Sign in successful
- Redirected to homepage (signed in)

### ✅ Sign-Up Button
- Click button → Modal opens
- Enter email/password → Account created
- Email verification sent (if enabled)
- Redirected to homepage (signed in)

### ✅ Get Started Free Button
- Same as Sign-Up button
- Opens sign-up modal
- Creates new account

---

**Most Common Fix:** Add Clerk keys to `.env` file and restart server!

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
```

Then restart:
```bash
npm run dev
```
