# Polar Webhook Troubleshooting Guide

## Problem: User purchased Monthly Pro but credits didn't update

### Quick Fix for Affected User

1. **Get user's email** from the purchase confirmation
2. **Run this SQL query** in your database:

```sql
-- Replace USER_EMAIL with actual email
UPDATE "user" 
SET 
  credits = 20000,
  "subscriptionPlan" = 'pro',
  "subscriptionType" = 'monthly',
  "productId" = '84637abc-8afb-4be3-b54f-e77e9680186f',
  "maxWordsPerRequest" = 2000,
  "updatedAt" = NOW()
WHERE email = 'USER_EMAIL';
```

3. **Verify the update**:
```sql
SELECT email, credits, "subscriptionPlan", "maxWordsPerRequest" 
FROM "user" 
WHERE email = 'USER_EMAIL';
```

---

## Root Cause Analysis

The webhook system has 5 potential failure points:

### 1. Webhook Not Configured in Polar
**Check:** Go to Polar Dashboard → Settings → Webhooks

**Should see:**
- Endpoint URL: `https://yourdomain.com/api/webhooks/polar`
- Secret: (matches your `POLAR_WEBHOOK_SECRET`)
- Events: All events enabled (or at least `checkout.completed`, `subscription.created`)

**Fix if missing:**
1. Add new webhook endpoint
2. Copy the webhook secret to your `.env` file as `POLAR_WEBHOOK_SECRET`
3. Redeploy your app

---

### 2. Product ID Mismatch
**Check:** Compare product IDs in Polar vs your `.env`

**In Polar Dashboard:**
- Go to Products → Monthly Pro
- Copy the Product ID (looks like: `84637abc-8afb-4be3-b54f-e77e9680186f`)

**In your `.env`:**
```env
POLAR_PRODUCT_MEDIUM=84637abc-8afb-4be3-b54f-e77e9680186f
```

**Fix if different:**
1. Update `.env` with correct product ID
2. Redeploy your app

---

### 3. Webhook Signature Validation Failing
**Check:** Look for this in server logs:
```
[Polar Webhook] ❌ Invalid webhook signature
```

**Causes:**
- Wrong `POLAR_WEBHOOK_SECRET` in `.env`
- Webhook secret changed in Polar but not updated in `.env`

**Fix:**
1. Go to Polar Dashboard → Webhooks
2. Copy the webhook secret
3. Update `POLAR_WEBHOOK_SECRET` in `.env`
4. Redeploy

---

### 4. Missing clerkId in Metadata
**Check:** Look for this in server logs:
```
[Polar Webhook] ❌ No clerkId in metadata
```

**Cause:** Checkout not passing user's Clerk ID

**Check checkout code** (`src/app/api/polar/checkout/route.ts`):
```typescript
const checkout = await polarClient.checkouts.create({
  products: [productId],
  customerEmail: user.emailAddresses[0]?.emailAddress,
  customerName: user.fullName || undefined,
  metadata: {
    clerkId: user.id,  // ← This must be present
  },
  successUrl: `${baseUrl}/?purchase=success`,
} as any);
```

**Fix:** Ensure `metadata.clerkId` is being passed in checkout creation

---

### 5. User Not Found in Database
**Check:** Look for this in server logs:
```
[Polar Webhook] ❌ User not found in database
```

**Cause:** User hasn't signed up yet, or Clerk webhook hasn't created user record

**Fix:**
1. Ensure user has signed up and exists in database
2. Check Clerk webhook is working (`/api/webhooks/clerk`)
3. Manually create user if needed

---

## Debugging Steps

### Step 1: Check Server Logs
After a purchase, you should see:

```
[Polar Webhook] ========== WEBHOOK RECEIVED ==========
[Polar Webhook] ✅ Signature validated
[Polar Webhook] Event type: checkout.completed
[Polar Webhook] Product ID: 84637abc-8afb-4be3-b54f-e77e9680186f
[Polar Webhook] ✅ Plan config found
[Polar Webhook] ✅ Subscription updated successfully
```

**If you see nothing:** Webhook not configured or not being sent

**If you see signature error:** Wrong webhook secret

**If you see "Unknown product":** Product ID mismatch

**If you see "No clerkId":** Metadata not being passed

---

### Step 2: Check Polar Webhook Deliveries
1. Go to Polar Dashboard → Webhooks
2. Click on your webhook endpoint
3. View recent deliveries
4. Check:
   - Status code (should be 200)
   - Response body
   - Request payload

**Common status codes:**
- `200`: Success ✅
- `401`: Invalid signature (wrong secret)
- `400`: Bad request (missing data or unknown product)
- `404`: Endpoint not found (wrong URL)
- `500`: Server error (check logs)

---

### Step 3: Test Webhook Locally

1. **Start your dev server:**
```bash
npm run dev
```

2. **Run the test script:**
```bash
chmod +x test-webhook.sh
./test-webhook.sh
```

3. **Check logs** for the webhook processing

**Note:** This will fail signature validation, but you'll see if the product ID matches and user exists

---

### Step 4: Test in Production

Use Polar's webhook testing feature:
1. Go to Polar Dashboard → Webhooks
2. Click "Send test event"
3. Choose `checkout.completed`
4. Check your server logs

---

## Prevention: Enhanced Logging

I've updated your webhook handler with detailed logging. After redeploying, you'll see:

✅ **Success logs:**
```
[Polar Webhook] ✅ Subscription updated successfully:
  userId: cuid123
  email: user@example.com
  previousCredits: 300
  newCredits: 20000
  previousPlan: null
  newPlan: pro
```

❌ **Error logs:**
```
[Polar Webhook] ❌ Unknown product ID: xyz
[Polar Webhook] Available product IDs:
  POLAR_PRODUCT_MEDIUM: 84637abc-8afb-4be3-b54f-e77e9680186f
```

---

## Product ID Reference

From your `.env`:

| Plan | Type | Product ID | Credits |
|------|------|------------|---------|
| Basic | Monthly | `8dfb1747-cc3c-4138-b10a-3f538b5b0b86` | 5,000 |
| Pro | Monthly | `84637abc-8afb-4be3-b54f-e77e9680186f` | 20,000 |
| Ultra | Monthly | `4f2b7a4c-198d-4923-b4bc-24298832ab09` | 45,000 |
| Basic | Yearly | `4da970f6-61d0-4c9e-aaca-c04e8c0c3cdf` | 5,000 |
| Pro | Yearly | `ea63fc3e-9f0a-4f83-b3d4-cb39a1074025` | 20,000 |
| Ultra | Yearly | `80a6efc4-1a3e-414f-8412-8c0dec546a55` | 45,000 |
| Top-up | One-time | `728a2afc-f038-4a17-b2f2-fb0d97d50b58` | 5,000 |
| Top-up | One-time | `fb949835-60e7-4be9-b9a6-308a5c4c9b48` | 20,000 |
| Top-up | One-time | `6a8e043a-2079-4fc0-b727-1b816efb5b3b` | 45,000 |

---

## Next Steps

1. **Deploy the updated webhook handler** (with enhanced logging)
2. **Check Polar webhook configuration**
3. **Test with a small purchase** or use Polar's test mode
4. **Monitor logs** for any issues
5. **Fix affected users** using the SQL script

---

## Need Help?

If the issue persists:
1. Share the server logs from a purchase attempt
2. Share a screenshot of Polar webhook delivery details
3. Verify all environment variables are set correctly
