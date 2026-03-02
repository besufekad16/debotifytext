#!/bin/bash

echo "🧪 Polar Checkout Test for segnia05@gmail.com"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Checking if dev server is running...${NC}"
if curl -s http://localhost:3050 > /dev/null; then
    echo -e "${GREEN}✅ Dev server is running${NC}"
else
    echo -e "${RED}❌ Dev server is NOT running${NC}"
    echo "Please start it with: npm run dev"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Testing checkout API endpoint...${NC}"
echo "This will fail with 401 (Unauthorized) if not signed in, which is expected"
echo ""

# Test the checkout endpoint (will fail without auth, but we can see if endpoint exists)
curl -X POST http://localhost:3050/api/polar/checkout \
  -H "Content-Type: application/json" \
  -d '{"productId":"84637abc-8afb-4be3-b54f-e77e9680186f"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null

echo ""
echo -e "${YELLOW}Step 3: Manual Testing Instructions${NC}"
echo "=============================================="
echo ""
echo "To complete the test, please:"
echo ""
echo "1. Open browser: http://localhost:3050"
echo "2. Sign in with: segnia05@gmail.com"
echo "3. Go to: http://localhost:3050/pricing"
echo "4. Click on 'Monthly Pro' plan"
echo "5. Check for these success indicators:"
echo "   ✅ No 'checkout.upload does not work' error"
echo "   ✅ Redirected to Polar checkout page"
echo "   ✅ Server logs show: [Polar Checkout] Checkout created"
echo ""
echo "6. Check server terminal for logs"
echo ""
echo -e "${GREEN}If you see the Polar checkout page, the fix worked! ✅${NC}"
echo -e "${RED}If you see 'checkout.upload' error, the fix didn't work ❌${NC}"
echo ""
echo "See MANUAL_CHECKOUT_TEST.md for detailed testing steps"
