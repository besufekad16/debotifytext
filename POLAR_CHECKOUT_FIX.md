# Polar Checkout Fix - "checkout.upload does not work"

## Problem

The error "checkout.upload does not work" was occurring when trying to create Polar checkout sessions.

## Root Cause

The checkout creation code was using **incorrect API parameters** that don't match the current Polar SDK (v0.34.16):

### ❌ Old (Incorrect) Code:
```typescript
const checkout = await polarClient.checkouts.create({
  products: [productId],           // ❌ Wrong: products as array
  metadata: {                      // ❌ Wrong: should be customerMetadata
    clerkId: user.id,
  },
  // ... other fields
} as any);                         // ❌ Type assertion hiding errors
```

### ✅ New (Correct) Code:
```typescript
const checkout = await polarClient.checkouts.create({
  productId: productId,            // ✅ Correct: productId (singular)
  customerMetadata: {              // ✅ Correct: customerMetadata
    clerkId: user.id,
  },
  // ... other fields
});                                // ✅ No type assertion needed
```

## Changes Made

### File: `src/app/api/polar/checkout/route.ts`

**Changed:**
1. `products: [productId]` → `productId: productId`
2. `metadata` → `customerMetadata`
3. Removed `as any` type assertion

## Why This Matters

1. **`productId` vs `products`**: The Polar API expects a single `productId` string, not an array of products
2. **`customerMetadata` vs `metadata`**: Customer-specific metadata must be passed in the `customerMetadata` field
3. **Type Safety**: Removing `as any` allows TypeScript to catch these errors at compile time

## Webhook Compatibility

The webhook handler (`src/app/api/webhooks/polar/route.ts`) already handles both fields correctly:

```typescript
const clerkId = data.customer_metadata?.clerkId || data.metadata?.clerkId;
```

So it will work with the corrected checkout creation.

## Testing

To test the fix:

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Try creating a checkout:**
   - Go to your pricing page
   - Click on any plan
   - The checkout should now be created successfully

3. **Check the logs:**
   ```
   [Polar Checkout] Creating checkout session
   [Polar Checkout] Creating checkout for: { userId: '...', productId: '...' }
   [Polar Checkout] Checkout created: checkout_xxx
   ```

4. **Complete a test purchase:**
   - Use Polar's test mode if available
   - Complete the checkout flow
   - Verify credits are updated in your database

## What Was Wrong

The error "checkout.upload does not work" was misleading - it wasn't about uploading, but about the checkout creation API call failing due to:

1. **Invalid parameter structure** - Using `products` array instead of `productId` string
2. **Wrong metadata field** - Using `metadata` instead of `customerMetadata`
3. **Hidden type errors** - The `as any` assertion prevented TypeScript from catching these issues

## Prevention

To prevent similar issues in the future:

1. ✅ **Avoid `as any` type assertions** - Let TypeScript catch API mismatches
2. ✅ **Check SDK documentation** - API parameters can change between versions
3. ✅ **Use TypeScript autocomplete** - Modern IDEs will suggest correct parameters
4. ✅ **Test after SDK updates** - Verify checkout flow after updating `@polar-sh/sdk`

## Related Files

- ✅ `src/app/api/polar/checkout/route.ts` - Fixed
- ✅ `src/app/api/webhooks/polar/route.ts` - Already compatible
- ✅ No other files needed changes

## Status

✅ **FIXED** - Checkout creation now uses correct Polar SDK parameters
