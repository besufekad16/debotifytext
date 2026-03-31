# Debugging Polar Webhook Issue

## Steps to Debug Why Credits Aren't Updating

### 1. Check Webhook Logs
Look at your server logs when the purchase happens. You should see:
```
[Polar Webhook] Received webhook
[Polar Webhook] Event type: checkout.completed (or subscription.created)
[Polar Webhook] Processing purchase: { clerkId, productId, plan, credits }
```

### 2. Verify Product ID Match
The product ID from Polar must EXACTLY match your .env:
- Monthly Pro: `84637abc-8afb-4be3-b54f-e77e9680186f`

### 3. Check Polar Dashboard
Go to Polar Dashboard → Webhooks → Check recent deliveries:
- Is the webhook being sent?
- What's the response status? (200 = success, 401 = auth fail, 400 = bad request)
- What's the event type?
- What's the product ID in the payload?

### 4. Common Issues

#### Issue A: Product ID Mismatch
**Symptom:** Logs show "Unknown product ID"
**Fix:** Update .env with correct product ID from Polar

#### Issue B: Webhook Not Configured
**Symptom:** No webhook logs at all
**Fix:** Add webhook endpoint in Polar dashboard:
- URL: `https://yourdomain.com/api/webhooks/polar`
- Secret: Your POLAR_WEBHOOK_SECRET

#### Issue C: Missing clerkId in Metadata
**Symptom:** Logs show "No clerkId in metadata"
**Fix:** Checkout is not passing clerkId correctly

#### Issue D: Webhook Signature Validation Failing
**Symptom:** Logs show "Invalid webhook signature"
**Fix:** Verify POLAR_WEBHOOK_SECRET matches Polar dashboard

### 5. Manual Credit Update (Temporary Fix)
If you need to fix the user immediately, run this SQL:

```sql
-- Find the user
SELECT id, "clerkId", email, credits, "subscriptionPlan" 
FROM "user" 
WHERE email = 'user@example.com';

-- Update their credits and plan
UPDATE "user" 
SET 
  credits = 20000,
  "subscriptionPlan" = 'pro',
  "subscriptionType" = 'monthly',
  "productId" = '84637abc-8afb-4be3-b54f-e77e9680186f',
  "maxWordsPerRequest" = 2000
WHERE email = 'user@example.com';
```

### 6. Test Webhook Manually
Create a test webhook payload and send it to your endpoint:

```bash
curl -X POST https://yourdomain.com/api/webhooks/polar \
  -H "Content-Type: application/json" \
  -H "webhook-id: test" \
  -H "webhook-timestamp: $(date +%s)" \
  -H "webhook-signature: test" \
  -d '{
    "type": "checkout.completed",
    "data": {
      "id": "test-checkout-id",
      "created_at": "2024-01-01T00:00:00Z",
      "modified_at": null,
      "subscription_id": "test-sub-id",
      "product": {
        "id": "84637abc-8afb-4be3-b54f-e77e9680186f",
        "name": "Monthly Pro",
        "created_at": "2024-01-01T00:00:00Z",
        "modified_at": null
      },
      "product_price": {
        "id": "price-id",
        "created_at": "2024-01-01T00:00:00Z",
        "modified_at": null,
        "type": "recurring",
        "price_amount": 1900,
        "price_currency": "USD"
      },
      "customer": {
        "id": "polar-customer-id",
        "email": "test@example.com",
        "name": "Test User",
        "created_at": "2024-01-01T00:00:00Z"
      },
      "metadata": {
        "clerkId": "user_test123"
      }
    }
  }'
```
