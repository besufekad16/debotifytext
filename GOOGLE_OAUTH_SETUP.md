# Google OAuth Setup for Clerk - Complete Guide

## Google OAuth Redirect URLs

Since you're using **Clerk** for authentication, Google OAuth is handled by Clerk, not directly by your application.

---

## Redirect URLs for Google Cloud Console

### For Development (localhost)

```
http://localhost:3050/v1/oauth_callback
```

### For Production (humanifylab.com)

```
https://www.humanifylab.com/v1/oauth_callback
https://humanifylab.com/v1/oauth_callback
```

**Note:** The exact redirect URI format depends on your Clerk configuration. Follow the steps below to get the exact URLs from Clerk.

---

## Step-by-Step Setup

### Step 1: Get Redirect URI from Clerk Dashboard

1. **Go to Clerk Dashboard**
   - Visit: https://dashboard.clerk.com
   - Log in
   - Select your application

2. **Go to Social Connections**
   - Look in the left sidebar
   - Click **"User & Authentication"** or **"Authentication"**
   - Click **"Social Connections"** or **"Social Login"**

3. **Find Google**
   - Look for **Google** in the list of providers
   - Click on **Google** or click **"Configure"** next to it

4. **Copy Redirect URI**
   - You'll see a section called **"Authorized redirect URIs"** or **"Redirect URI"**
   - Copy the exact URL shown (it will look like one of these):
     ```
     https://clerk.humanifylab.com/v1/oauth_callback
     https://loved-joey-24.clerk.accounts.dev/v1/oauth_callback
     ```
   - **This is the exact URL you need!** ✅

---

### Step 2: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Log in with your Google account

2. **Create or Select Project**
   - Click the project dropdown at the top
   - Click **"New Project"**
   - **Project name**: HumanifyLab
   - Click **"Create"**
   - Wait for project to be created
   - Select the project

3. **Enable Google+ API**
   - In the left sidebar, click **"APIs & Services"** → **"Library"**
   - Search for **"Google+ API"**
   - Click on it
   - Click **"Enable"**

4. **Configure OAuth Consent Screen**
   - Go to **"APIs & Services"** → **"OAuth consent screen"**
   - Select **"External"** (unless you have Google Workspace)
   - Click **"Create"**
   - Fill in required fields:
     - **App name**: HumanifyLab
     - **User support email**: humanifylab1@gmail.com
     - **Developer contact email**: humanifylab1@gmail.com
   - Click **"Save and Continue"**
   - **Scopes**: Click **"Add or Remove Scopes"**
     - Select: `userinfo.email`, `userinfo.profile`, `openid`
     - Click **"Update"**
     - Click **"Save and Continue"**
   - **Test users**: (Optional for development)
     - Add your email for testing
     - Click **"Save and Continue"**
   - Click **"Back to Dashboard"**

5. **Create OAuth Credentials**
   - Go to **"APIs & Services"** → **"Credentials"**
   - Click **"+ Create Credentials"** at the top
   - Select **"OAuth client ID"**
   - **Application type**: Web application
   - **Name**: HumanifyLab Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3050
     https://www.humanifylab.com
     https://humanifylab.com
     ```
   - **Authorized redirect URIs**:
     - Paste the redirect URI you copied from Clerk (Step 1)
     - Example:
       ```
       https://clerk.humanifylab.com/v1/oauth_callback
       ```
     - For development, also add:
       ```
       https://loved-joey-24.clerk.accounts.dev/v1/oauth_callback
       ```
   - Click **"Create"**

6. **Copy Credentials**
   - You'll see a popup with:
     - **Client ID**: `xxxxx.apps.googleusercontent.com`
     - **Client Secret**: `GOCSPX-xxxxx`
   - **Copy both!** You'll need them in the next step.

---

### Step 3: Add Google Credentials to Clerk

1. **Go back to Clerk Dashboard**
   - Go to **"Social Connections"** → **"Google"**

2. **Enable Google**
   - Toggle **"Enable Google"** to ON

3. **Add Credentials**
   - **Client ID**: Paste the Client ID from Google Cloud Console
   - **Client Secret**: Paste the Client Secret from Google Cloud Console

4. **Save**
   - Click **"Save"** or **"Apply changes"**

---

### Step 4: Update .env File (Optional)

If you want to store Google credentials in your `.env` file for reference:

```env
# Google OAuth (for Clerk social login)
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-actual-client-secret
```

**Note:** These are already configured in Clerk, so you don't need to use them in your code. This is just for reference.

---

### Step 5: Test Google Sign-In

1. **Restart dev server** (if running):
   ```bash
   npm run dev
   ```

2. **Open localhost:3050**

3. **Click "Sign In" or "Get Started Free"**

4. **Click "Continue with Google"**

5. **Expected result:**
   - ✅ Google sign-in popup opens
   - ✅ Can select Google account
   - ✅ Redirects back to your app
   - ✅ User is signed in

---

## For Production Deployment

When deploying to humanifylab.com:

### 1. Update Google Cloud Console

1. Go to **Google Cloud Console** → **Credentials**
2. Click on your OAuth client
3. **Authorized redirect URIs**:
   - Make sure you have:
     ```
     https://clerk.humanifylab.com/v1/oauth_callback
     ```
   - Or the exact redirect URI from Clerk production app
4. **Authorized JavaScript origins**:
   ```
   https://www.humanifylab.com
   https://humanifylab.com
   ```
5. Click **"Save"**

### 2. Verify Clerk Configuration

1. Go to Clerk Dashboard (production app)
2. **Social Connections** → **Google**
3. Make sure:
   - ✅ Google is enabled
   - ✅ Client ID and Secret are correct
   - ✅ Redirect URI matches what's in Google Cloud Console

---

## Common Redirect URI Formats

Depending on your Clerk setup, the redirect URI will be one of these formats:

### Format 1: Custom Domain (Most Common)
```
https://clerk.humanifylab.com/v1/oauth_callback
```

### Format 2: Clerk Subdomain
```
https://your-app-name.clerk.accounts.dev/v1/oauth_callback
```

### Format 3: Development Instance
```
https://loved-joey-24.clerk.accounts.dev/v1/oauth_callback
```

**Always use the exact URL shown in Clerk Dashboard!**

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** The redirect URI in Google Cloud Console doesn't match the one Clerk is using.

**Solution:**
1. Go to Clerk Dashboard → Social Connections → Google
2. Copy the exact redirect URI shown
3. Go to Google Cloud Console → Credentials
4. Edit your OAuth client
5. Add the exact redirect URI from Clerk
6. Save

### Error: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured or app not verified.

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Make sure all required fields are filled
3. For development, add your email to test users
4. For production, submit app for verification (if needed)

### Error: "Google sign-in button not showing"

**Cause:** Google not enabled in Clerk or credentials not configured.

**Solution:**
1. Go to Clerk Dashboard → Social Connections
2. Make sure Google is toggled ON
3. Make sure Client ID and Secret are filled in
4. Save changes
5. Clear browser cache
6. Restart dev server

---

## Summary

**Quick steps:**

1. ✅ Get redirect URI from Clerk Dashboard → Social Connections → Google
2. ✅ Create OAuth credentials in Google Cloud Console
3. ✅ Add redirect URI from Clerk to Google Cloud Console
4. ✅ Copy Client ID and Secret from Google Cloud Console
5. ✅ Add Client ID and Secret to Clerk Dashboard
6. ✅ Enable Google in Clerk
7. ✅ Test sign-in

**Redirect URI format:**
```
https://clerk.humanifylab.com/v1/oauth_callback
```
(or whatever Clerk shows you)

That's it! Google OAuth will work through Clerk. 🎉
