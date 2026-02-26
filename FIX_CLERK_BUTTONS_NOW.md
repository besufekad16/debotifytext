# Fix Clerk Sign-In Buttons - Complete Solution

## Current Situation

You have TEST keys in your `.env` file (which is correct for localhost), but the sign-in/sign-up buttons are not working due to CORS errors.

## The Problem

Your Clerk application is configured for `humanifylab.com` domain, but you're trying to use it on `localhost:3050`. Even with test keys, Clerk needs to have localhost added to the allowed origins.

---

## Solution (5 Steps)

### Step 1: Verify Your Keys (2 minutes)

Run this command to check your Clerk configuration:

```bash
node check-clerk-config.js
```

**Expected output:**
```
✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set
   Type: TEST KEY (for development/localhost) ✅
   Domain: loved-joey-24.clerk.accounts.dev

✅ CLERK_SECRET_KEY is set
   Type: TEST KEY (for development/localhost) ✅
```

If you see this, your keys are correct! ✅ Move to Step 2.

If you see PRODUCTION keys or missing keys, go to Clerk Dashboard and get TEST keys first.

---

### Step 2: Configure Clerk Dashboard (5 minutes)

1. **Open Clerk Dashboard**
   - Go to: https://dashboard.clerk.com
   - Log in
   - Select your application

2. **Go to Settings**
   - Look in the left sidebar
   - Click **"Settings"** or **"Configure"**

3. **Find Domains/Paths Section**
   - Look for **"Domains"**, **"Paths"**, or **"URLs"**
   - Click on it

4. **Add Allowed Origins**
   - Look for **"Allowed origins"** or **"CORS origins"**
   - Click **"Add origin"** or **"Add domain"**
   - Add these URLs one by one:
     ```
     http://localhost:3050
     http://localhost:3000
     http://127.0.0.1:3050
     ```

5. **Configure Redirect URLs** (if available)
   - **Home URL**: `http://localhost:3050`
   - **Sign-in URL**: `http://localhost:3050/sign-in`
   - **Sign-up URL**: `http://localhost:3050/sign-up`
   - **After sign-in**: `http://localhost:3050`
   - **After sign-up**: `http://localhost:3050`

6. **Save Changes**
   - Scroll to bottom
   - Click **"Save"** or **"Save changes"**
   - Wait for confirmation message

---

### Step 3: Clear Everything (2 minutes)

1. **Close all browser tabs** with localhost:3050

2. **Clear browser cache**:
   - **Chrome**: Press `Ctrl+Shift+Delete`
     - Select "Cached images and files"
     - Click "Clear data"
   - **Or use Incognito/Private window** (easier!)

3. **Stop your dev server**:
   - Press `Ctrl+C` in terminal

---

### Step 4: Restart Dev Server (1 minute)

```bash
npm run dev
```

Wait for:
```
✓ Ready in 2.5s
○ Local: http://localhost:3050
```

---

### Step 5: Test (1 minute)

1. **Open fresh browser tab** (or incognito window)
2. Go to: http://localhost:3050
3. **Open browser console**: Press `F12`
4. Click **"Sign In"** or **"Get Started Free"** button

**Expected result:**
- ✅ Modal opens
- ✅ No CORS errors in console
- ✅ Can sign in/sign up

---

## If Still Not Working

### Check Console Errors

Press `F12` → Console tab. Look for errors:

#### Error 1: "Production Keys are only allowed for domain..."
**Solution:** You're using production keys. Switch to test keys.
```bash
# In .env file, make sure you have:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### Error 2: "Access to clerk.xxx blocked from localhost"
**Solution:** Localhost not added to Clerk allowed origins.
- Go back to Step 2
- Make sure you added `http://localhost:3050` to allowed origins
- Save and wait 1-2 minutes for changes to propagate

#### Error 3: "Failed to load Clerk"
**Solution:** Network or configuration issue.
- Check your internet connection
- Try incognito window
- Clear cache again
- Restart dev server

---

## Alternative: Create New Development Application

If updating settings doesn't work, create a fresh Clerk application for development:

### 1. Create New Application

1. In Clerk Dashboard, click **"+ Create Application"** (top right)
2. **Name**: HumanifyLab Development
3. Click **"Create application"**

### 2. Get Keys

1. You'll see the API keys immediately
2. Copy **Development keys** (pk_test_ and sk_test_)

### 3. Update .env

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_new_key_here
CLERK_SECRET_KEY=sk_test_your_new_secret_here
```

### 4. Configure Localhost

1. Go to Settings → Domains
2. Add allowed origin: `http://localhost:3050`
3. Save

### 5. Test

```bash
npm run dev
```

Open http://localhost:3050 and test buttons.

---

## For Production Deployment

When you're ready to deploy to humanifylab.com:

### 1. Use Production Keys

In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_xxxxx
CLERK_SECRET_KEY = sk_live_xxxxx
Environment: Production
```

### 2. Configure Production Domain in Clerk

1. Go to Clerk Dashboard
2. Settings → Domains
3. **Home URL**: `https://www.humanifylab.com`
4. **Allowed origins**:
   ```
   https://www.humanifylab.com
   https://humanifylab.com
   ```
5. Save

### 3. Redeploy on Vercel

1. Vercel Dashboard → Deployments
2. Click latest deployment → "..." menu → "Redeploy"
3. Wait for deployment to complete

---

## Quick Checklist

Before testing, verify:

- [ ] Using TEST keys in `.env` (pk_test_ and sk_test_)
- [ ] Ran `node check-clerk-config.js` to verify keys
- [ ] Added `http://localhost:3050` to Clerk allowed origins
- [ ] Saved changes in Clerk Dashboard
- [ ] Closed all browser tabs
- [ ] Cleared browser cache (or using incognito)
- [ ] Restarted dev server (`npm run dev`)
- [ ] Testing in fresh browser tab

---

## Common Mistakes

❌ **Using production keys on localhost**
- Production keys only work on your configured domain
- Use test keys for localhost

❌ **Not adding localhost to allowed origins**
- Even with test keys, you need to add localhost to Clerk

❌ **Not clearing browser cache**
- Old Clerk scripts can be cached
- Use incognito window or clear cache

❌ **Not restarting dev server**
- Environment variables are loaded at startup
- Always restart after changing .env

❌ **Testing too quickly after saving Clerk settings**
- Wait 1-2 minutes for changes to propagate
- Clear cache and try again

---

## Need Help?

If you're still stuck after following all steps:

1. **Run diagnostic script**:
   ```bash
   node check-clerk-config.js
   ```

2. **Check console errors**:
   - Press F12 → Console tab
   - Copy all errors

3. **Check network errors**:
   - Press F12 → Network tab
   - Filter by "clerk"
   - Look for failed requests

4. **Share information**:
   - Screenshot of Clerk Dashboard → Settings → Domains
   - Console errors
   - Output of diagnostic script

---

## Summary

**The fix is simple:**

1. ✅ You already have TEST keys (correct!)
2. ➕ Add `http://localhost:3050` to Clerk allowed origins
3. 🧹 Clear cache
4. 🔄 Restart server
5. ✅ Test buttons

That's it! Your sign-in buttons will work. 🎉
