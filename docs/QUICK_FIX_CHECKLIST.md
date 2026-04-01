# Quick Fix Checklist - Credits Not Updating

## ⚡ Immediate Actions

### 1. Fix Affected User (2 minutes)
```sql
-- Replace USER_EMAIL with actual email
UPDATE "user" 
SET credits = 20000, "subscriptionPlan" = 'pro', 
    "subscriptionType" = 'monthly', "maxWordsPerRequest" = 2000,
    "productId" = '84637abc-8afb-4be3-b54f-e77e9680186f'
WHERE email = 'USER_EMAIL';
```

### 2. Check Configuration (1 minute)
```bash
node check-webhook-config.js
```

### 3. Verify Polar Webhook (2 minutes)
- [ ] Go to Polar Dashboard → Webhooks
- [ ] Endpoint URL: `https://yourdomain.com/api/webhooks/polar`
- [ ] Secret matches `POLAR_WEBHOOK_SECRET` in `.env`
- [ ] Check recent deliveries for errors

---

## 🔍 Diagnosis Flowchart

```
Purchase Made
    ↓
Check Server Logs
    ↓
┌─────────────────────────────────────┐
│ Do you see any webhook logs?        │
└─────────────────────────────────────┘
    ↓ NO                    ↓ YES
    ↓                       ↓
Webhook not          ┌──────────────────────────┐
configured in        │ What error do you see?   │
Polar Dashboard      └──────────────────────────┘
    ↓                       ↓
Add webhook          ┌──────┴──────┬──────────┬──────────┐
endpoint             ↓             ↓          ↓          ↓
                "Invalid     "Unknown   "No clerkId"  "User not
                signature"   product"                  found"
                     ↓             ↓          ↓          ↓
                Wrong         Product ID  Checkout   User doesn't
                webhook       mismatch    metadata   exist in DB
                secret                    issue
                     ↓             ↓          ↓          ↓
                Update        Update      Check       Check Clerk
                .env          .env        checkout    webhook
```

---

## 🚨 Common Issues & Quick Fixes

### Issue 1: "Invalid webhook signature"
```bash
# Fix: Update webhook secret in .env
POLAR_WEBHOOK_SECRET=polar_whs_YOUR_SECRET_HERE
```

### Issue 2: "Unknown product ID"
```bash
# Fix: Verify product ID matches Polar
# Get from: Polar Dashboard → Products → Copy ID
POLAR_PRODUCT_MEDIUM=84637abc-8afb-4be3-b54f-e77e9680186f
```

### Issue 3: "No clerkId in metadata"
Check `src/app/api/polar/checkout/route.ts`:
```typescript
metadata: {
  clerkId: user.id,  // ← Must be present
}
```

### Issue 4: No webhook logs at all
1. Add webhook in Polar Dashboard
2. URL: `https://yourdomain.com/api/webhooks/polar`
3. Copy secret to `.env`

---

## 📋 Verification Steps

After deploying fixes:

- [ ] Run `node check-webhook-config.js` - all green?
- [ ] Polar webhook configured with correct URL?
- [ ] Webhook secret matches `.env`?
- [ ] Product IDs match between Polar and `.env`?
- [ ] Test purchase or send test event from Polar
- [ ] Check logs for: `[Polar Webhook] ✅ Subscription updated successfully`

---

## 🛠️ Tools Available

| Tool | Purpose | Command |
|------|---------|---------|
| `check-webhook-config.js` | Validate configuration | `node check-webhook-config.js` |
| `test-webhook.sh` | Test locally | `./test-webhook.sh` |
| `fix-user-credits.sql` | Manual credit updates | Run in DB client |
| `WEBHOOK_TROUBLESHOOTING.md` | Detailed guide | Read for deep dive |

---

## 📞 What to Check First

1. **Server logs** - Any webhook activity?
2. **Polar Dashboard** - Webhook deliveries tab
3. **Configuration** - Run `node check-webhook-config.js`
4. **Product IDs** - Match between Polar and `.env`?

---

## ✅ Success Indicators

You'll know it's working when you see:

```
[Polar Webhook] ========== WEBHOOK RECEIVED ==========
[Polar Webhook] ✅ Signature validated
[Polar Webhook] 🎯 Processing payment event
[Polar Webhook] ✅ Plan config found
[Polar Webhook] ✅ Subscription updated successfully:
  previousCredits: 300
  newCredits: 20000
  newPlan: pro
```

---

## 🎯 Priority Order

1. **Fix affected user** (SQL update) - 2 min
2. **Check webhook config** in Polar - 2 min
3. **Deploy enhanced logging** - 5 min
4. **Test with Polar test event** - 2 min
5. **Monitor next purchase** - Ongoing

---

## 📚 Documentation

- **Quick Start:** This file
- **Detailed Guide:** `WEBHOOK_TROUBLESHOOTING.md`
- **Complete Fix:** `CREDITS_NOT_UPDATING_FIX.md`
- **Debug Steps:** `debug-webhook.md`
