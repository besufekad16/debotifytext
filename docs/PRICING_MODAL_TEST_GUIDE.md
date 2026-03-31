# 🧪 Pricing Modal Testing Guide

## Quick Test Steps

### Test 1: Sign Up Flow
1. Open your site in incognito/private window
2. Click "Sign Up"
3. Complete sign-up process
4. After sign-up completes, wait 2 seconds
5. ✅ Pricing modal should appear automatically
6. ✅ Should show 3 plans: Basic, Pro, Ultra (NO free tier)
7. ✅ Should have Monthly/Yearly toggle
8. ✅ Should match pricing page design exactly

### Test 2: Sign In Flow (Existing Free User)
1. Sign out if signed in
2. Open site in incognito/private window
3. Click "Sign In"
4. Sign in with existing free account
5. After sign-in completes, wait 2 seconds
6. ✅ Pricing modal should appear automatically
7. ✅ Should show same 3 plans with toggle

### Test 3: Toggle Functionality
1. When modal appears, check default state
2. ✅ Should default to "Yearly billing" selected
3. ✅ Should show "Save 50%" badge on yearly toggle
4. Click "Monthly billing"
5. ✅ Prices should update to monthly
6. ✅ Strikethrough prices should disappear
7. Click "Yearly billing" again
8. ✅ Prices should show yearly (divided by 12)
9. ✅ Should show strikethrough monthly price
10. ✅ Should show "Save X%" badge on cards

### Test 4: Plan Details
Check each plan card:

**Basic Plan (Left):**
- ✅ Shows correct price
- ✅ Shows all features from product description
- ✅ Has gray/black styling
- ✅ Subscribe button works

**Pro Plan (Center - Most Loved):**
- ✅ Has "Most Loved" badge at top
- ✅ Shows correct price
- ✅ Shows all features from product description
- ✅ Has brown gradient background
- ✅ Slightly larger than other cards
- ✅ Subscribe button works

**Ultra Plan (Right):**
- ✅ Shows correct price
- ✅ Shows all features from product description
- ✅ Has blue gradient styling
- ✅ Subscribe button works

### Test 5: Subscribe Flow
1. Click "Subscribe" on any plan
2. ✅ Button should show "Processing…"
3. ✅ Should redirect to Polar checkout page
4. ✅ Checkout page should show correct plan
5. Complete or cancel checkout
6. ✅ Should return to your site

### Test 6: Close Modal
Test all ways to close:

**Method 1: X Button**
1. Click X button in top-right
2. ✅ Modal should close with animation

**Method 2: Backdrop Click**
1. Click outside modal (on dark background)
2. ✅ Modal should close with animation

**Method 3: "I'll decide later" Link**
1. Click "I'll decide later" at bottom
2. ✅ Modal should close with animation

### Test 7: Modal Persistence
1. Close modal using any method
2. Refresh page
3. ✅ Modal should NOT appear again (dismissed)
4. Clear localStorage or wait 7 days
5. ✅ Modal should appear again

### Test 8: Paid User (Should NOT Show)
1. Sign in with account that has paid plan
2. ✅ Modal should NOT appear
3. ✅ User should go directly to homepage

### Test 9: Responsive Design
Test on different screen sizes:

**Desktop (1920x1080):**
- ✅ 3 cards side by side
- ✅ All content visible
- ✅ Proper spacing

**Tablet (768x1024):**
- ✅ 3 cards side by side (smaller)
- ✅ Text readable
- ✅ Toggle works

**Mobile (375x667):**
- ✅ Cards stack vertically
- ✅ Toggle works
- ✅ All content accessible
- ✅ Scrollable if needed

### Test 10: Loading State
1. Throttle network to "Slow 3G" in DevTools
2. Trigger modal
3. ✅ Should show loading spinner
4. ✅ Should say "Loading plans…"
5. ✅ Should load plans after delay

## 🐛 Common Issues & Fixes

### Issue: Modal doesn't appear
**Check:**
- User is on free plan (not paid)
- localStorage doesn't have dismissal timestamp
- Wait 2 seconds after sign-in/sign-up
- Check browser console for errors

**Fix:**
```javascript
// Clear localStorage to reset
localStorage.removeItem('humanifylab_pricing_modal_shown');
localStorage.removeItem('humanifylab_pricing_modal_dismissed');
```

### Issue: Shows 4 cards instead of 3
**Check:**
- Old modal component might be cached
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Fix:**
- Clear browser cache
- Restart dev server

### Issue: Toggle doesn't work
**Check:**
- Products have both monthly and yearly prices in Polar
- Check browser console for errors

**Fix:**
- Verify Polar products have yearly prices configured
- Check environment variables

### Issue: Subscribe button doesn't work
**Check:**
- User is signed in
- Polar checkout API is working
- Check browser console for errors

**Fix:**
- Verify POLAR_ACCESS_TOKEN is set
- Check network tab for API errors
- Verify Polar products are active

## 📊 Expected Behavior Summary

| Scenario | Expected Result |
|----------|----------------|
| New sign-up | Modal appears after 2 seconds |
| Existing free user sign-in | Modal appears after 2 seconds |
| Paid user sign-in | Modal does NOT appear |
| Modal dismissed | Does NOT appear again for 7 days |
| Click Subscribe | Redirects to Polar checkout |
| Click close | Modal closes, marked as dismissed |
| Toggle billing | Prices update immediately |
| Mobile view | Cards stack vertically |

## ✅ Success Criteria

All tests pass when:
- ✅ Modal appears for free users only
- ✅ Shows exactly 3 plans (no free tier)
- ✅ Has working Monthly/Yearly toggle
- ✅ Matches pricing page design exactly
- ✅ All subscribe buttons work
- ✅ All close methods work
- ✅ Responsive on all devices
- ✅ Loading state works
- ✅ Persistence works (doesn't show again)

## 🚀 Production Testing

Before deploying to production:

1. **Test on staging/preview:**
   - Deploy to Vercel preview
   - Test all scenarios above
   - Verify Polar integration works

2. **Test with real Polar products:**
   - Ensure products are active
   - Verify prices are correct
   - Test actual checkout flow

3. **Monitor after deployment:**
   - Check error logs
   - Monitor conversion rates
   - Gather user feedback

## 📝 Testing Checklist

Copy this checklist for your testing:

```
[ ] Modal appears after sign-up
[ ] Modal appears after sign-in (free users)
[ ] Modal does NOT appear for paid users
[ ] Shows 3 plans only (Basic, Pro, Ultra)
[ ] No free tier shown
[ ] Monthly/Yearly toggle works
[ ] Prices update when toggling
[ ] "Save 50%" badge shows on yearly
[ ] "Most Loved" badge on Pro plan
[ ] All features display correctly
[ ] Subscribe buttons work for all plans
[ ] Redirects to Polar checkout
[ ] X button closes modal
[ ] Backdrop click closes modal
[ ] "I'll decide later" closes modal
[ ] Modal doesn't reappear after dismissal
[ ] Responsive on desktop
[ ] Responsive on tablet
[ ] Responsive on mobile
[ ] Loading state shows correctly
[ ] Error handling works
```

---

**Ready to test!** Follow this guide to ensure the pricing modal works perfectly.
