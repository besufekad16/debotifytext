# Step-by-Step Guide: Update Domain in Clerk Dashboard

## Step 1: Log in to Clerk Dashboard

1. Open your browser
2. Go to: **https://dashboard.clerk.com**
3. Log in with your Clerk account credentials

---

## Step 2: Select Your Application

1. You'll see a list of your applications
2. Look for the application that's currently using `unrobotictext.com`
3. **Click on the application name** to open it

**What you'll see:**
- Application name (e.g., "Unrobotic" or "HumanifyLab")
- A list of applications if you have multiple

---

## Step 3: Go to Settings

Once inside your application:

1. Look at the **left sidebar**
2. Scroll down and find **"Settings"** (usually near the bottom)
3. **Click on "Settings"**

**Alternative locations:**
- Some Clerk versions have it under **"Configure"** → **"Settings"**
- Or look for a gear icon ⚙️

---

## Step 4: Find Domain/URL Settings

In the Settings page, look for one of these sections:

### Option A: "Paths" Section
1. Look for **"Paths"** in the settings menu
2. Click on **"Paths"**
3. You'll see URL configuration options

### Option B: "General" Section
1. Look for **"General"** settings
2. Scroll down to find URL/Domain settings

### Option C: "Domains" Section
1. Some Clerk versions have a dedicated **"Domains"** section
2. Click on it directly from the sidebar

---

## Step 5: Update the URLs

You'll see several URL fields. Update ALL of them from `unrobotictext.com` to `humanifylab.com`:

### Home URL
```
OLD: https://unrobotictext.com
NEW: https://www.humanifylab.com
```

### Sign-in URL
```
OLD: https://unrobotictext.com/sign-in
NEW: https://www.humanifylab.com/sign-in
```

### Sign-up URL
```
OLD: https://unrobotictext.com/sign-up
NEW: https://www.humanifylab.com/sign-up
```

### After sign-in redirect
```
OLD: https://unrobotictext.com
NEW: https://www.humanifylab.com
```

### After sign-up redirect
```
OLD: https://unrobotictext.com
NEW: https://www.humanifylab.com
```

---

## Step 6: Add Allowed Origins (CORS)

Look for **"Allowed origins"** or **"CORS origins"** section:

1. Click **"Add origin"** or **"Add domain"**
2. Add these URLs one by one:
   ```
   https://www.humanifylab.com
   https://humanifylab.com
   http://localhost:3050
   ```

**Important:** Include both `www` and non-`www` versions!

---

## Step 7: Save Changes

1. Scroll to the bottom of the page
2. Click **"Save"** or **"Save changes"** button
3. Wait for confirmation message (usually green banner at top)

---

## Step 8: Verify Domain Change

1. Stay in Clerk Dashboard
2. Go to **"API Keys"** in the sidebar
3. Look at your **Production keys**
4. You should see they're now associated with `humanifylab.com`

**If keys still show `unrobotictext.com`:**
- You may need to regenerate them (see Step 9)

---

## Step 9: Regenerate Keys (If Needed)

If the domain change doesn't automatically update the keys:

1. Go to **"API Keys"** in sidebar
2. Find **"Production"** section
3. Click **"Regenerate"** or **"Rotate keys"**
4. Confirm the regeneration
5. **Copy the NEW keys:**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)

---

## Step 10: Update Vercel Environment Variables

Now update the keys in Vercel:

1. Go to **https://vercel.com/dashboard**
2. Select your **HumanifyLab** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in sidebar
5. Find `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`:
   - Click **"Edit"** (pencil icon)
   - Paste the NEW publishable key
   - Make sure **"Production"** is selected
   - Click **"Save"**
6. Find `CLERK_SECRET_KEY`:
   - Click **"Edit"**
   - Paste the NEW secret key
   - Make sure **"Production"** is selected
   - Click **"Save"**

---

## Step 11: Redeploy on Vercel

After updating environment variables:

1. Stay in Vercel Dashboard
2. Go to **"Deployments"** tab
3. Find the latest deployment
4. Click the **three dots (...)** menu
5. Click **"Redeploy"**
6. Confirm the redeployment
7. Wait for deployment to complete (2-5 minutes)

---

## Step 12: Test on Production

Once deployment is complete:

1. Open a new browser tab (or incognito window)
2. Go to **https://www.humanifylab.com**
3. Open browser console (Press **F12**)
4. Click **"Sign In"** or **"Get Started Free"** button
5. **Modal should open!** ✅

### Expected Result:
- ✅ Modal opens
- ✅ No CORS errors in console
- ✅ No domain restriction errors
- ✅ Can sign in/sign up

### If Still Not Working:
- Check console for errors
- Verify Vercel deployment completed
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private window

---

## Alternative: Create New Application (If Update Doesn't Work)

If updating the domain doesn't work, create a fresh application:

### Step 1: Create New Application
1. In Clerk Dashboard, click **"+ Create Application"** (top right)
2. **Application name:** HumanifyLab
3. Click **"Create application"**

### Step 2: Configure New Application
1. Go to **"Settings"** → **"Paths"**
2. Set **Home URL:** `https://www.humanifylab.com`
3. Set **Sign-in URL:** `https://www.humanifylab.com/sign-in`
4. Set **Sign-up URL:** `https://www.humanifylab.com/sign-up`
5. Click **"Save"**

### Step 3: Get New Keys
1. Go to **"API Keys"**
2. Copy **Production keys:**
   - Publishable key (pk_live_...)
   - Secret key (sk_live_...)

### Step 4: Update Vercel
1. Go to Vercel → Settings → Environment Variables
2. Update both keys
3. Redeploy

---

## Troubleshooting

### Issue: Can't Find "Settings" or "Domains"

**Solution:**
- Look for **"Configure"** in sidebar
- Or look for gear icon ⚙️
- Or check under **"Application"** menu

### Issue: Domain Field is Grayed Out

**Solution:**
- You might be on a free plan with restrictions
- Try creating a new application instead
- Contact Clerk support

### Issue: Changes Not Taking Effect

**Solution:**
1. Wait 5 minutes for propagation
2. Clear browser cache
3. Redeploy on Vercel
4. Try incognito window

### Issue: Still Shows Old Domain

**Solution:**
- Regenerate the production keys
- Create a new application
- Contact Clerk support at support@clerk.com

---

## Quick Checklist

Before testing, verify:

- [ ] Clerk domain updated to `humanifylab.com`
- [ ] Allowed origins include `www.humanifylab.com`
- [ ] Production keys copied (if regenerated)
- [ ] Vercel environment variables updated
- [ ] Vercel project redeployed
- [ ] Deployment completed successfully
- [ ] Browser cache cleared

---

## Need Help?

If you're stuck at any step:

1. **Take a screenshot** of what you see in Clerk Dashboard
2. **Check Clerk documentation:** https://clerk.com/docs
3. **Contact Clerk support:** support@clerk.com
4. **Join Clerk Discord:** https://clerk.com/discord

---

**Most Important Steps:**
1. Update domain in Clerk Settings
2. Update Vercel environment variables
3. Redeploy on Vercel
4. Test on production site

That's it! Your sign-in buttons should now work on humanifylab.com! 🎉
