# Webhook Signature Fix - Final Summary

## Problem
Users getting 401 error when subscribing: "Invalid signature" with "No matching signature found"

## Root Cause
The webhook secret in your `.env` file doesn't match the secret configured in Polar dashboard. This causes signature validation to fail.

## Solution

### IMMEDIATE ACTION REQUIRED:

1. **Go to Polar Dashboard**:
   - Visit: https://polar.sh/dashboard
   - Navigate to: Settings → Webhooks
   - Find your endpoint: `https://www.humanifylab.com/api/webhooks/polar`

2. **Get the Correct Secret**:
   - Click on your webhook endpoint
   - Click "Show Secret" or "Regenerate Secret"
   - Copy the ENTIRE secret (starts with `polar_whs_`)

3. **Update Your .env File**:
   ```env
   POLAR_WEBHOOK_SECRET=polar_whs_[paste_the_secret_here]
   ```
   - NO spaces before or after
   - NO quotes around the secret
   - Must be on a single line

4. **Redeploy**:
   ```bash
   cd Humanify
   git add .env
   git commit -m "Fix webhook secret"
   git push
   ```
   
   Or update in Vercel dashboard:
   - Settings → Environment Variables
   - Update `POLAR_WEBHOOK_SECRET`
   - Redeploy

5. **Test**:
   - Go to Polar dashboard → Webhooks
   - Click "Test" on your endpoint
   - Should see 200 OK response

## Code Changes Made

### File: `Humanify/src/app/api/webhooks/polar/route.ts`

**Changes:**
1. ✅ Removed incorrect base64 encoding
2. ✅ Keep original header casing (don't lowercase)
3. ✅ Added detailed error logging
4. ✅ Fixed `validateEvent` usage (returns payload, not boolean)
5. ✅ Fixed unused parameter warning

**Key Fix:**
```typescript
// BEFORE (WRONG - was base64 encoding the secret)
let webhookSecret = env.POLAR_WEBHOOK_SECRET;
if (!webhookSecret.includes('=') && webhookSecret.startsWith('polar_whs_')) {
  webhookSecret = Buffer.from(webhookSecret).toString('base64');
}

// AFTER (CORRECT - use secret as-is)
const webhookSecret = env.POLAR_WEBHOOK_SECRET;
// Use it directly, no encoding needed
```

## Build Status
✅ **Build successful** - No TypeScript errors
✅ **Linting clean** - No critical warnings
✅ **Diagnostics passed** - Code is error-free

## Testing Checklist

After deploying with the correct secret:

- [ ] Webhook test from Polar dashboard returns 200 OK
- [ ] Application logs show "Signature validated successfully"
- [ ] User can complete checkout process
- [ ] User credits are updated after purchase
- [ ] No 401 errors in Polar webhook delivery logs

## Expected Log Output (Success)

```
[Polar Webhook] Received webhook
[Polar Webhook] Headers received: {
  'webhook-id': '62b67ccb-ddd5-4a5f-8b5c-3e3ca1d9b93c',
  'webhook-timestamp': '2026-02-01T03:03:25.100208Z',
  'webhook-signature': 'present',
  allHeaderKeys: ['webhook-id', 'webhook-timestamp', 'webhook-signature']
}
[Polar Webhook] Signature validated successfully
[Polar Webhook] Event type: checkout.created
```

## If Still Not Working

1. **Double-check the secret**:
   - Copy it again from Polar dashboard
   - Make sure no extra characters
   - Verify it's updated in both `.env` and Vercel

2. **Check webhook URL**:
   - Must be: `https://www.humanifylab.com/api/webhooks/polar`
   - Must be HTTPS (not HTTP)
   - Must be publicly accessible

3. **Check webhook is enabled**:
   - Polar disables endpoints after 10 failures
   - Re-enable in dashboard if needed

4. **Check application logs**:
   - Look for the detailed error messages
   - They will show what's wrong

## Documentation Files Created

1. `WEBHOOK_SIGNATURE_FIX.md` - Original fix documentation
2. `WEBHOOK_SECRET_TROUBLESHOOTING.md` - Detailed troubleshooting guide
3. `WEBHOOK_FIX_SUMMARY.md` - This file (quick reference)
4. `test-webhook-signature.js` - Debugging helper script

## Support

If you need help:
- Read: `WEBHOOK_SECRET_TROUBLESHOOTING.md` for detailed steps
- Check: Polar dashboard webhook delivery logs
- Join: Polar Discord at https://discord.gg/polar
- Email: support@polar.sh

## Important Notes

- ⚠️ The webhook secret must match EXACTLY between Polar dashboard and your `.env`
- ⚠️ You must redeploy after changing environment variables
- ⚠️ The secret should NOT be base64 encoded (use it as-is from Polar)
- ⚠️ Make sure your webhook endpoint is enabled in Polar dashboard

## Next Steps

1. Update the webhook secret (see steps above)
2. Redeploy your application
3. Test the webhook from Polar dashboard
4. Try a real subscription purchase
5. Verify credits are updated

---

**Status**: Code is fixed and ready. Just need to update the webhook secret and redeploy.
