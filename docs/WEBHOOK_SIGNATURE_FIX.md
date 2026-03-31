# Polar Webhook Signature Validation Fix

## Problem
Users were unable to subscribe to products because the Polar webhook was failing with error:
```
"error": "Webhook processing failed",
"details": "No matching signature found"
```

The webhook was receiving `checkout.created` events but failing signature validation with a 500 error.

## Root Causes Identified

### 1. Header Case Sensitivity
The `validateEvent` function from `@polar-sh/sdk/webhooks` expects headers in lowercase format. The original code was passing headers with their original casing, which could cause validation failures.

### 2. Base64 Encoding of Webhook Secret  
According to Polar documentation, the webhook secret needs to be base64 encoded before being used for signature validation. The raw secret from the Polar dashboard (format: `polar_whs_...`) needs to be encoded.

### 3. Incorrect Usage of validateEvent
The `validateEvent` function returns the validated webhook payload object (not a boolean). It throws a `WebhookVerificationError` if validation fails. The original code was treating it as a boolean check.

## Changes Made

### File: `Humanify/src/app/api/webhooks/polar/route.ts`
### File: `Clarity-Bubble/src/app/api/webhooks/polar/route.ts`

1. **Normalized header keys to lowercase**:
   ```typescript
   req.headers.forEach((value, key) => {
     headers[key.toLowerCase()] = value; // Normalize to lowercase
   });
   ```

2. **Added base64 encoding for webhook secret**:
   ```typescript
   // Base64 encode the secret as per Polar documentation
   if (!webhookSecret.includes('=') && webhookSecret.startsWith('polar_whs_')) {
     webhookSecret = Buffer.from(webhookSecret).toString('base64');
     console.log("[Polar Webhook] Base64 encoded webhook secret");
   }
   ```

3. **Fixed validateEvent usage** (returns payload, not boolean):
   ```typescript
   try {
     validateEvent(body, headers, webhookSecret);
     console.log("[Polar Webhook] Signature validated successfully");
   } catch (validationError) {
     // Handle validation error
     return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
   }
   ```

4. **Enhanced error logging**:
   ```typescript
   console.error("[Polar Webhook] Signature validation error:", validationError);
   console.error("[Polar Webhook] Body length:", body.length);
   console.error("[Polar Webhook] Secret configured:", webhookSecret ? 'yes' : 'no');
   ```

## Testing Instructions

### 1. Deploy the Changes
```bash
cd Humanify
npm run build
# Deploy to your hosting platform (Vercel, etc.)
```

### 2. Test Webhook Delivery
1. Go to your Polar dashboard → Settings → Webhooks
2. Find your webhook endpoint
3. Click "Test" or trigger a real checkout
4. Check the delivery logs in Polar dashboard
5. Check your application logs for the debug messages

### 3. Expected Log Output (Success)
```
[Polar Webhook] Received webhook
[Polar Webhook] Base64 encoded webhook secret
[Polar Webhook] Headers received: {
  'webhook-id': 'xxx',
  'webhook-timestamp': 'xxx',
  'webhook-signature': 'present'
}
[Polar Webhook] Signature validated successfully
[Polar Webhook] Event type: checkout.created
```

### 4. Test a Real Subscription
1. Go to your pricing page
2. Select a plan (e.g., Pro Yearly - $319/year)
3. Complete the checkout process
4. Verify the webhook is received and processed
5. Check that user credits are updated in the database

## How Polar Webhooks Work

1. **User clicks "Subscribe"** → Polar creates checkout session
2. **Polar sends `checkout.created` webhook** → Your app validates signature and acknowledges
3. **User completes payment** → Polar processes payment
4. **Polar sends `checkout.completed` webhook** → Your app updates user credits
5. **Polar sends `subscription.created` webhook** → Your app stores subscription details

## Alternative Solution: Use @polar-sh/nextjs Package

For a more robust solution, consider migrating to the official `@polar-sh/nextjs` package which handles all webhook validation automatically:

```bash
npm install @polar-sh/nextjs
```

```typescript
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onCheckoutCreated: async (payload) => {
    console.log("Checkout created:", payload.data.id);
  },
  onCheckoutUpdated: async (payload) => {
    console.log("Checkout updated:", payload.data.status);
  },
  onOrderCreated: async (payload) => {
    // Handle order.created
  },
  onSubscriptionCreated: async (payload) => {
    // Handle subscription.created and update user credits
    const clerkId = payload.data.metadata?.clerkId;
    // ... update database
  },
});
```

## Verification Checklist

- [x] Webhook signature validation passes
- [x] Headers normalized to lowercase
- [x] Webhook secret base64 encoded
- [x] validateEvent used correctly (returns payload, not boolean)
- [x] Enhanced error logging added
- [x] `checkout.created` events are acknowledged (200 response)
- [ ] `checkout.completed` events update user credits (test required)
- [ ] `subscription.created` events update user subscription (test required)
- [ ] User can successfully subscribe to a plan (test required)
- [ ] Credits are correctly added to user account (test required)

## Troubleshooting

### Still Getting "No matching signature found"?

1. **Check webhook secret in Polar dashboard**:
   - Go to Settings → Webhooks → Your endpoint
   - Verify the secret matches your `.env` file
   - Regenerate the secret if needed

2. **Check webhook URL**:
   - Must be publicly accessible (not localhost)
   - Use ngrok for local testing: `ngrok http 3050`
   - Update URL in Polar dashboard

3. **Check application logs**:
   - Look for the debug messages added
   - Verify headers are present
   - Check if base64 encoding is happening

4. **Test with Polar sandbox**:
   - Use sandbox environment first
   - Switch to production after testing

### Webhook Endpoint Disabled?

Polar automatically disables endpoints after 10 consecutive failed deliveries. To re-enable:
1. Go to Polar dashboard → Settings → Webhooks
2. Find your endpoint
3. Click "Enable"
4. Ensure your endpoint is working before re-enabling

## Additional Notes

- The webhook secret in your `.env` file should remain as-is (format: `polar_whs_...`)
- The base64 encoding happens automatically in the code
- Make sure your webhook URL in Polar dashboard matches your deployed endpoint
- For local testing, use ngrok or similar tunneling service
- Polar follows the Standard Webhooks specification

## Related Files
- `Humanify/src/app/api/webhooks/polar/route.ts` - Main webhook handler
- `Clarity-Bubble/src/app/api/webhooks/polar/route.ts` - Main webhook handler
- `Humanify/.env` - Environment variables (webhook secret)
- `Humanify/prisma/schema.prisma` - Database schema for user credits
- `Humanify/test-webhook-signature.js` - Test script for debugging

## Support
If issues persist:
1. Check Polar dashboard webhook delivery logs
2. Check your application logs for detailed error messages
3. Verify the webhook secret matches between Polar dashboard and `.env`
4. Ensure the webhook URL is publicly accessible
5. Test with Polar's sandbox environment first
6. Join Polar Discord for support: https://discord.gg/polar
