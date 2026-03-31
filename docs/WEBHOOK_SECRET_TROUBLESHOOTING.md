# Polar Webhook Secret Troubleshooting Guide

## Current Issue
Getting 401 error: "Invalid signature" with details "No matching signature found"

## Root Cause
The webhook secret in your `.env` file doesn't match what Polar is using to sign the webhooks. This can happen if:
1. The secret was regenerated in Polar dashboard but not updated in `.env`
2. The secret was copied incorrectly (extra spaces, missing characters)
3. The webhook endpoint was created with a different secret

## Solution Steps

### Step 1: Regenerate Webhook Secret in Polar Dashboard

1. Go to https://polar.sh/dashboard
2. Navigate to Settings → Webhooks
3. Find your webhook endpoint (https://www.humanifylab.com/api/webhooks/polar)
4. Click "Edit" or "Settings"
5. Click "Regenerate Secret" or "Show Secret"
6. **COPY THE ENTIRE SECRET** (it should start with `polar_whs_`)

### Step 2: Update Your .env File

1. Open `Humanify/.env`
2. Find the line: `POLAR_WEBHOOK_SECRET=polar_whs_...`
3. Replace the entire value with the new secret from Step 1
4. **IMPORTANT**: Make sure there are NO spaces before or after the secret
5. **IMPORTANT**: Make sure the secret is on a single line
6. Save the file

Example:
```env
# WRONG - has spaces
POLAR_WEBHOOK_SECRET= polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW 

# WRONG - has quotes
POLAR_WEBHOOK_SECRET="polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW"

# CORRECT
POLAR_WEBHOOK_SECRET=polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW
```

### Step 3: Redeploy Your Application

If you're using Vercel:
```bash
cd Humanify
git add .env
git commit -m "Update Polar webhook secret"
git push
```

Or manually update the environment variable in Vercel dashboard:
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Find `POLAR_WEBHOOK_SECRET`
5. Click Edit
6. Paste the new secret
7. Click Save
8. Redeploy your application

### Step 4: Test the Webhook

1. Go to Polar dashboard → Settings → Webhooks
2. Find your webhook endpoint
3. Click "Test" to send a test event
4. Check the delivery status - it should show 200 OK
5. Check your application logs for:
   ```
   [Polar Webhook] Received webhook
   [Polar Webhook] Headers received: { ... }
   [Polar Webhook] Signature validated successfully
   [Polar Webhook] Event type: checkout.created
   ```

## Alternative: Create a New Webhook Endpoint

If the above doesn't work, create a fresh webhook endpoint:

1. **Delete the old endpoint** in Polar dashboard
2. **Create a new endpoint**:
   - URL: `https://www.humanifylab.com/api/webhooks/polar`
   - Events: Select all checkout, order, and subscription events
   - Generate a new secret
3. **Copy the new secret** to your `.env` file
4. **Redeploy** your application
5. **Test** the webhook

## Debugging: Check Application Logs

After deploying, trigger a webhook and check your logs for these messages:

### Success Pattern:
```
[Polar Webhook] Received webhook
[Polar Webhook] Headers received: {
  'webhook-id': 'xxx',
  'webhook-timestamp': 'xxx',
  'webhook-signature': 'present',
  allHeaderKeys: ['webhook-id', 'webhook-timestamp', 'webhook-signature']
}
[Polar Webhook] Signature validated successfully
[Polar Webhook] Event type: checkout.created
```

### Failure Pattern:
```
[Polar Webhook] Received webhook
[Polar Webhook] Headers received: { ... }
[Polar Webhook] Signature validation FAILED
[Polar Webhook] Error: Error: No matching signature found
[Polar Webhook] Secret starts with: polar_whs_2kt
```

If you see the failure pattern, the secret is definitely wrong.

## Common Mistakes

### 1. Wrong Secret Format
- ❌ Secret has quotes: `"polar_whs_..."`
- ❌ Secret has spaces: ` polar_whs_...`
- ❌ Secret is truncated: `polar_whs_2kt8KqKQ...`
- ✅ Secret is clean: `polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW`

### 2. Environment Variable Not Updated
- Make sure you updated the `.env` file
- Make sure you redeployed after updating
- Make sure Vercel has the updated environment variable

### 3. Wrong Webhook URL
- Make sure the URL in Polar dashboard is: `https://www.humanifylab.com/api/webhooks/polar`
- NOT: `http://...` (must be HTTPS)
- NOT: `https://www.humanifylab.com/webhooks/polar` (missing /api)
- NOT: `https://humanifylab.com/...` (missing www)

### 4. Webhook Endpoint Disabled
- Polar disables endpoints after 10 failed deliveries
- Check if your endpoint is enabled in Polar dashboard
- Re-enable it if needed

## Verification Checklist

- [ ] Copied the webhook secret from Polar dashboard
- [ ] Updated `POLAR_WEBHOOK_SECRET` in `.env` file
- [ ] No spaces or quotes around the secret
- [ ] Redeployed the application
- [ ] Webhook URL is correct in Polar dashboard
- [ ] Webhook endpoint is enabled in Polar dashboard
- [ ] Tested the webhook from Polar dashboard
- [ ] Checked application logs for success message

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Check the webhook secret one more time**:
   ```bash
   # In your .env file, the secret should be exactly as shown in Polar dashboard
   # No extra characters, no spaces, no quotes
   ```

2. **Try the Polar SDK helper** (alternative approach):
   ```bash
   npm install @polar-sh/nextjs
   ```
   
   Then replace the webhook handler with:
   ```typescript
   import { Webhooks } from "@polar-sh/nextjs";
   
   export const POST = Webhooks({
     webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
     onCheckoutCreated: async (payload) => {
       console.log("Checkout created:", payload.data.id);
     },
     onSubscriptionCreated: async (payload) => {
       // Handle subscription
     },
   });
   ```

3. **Contact Polar Support**:
   - Join Polar Discord: https://discord.gg/polar
   - Email: support@polar.sh
   - Provide them with:
     - Your webhook endpoint URL
     - The delivery ID from the failed webhook
     - Your organization ID

## Next Steps After Fix

Once the webhook is working:
1. Test a real subscription purchase
2. Verify user credits are updated
3. Check that subscription details are stored
4. Monitor webhook deliveries in Polar dashboard

## Related Files
- `Humanify/.env` - Environment variables
- `Humanify/src/app/api/webhooks/polar/route.ts` - Webhook handler
- `Humanify/WEBHOOK_SIGNATURE_FIX.md` - Original fix documentation
