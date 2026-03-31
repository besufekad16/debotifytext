# FIX WEBHOOK SECRET NOW - Step by Step

## The Problem
Your webhook secret in Vercel doesn't match the one in Polar dashboard, causing signature validation to fail with 401 error.

## CRITICAL DISCOVERY
The Polar SDK **automatically base64 encodes** the secret internally. You must provide the **RAW secret** from Polar dashboard (the one starting with `polar_whs_`), NOT base64 encoded.

## Step-by-Step Fix

### Step 1: Get the Correct Secret from Polar

1. Open Polar Dashboard: https://polar.sh/dashboard
2. Go to: **Settings** → **Webhooks**
3. Find your webhook endpoint: `https://www.humanifylab.com/api/webhooks/polar`
4. Click on it to open details
5. Look for the **Webhook Secret** section
6. Click **"Show Secret"** or **"Copy Secret"**
7. You should see something like: `polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW`

**IMPORTANT**: 
- Copy the ENTIRE secret
- It should start with `polar_whs_`
- It should be about 50-60 characters long
- NO spaces, NO quotes, NO extra characters

### Step 2: Update Vercel Environment Variable

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: **humanifytext**
3. Go to: **Settings** → **Environment Variables**
4. Find: `POLAR_WEBHOOK_SECRET`
5. Click **Edit** (or **Add** if it doesn't exist)
6. Paste the secret you copied from Polar
7. Make sure it's set for: **Production**, **Preview**, and **Development**
8. Click **Save**

**VERIFY**:
- No spaces before or after the secret
- No quotes around the secret
- Starts with `polar_whs_`
- Matches EXACTLY what's in Polar dashboard

### Step 3: Redeploy

After saving the environment variable in Vercel:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Wait for deployment to complete (usually 1-2 minutes)

### Step 4: Test the Webhook

1. Go back to Polar Dashboard → Settings → Webhooks
2. Click on your webhook endpoint
3. Click **"Send Test Event"** or **"Test"** button
4. Check the delivery status:
   - ✅ **200 OK** = Success!
   - ❌ **401 Unauthorized** = Secret still doesn't match

### Step 5: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click **Logs** or **Functions**
3. Look for recent webhook requests
4. You should see:
   ```
   [Polar Webhook] Received webhook
   [Polar Webhook] Secret configured: { length: 55, prefix: 'polar_whs_2kt8K', startsCorrectly: true }
   [Polar Webhook] Headers received: { ... }
   [Polar Webhook] ✅ Signature validated successfully
   [Polar Webhook] Event type: checkout.created
   ```

If you see errors, check what they say:
- **"Secret doesn't start with 'polar_whs_'"** = Wrong secret format
- **"Secret contains spaces"** = Extra spaces in the secret
- **"Secret contains quotes"** = Remove quotes
- **"Secret seems too short"** = Incomplete secret

## Common Mistakes to Avoid

### ❌ WRONG - Has quotes
```
POLAR_WEBHOOK_SECRET="polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW"
```

### ❌ WRONG - Has spaces
```
POLAR_WEBHOOK_SECRET= polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW 
```

### ❌ WRONG - Truncated
```
POLAR_WEBHOOK_SECRET=polar_whs_2kt8KqKQ...
```

### ❌ WRONG - Base64 encoded
```
POLAR_WEBHOOK_SECRET=cG9sYXJfd2hzXzJrdDhLcUtRZXJWZG1zaTVGWTVmZ0t0d2tjYnhnZ3QzUkwxMDgxNmNHb1c=
```

### ✅ CORRECT
```
POLAR_WEBHOOK_SECRET=polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW
```

## Troubleshooting

### Still Getting 401 After Following All Steps?

1. **Double-check the secret matches**:
   - Copy it again from Polar dashboard
   - Delete the old one in Vercel
   - Add it fresh
   - Redeploy

2. **Check if webhook endpoint is correct**:
   - URL in Polar: `https://www.humanifylab.com/api/webhooks/polar`
   - Must be HTTPS (not HTTP)
   - Must be exact (no trailing slash)

3. **Verify webhook is enabled**:
   - In Polar dashboard, check if endpoint is enabled
   - If disabled, enable it

4. **Check Vercel logs for specific errors**:
   - The new code will tell you exactly what's wrong
   - Look for "Potential secret issues" in logs

### Use the Debug Endpoint

I created a debug endpoint to help you verify:

1. Deploy the latest code
2. Visit: `https://www.humanifylab.com/api/webhooks/polar/debug`
3. You should see:
   ```json
   {
     "configured": true,
     "secretLength": 55,
     "secretPrefix": "polar_whs_2kt8K",
     "secretSuffix": "16cGoW",
     "startsWithPolarWhs": true,
     "hasSpaces": false,
     "hasQuotes": false,
     "message": "If this shows correct values, the secret is configured in Vercel..."
   }
   ```

If any of these values are wrong, you know what to fix!

**DELETE THIS DEBUG ENDPOINT** after you've fixed the issue (delete the file `src/app/api/webhooks/polar/debug/route.ts`)

## What Happens After Fix

Once the webhook secret is correct:

1. ✅ Webhooks will return 200 OK
2. ✅ Users can complete checkout
3. ✅ Subscriptions will be created
4. ✅ User credits will be updated automatically
5. ✅ No more 401 errors

## Need More Help?

If you've tried everything and it's still not working:

1. Check the Vercel logs for the exact error message
2. Make sure you redeployed after changing the environment variable
3. Try regenerating the webhook secret in Polar dashboard
4. Contact me with the Vercel logs

## Quick Checklist

- [ ] Copied webhook secret from Polar dashboard
- [ ] Secret starts with `polar_whs_`
- [ ] Secret has no spaces or quotes
- [ ] Added/updated secret in Vercel environment variables
- [ ] Set for Production, Preview, and Development
- [ ] Redeployed the application
- [ ] Tested webhook from Polar dashboard
- [ ] Got 200 OK response
- [ ] Checked Vercel logs show success

---

**The code is correct. The only issue is the webhook secret configuration in Vercel.**
