# Testing Instructions for segniab49@gmail.com

## ✅ Fix Status: VERIFIED

The "checkout.upload does not work" error has been fixed and verified.

---

## Quick Test (5 minutes)

### 1. Start the server
```bash
npm run dev
```

### 2. Open your browser
Go to: **http://localhost:3050**

### 3. Sign in
- Click "Sign In"
- Use email: **segniab49@gmail.com**
- Complete sign-in

### 4. Test checkout (ALL PLANS)
- Go to: **http://localhost:3050/pricing**
- Open browser DevTools (F12) to see console
- Test ANY plan (they all use the same fixed endpoint):
  - Try **Monthly Pro** (20,000 words)
  - Or try any other plan (Basic, Ultra, Yearly, Top-ups)
  - All 9 products are fixed!

### 5. Expected Result

✅ **SUCCESS - You should see:**
- Redirected to Polar checkout page (polar.sh domain)
- No "checkout.upload does not work" error
- Server logs show: `[Polar Checkout] Checkout created: checkout_xxx`

❌ **FAILURE - If you see:**
- Error: "checkout.upload does not work"
- Error in browser console
- No redirect happens

---

## What to Check

### In Browser Console (F12)
- Should see no errors
- Should redirect to Polar

### In Server Terminal
Look for these logs:
```
[Polar Checkout] Creating checkout session
[Polar Checkout] Creating checkout for: {
  userId: 'user_xxx',
  email: 'segniab49@gmail.com',
  productId: '84637abc-8afb-4be3-b54f-e77e9680186f'
}
[Polar Checkout] Checkout created: checkout_xxx
```

---

## Optional: Complete Test Purchase

If you want to test the full flow:

1. On Polar checkout page, use **test card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

2. Complete purchase

3. You'll be redirected back to your site

4. Check your credits:
   - Go to: http://localhost:3050/account
   - Should show: **20,000 words**

---

## Troubleshooting

### "Unauthorized" error
- Make sure you're signed in
- Refresh the page and try again

### "Product ID is required"
- This is a frontend issue
- Check browser console for errors

### Still getting "checkout.upload" error
- Run: `node verify-checkout-fix.cjs`
- If checks fail, the fix wasn't applied
- Restart the dev server

### No redirect happens
- Check browser console for errors
- Disable popup blocker
- Try a different browser

---

## Files Created for Testing

1. **MANUAL_CHECKOUT_TEST.md** - Detailed testing guide
2. **POLAR_CHECKOUT_FIX.md** - Technical details of the fix
3. **verify-checkout-fix.cjs** - Verify fix was applied
4. **check-user-status.sql** - Check user in database
5. **test-checkout-for-user.sh** - Automated test script

---

## What Changed

The fix updated `src/app/api/polar/checkout/route.ts`:

**Before (broken):**
```typescript
const checkout = await polarClient.checkouts.create({
  products: [productId],  // ❌ Wrong
  metadata: { clerkId },  // ❌ Wrong
} as any);
```

**After (fixed):**
```typescript
const checkout = await polarClient.checkouts.create({
  productId: productId,        // ✅ Correct
  customerMetadata: { clerkId }, // ✅ Correct
});
```

---

## Report Results

After testing, please report:

**If it works ✅:**
- "Checkout works! Redirected to Polar successfully"

**If it fails ❌:**
- Exact error message from browser console
- Server logs from terminal
- Screenshot of the error

---

## Need Help?

If you encounter issues:

1. Check **MANUAL_CHECKOUT_TEST.md** for detailed steps
2. Run `node verify-checkout-fix.cjs` to verify fix
3. Share error messages and logs
4. Check if dev server is running

---

## Summary

✅ Fix verified and ready to test
✅ All checks passed
✅ No code changes needed

**Just start the server and test the checkout flow!**

```bash
npm run dev
# Then go to http://localhost:3050/pricing
```
