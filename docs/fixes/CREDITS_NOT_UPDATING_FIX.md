# Fix: Credits Not Updating After Purchase

## Problem
User purchased Monthly Pro plan but their credits didn't update from 300 to 20,000 words.

## Root Causes (5 Possible Issues)

1. **Webhook not configured in Polar** - Polar isn't sending webhooks to your server
2. **Product ID mismatch** - Product ID in Polar doesn't match your `.env` file
3. **Webhook signature validation failing** - Wrong webhook secret
4. **Missing clerkId in metadata** - Checkout not passing user ID
5. **User not found in database** - User record doesn't exist

## Immediate Fix for Affected User

Run this SQL in your database (replace `USER_EMAIL`):

```sql
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

## Changes Made

### 1. Enhanced Webhook Logging
Updated `src/app/api/webhooks/polar/route.ts` with detailed logging:

- ✅ Shows full webhook payload
- ✅ Logs product ID matching
- ✅ Shows before/after credit values
- ✅ Displays all available product IDs on mismatch
- ✅ Better error messages

### 2. Created Debugging Tools

**`check-webhook-config.js`** - Validates your configuration
```bash
node check-webhook-config.js
```

**`fix-user-credits.sql`** - SQL scripts to manually fix users

**`test-webhook.sh`** - Test webhook locally
```bash
chmod +x test-webhook.sh
./test-webhook.sh
```

**`WEBHOOK_TROUBLESHOOTING.md`** - Complete troubleshooting guide

## How to Diagnose

### Step 1: Check Configuration
```bash
node check-webhook-config.js
```

This verifies:
- All environment variables are set
- Product IDs are valid UUIDs
- No duplicate product IDs
- Correct Polar environment (production/sandbox)

### Step 2: Check Polar Dashboard

1. Go to **Polar Dashboard → Settings → Webhooks**
2. Verify webhook endpoint exists:
   - URL: `https://yourdomain.com/api/webhooks/polar`
   - Secret: (matches your `POLAR_WEBHOOK_SECRET`)
   - Events: Enabled

3. Check **Recent Deliveries**:
   - Status should be `200 OK`
   - If `401`: Wrong webhook secret
   - If `400`: Product ID mismatch or missing data
   - If `404`: Wrong URL

### Step 3: Check Server Logs

After a purchase, you should see:

```
[Polar Webhook] ========== WEBHOOK RECEIVED ==========
[Polar Webhook] Timestamp: 2024-01-01T00:00:00.000Z
[Polar Webhook] ✅ Signature validated
[Polar Webhook] Event type: checkout.completed
[Polar Webhook] Product ID: 84637abc-8afb-4be3-b54f-e77e9680186f
[Polar Webhook] 🎯 Processing payment event
[Polar Webhook] ✅ Plan config found
[Polar Webhook] Current user state: { credits: 300, ... }
[Polar Webhook] ✅ Subscription updated successfully
[Polar Webhook] New state: { credits: 20000, ... }
```

**If you see nothing:** Webhook not configured in Polar

**If you see signature error:** Update `POLAR_WEBHOOK_SECRET` in `.env`

**If you see "Unknown product":** Product ID mismatch - check `.env`

**If you see "No clerkId":** Checkout metadata issue

**If you see "User not found":** User doesn't exist in database

## Product ID Reference

Your configured products (from `.env`):

| Plan | Type | Product ID | Credits |
|------|------|------------|---------|
| Basic | Monthly | `8dfb1747-cc3c-4138-b10a-3f538b5b0b86` | 5,000 |
| **Pro** | **Monthly** | **`84637abc-8afb-4be3-b54f-e77e9680186f`** | **20,000** |
| Ultra | Monthly | `4f2b7a4c-198d-4923-b4bc-24298832ab09` | 45,000 |
| Basic | Yearly | `4da970f6-61d0-4c9e-aaca-c04e8c0c3cdf` | 5,000 |
| Pro | Yearly | `ea63fc3e-9f0a-4f83-b3d4-cb39a1074025` | 20,000 |
| Ultra | Yearly | `80a6efc4-1a3e-414f-8412-8c0dec546a55` | 45,000 |

## Testing

### Test Locally
```bash
# Start dev server
npm run dev

# In another terminal, run test
./test-webhook.sh
```

### Test in Production
1. Go to Polar Dashboard → Webhooks
2. Click "Send test event"
3. Choose `checkout.completed`
4. Check your server logs

## Prevention

After deploying the updated webhook handler:

1. **Monitor logs** for all purchases
2. **Set up alerts** for webhook failures
3. **Test purchases** in Polar sandbox mode first
4. **Verify webhook deliveries** in Polar dashboard regularly

## Deployment

1. **Commit changes:**
```bash
git add src/app/api/webhooks/polar/route.ts
git commit -m "Enhanced webhook logging for debugging credit updates"
```

2. **Deploy to production:**
```bash
git push
# Or use your deployment method (Vercel, etc.)
```

3. **Test with a small purchase** or Polar test event

4. **Monitor logs** for the enhanced output

## Files Created

- ✅ `WEBHOOK_TROUBLESHOOTING.md` - Complete troubleshooting guide
- ✅ `check-webhook-config.js` - Configuration validator
- ✅ `fix-user-credits.sql` - Manual credit fix scripts
- ✅ `test-webhook.sh` - Local webhook testing
- ✅ `debug-webhook.md` - Quick debugging steps

## Next Steps

1. **Fix the affected user** using the SQL script above
2. **Run configuration check:** `node check-webhook-config.js`
3. **Verify Polar webhook** is configured correctly
4. **Deploy updated webhook handler** with enhanced logging
5. **Test with a purchase** or Polar test event
6. **Monitor logs** for future purchases

## Support

If the issue persists after following these steps:

1. Share the output of `node check-webhook-config.js`
2. Share server logs from a purchase attempt
3. Share screenshot of Polar webhook delivery details
4. Check `WEBHOOK_TROUBLESHOOTING.md` for detailed solutions
