#!/bin/bash

# Test Polar Webhook Locally
# This script sends a test webhook payload to your local server

# Configuration
WEBHOOK_URL="http://localhost:3050/api/webhooks/polar"
# For production testing, use: https://yourdomain.com/api/webhooks/polar

# Test data - replace with actual values
CLERK_ID="user_test123"  # Replace with actual Clerk user ID
PRODUCT_ID="84637abc-8afb-4be3-b54f-e77e9680186f"  # Monthly Pro

echo "🧪 Testing Polar Webhook..."
echo "URL: $WEBHOOK_URL"
echo "Product: Monthly Pro ($PRODUCT_ID)"
echo "Clerk ID: $CLERK_ID"
echo ""

# Send test webhook
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "webhook-id: test-webhook-$(date +%s)" \
  -H "webhook-timestamp: $(date +%s)" \
  -H "webhook-signature: test-signature" \
  -d "{
    \"type\": \"checkout.completed\",
    \"data\": {
      \"id\": \"test-checkout-$(date +%s)\",
      \"created_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
      \"modified_at\": null,
      \"subscription_id\": \"test-sub-$(date +%s)\",
      \"product\": {
        \"id\": \"$PRODUCT_ID\",
        \"name\": \"Monthly Pro\",
        \"created_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
        \"modified_at\": null
      },
      \"product_price\": {
        \"id\": \"price-test\",
        \"created_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
        \"modified_at\": null,
        \"type\": \"recurring\",
        \"price_amount\": 1900,
        \"price_currency\": \"USD\"
      },
      \"customer\": {
        \"id\": \"polar-customer-test\",
        \"email\": \"test@example.com\",
        \"name\": \"Test User\",
        \"created_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
      },
      \"metadata\": {
        \"clerkId\": \"$CLERK_ID\"
      }
    }
  }" | jq '.'

echo ""
echo "✅ Test webhook sent!"
echo ""
echo "Check your server logs for:"
echo "  [Polar Webhook] ========== WEBHOOK RECEIVED =========="
echo "  [Polar Webhook] Product ID: $PRODUCT_ID"
echo "  [Polar Webhook] ✅ Subscription updated successfully"
