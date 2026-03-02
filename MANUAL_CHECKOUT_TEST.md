# Manual Checkout Testing Guide

## Test User: segnia05@gmail.com

Follow these steps to test the Polar checkout fix:

---

## Step 1: Check User Exists

Run this SQL query in your database:

```sql
SELECT email, credits, "subscriptionPlan", "clerkId"
FROM "user"
WHERE email = 'segnia05@gmail.com';
```

**If user doesn't exist:**
- Go to http://localhost:3050/sign-up
- Sign up with: segnia05@gmail.com
- Wait for Clerk webhook to create user record
- Run the SQL query again to verify

**If user exists:**
- Note their current credits and plan
- Proceed to Step 2

---

## Step 2: Start Development Server

```bash
npm run dev
```

Wait for:
```
✓ Ready in X.Xs
○ Local: http://localhost:3050
```

---

## Step 3: Sign In

1. Open browser: http://localhost:3050
2. Click "Sign In"
3. Sign in with: segnia05@gmail.com
4. Verify you're logged in (see user menu in navbar)

---

## Step 4: Test Checkout Creation

### Option A: Via Pricing Page (Recommended)

1. Go to: http://localhost:3050/pricing
2. Find "Monthly Pro" plan (20,000 words)
3. Open browser DevTools (F12)
4. Go to Console tab
5. Click "Get Started" or "Subscribe" button on Monthly Pro

**Watch for:**

✅ **Success indicators:**
- No errors in browser console
- Redirected to Polar checkout page (polar.sh domain)
- URL contains `checkout_` ID

❌ **Failure indicators:**
- Error in console: "checkout.upload does not work"
- Error: "Failed to create checkout session"
- No redirect happens

### Option B: Via API Test (Advanced)

Open browser console on your site and run:

```javascript
fetch('/api/polar/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId: '84637abc-8afb-4be3-b54f-e77e9680186f' // Monthly Pro
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Checkout created:', data);
  if (data.checkoutUrl) {
    console.log('Checkout URL:', data.checkoutUrl);
    // Uncomment to auto-redirect:
    // window.location.href = data.checkoutUrl;
  }
})
.catch(err => console.error('❌ Error:', err));
```

---

## Step 5: Check Server Logs

In your terminal where `npm run dev` is running, you should see:

```
[Polar Checkout] Creating checkout session
[Polar Checkout] Creating checkout for: {
  userId: 'user_xxx',
  email: 'segnia05@gmail.com',
  productId: '84637abc-8afb-4be3-b54f-e77e9680186f'
}
[Polar Checkout] Checkout created: checkout_xxx
```

**If you see errors:**
- Copy the full error message
- Check if it's still "checkout.upload does not work"
- Check if it's a different error (authentication, product ID, etc.)

---

## Step 6: Complete Test Purchase (Optional)

⚠️ **Only do this if you want to test the full flow with a real purchase**

1. On the Polar checkout page, use test card:
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

2. Complete the purchase

3. You should be redirected back to: http://localhost:3050/?purchase=success

4. Check server logs for webhook:
```
[Polar Webhook] ========== WEBHOOK RECEIVED ==========
[Polar Webhook] ✅ Signature validated
[Polar Webhook] Event type: checkout.completed
[Polar Webhook] ✅ Subscription updated successfully
```

5. Verify credits updated:
```sql
SELECT email, credits, "subscriptionPlan", "maxWordsPerRequest"
FROM "user"
WHERE email = 'segnia05@gmail.com';
```

Should show:
- credits: 20000
- subscriptionPlan: 'pro'
- maxWordsPerRequest: 2000

---

## Expected Results

### ✅ Success Criteria

1. **Checkout Creation:**
   - No "checkout.upload does not work" error
   - Checkout URL is generated
   - Redirected to Polar checkout page

2. **Server Logs:**
   - Shows checkout creation
   - No errors in logs
   - Checkout ID is logged

3. **After Purchase (if completed):**
   - Webhook received and processed
   - Credits updated to 20,000
   - Subscription plan set to 'pro'

### ❌ Failure Indicators

1. **Still getting "checkout.upload does not work":**
   - The fix didn't work
   - Check if changes were saved
   - Restart dev server

2. **Different error:**
   - Share the exact error message
   - Check server logs for details

3. **Webhook not working:**
   - See WEBHOOK_TROUBLESHOOTING.md
   - Check Polar dashboard webhook deliveries

---

## Troubleshooting

### Error: "Unauthorized"
- You're not signed in
- Sign in with segnia05@gmail.com

### Error: "Product ID is required"
- Frontend not sending productId
- Check browser console for errors

### Error: "Unknown product"
- Product ID doesn't match .env
- Check POLAR_PRODUCT_MEDIUM in .env

### Error: "Team members cannot purchase"
- User is a team member
- Use team owner account instead

### No redirect happens
- Check browser console for errors
- Check if popup blocker is active

---

## Quick Test Commands

### 1. Check if server is running:
```bash
curl http://localhost:3050/api/user/credits
```

### 2. Check user in database:
```bash
# If using psql:
psql $DATABASE_URL -c "SELECT email, credits FROM \"user\" WHERE email = 'segnia05@gmail.com';"
```

### 3. Restart dev server:
```bash
# Press Ctrl+C to stop
npm run dev
```

---

## What to Report

If the test fails, please provide:

1. **Exact error message** from browser console
2. **Server logs** from terminal
3. **Screenshot** of the error (if visual)
4. **Which step** failed (checkout creation, redirect, webhook, etc.)

---

## Test Results Template

Copy this and fill it out:

```
## Test Results for segnia05@gmail.com

Date: [DATE]
Time: [TIME]

### Step 1: User Exists
- [ ] User found in database
- [ ] Current credits: ___
- [ ] Current plan: ___

### Step 2: Server Running
- [ ] Dev server started successfully
- [ ] No startup errors

### Step 3: Sign In
- [ ] Signed in successfully
- [ ] User menu visible

### Step 4: Checkout Creation
- [ ] Clicked on Monthly Pro plan
- [ ] No "checkout.upload" error
- [ ] Redirected to Polar checkout
- [ ] Checkout URL: ___

### Step 5: Server Logs
- [ ] Checkout creation logged
- [ ] No errors in logs
- [ ] Checkout ID: ___

### Step 6: Purchase (Optional)
- [ ] Completed test purchase
- [ ] Redirected back to site
- [ ] Webhook received
- [ ] Credits updated to 20,000

### Overall Result
- [ ] ✅ PASS - Checkout works correctly
- [ ] ❌ FAIL - Error: ___

### Notes:
[Any additional observations]
```

---

## Next Steps After Testing

### If Test Passes ✅
1. Deploy to production
2. Test with real purchase (small amount)
3. Monitor webhook deliveries in Polar dashboard

### If Test Fails ❌
1. Share test results
2. Check POLAR_CHECKOUT_FIX.md for details
3. Verify all changes were applied
4. Check Polar SDK version matches (0.34.16)
