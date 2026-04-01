# Complete Polar.sh Setup Guide - Step by Step

## Table of Contents
1. [Account Setup](#1-account-setup)
2. [Organization Setup](#2-organization-setup)
3. [Creating Products](#3-creating-products)
4. [Setting Up Webhooks](#4-setting-up-webhooks)
5. [Getting API Keys](#5-getting-api-keys)
6. [Configuring Your App](#6-configuring-your-app)
7. [Testing](#7-testing)

---

## 1. Account Setup

### Step 1.1: Create Polar Account
1. Go to [https://polar.sh](https://polar.sh)
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with:
   - GitHub account (recommended), OR
   - Email and password
4. Verify your email if required

### Step 1.2: Complete Profile
1. After login, complete your profile:
   - Full name
   - Email (for payments)
   - Profile picture (optional)

---

## 2. Organization Setup

### Step 2.1: Create Organization
1. Click on your profile icon (top right)
2. Click **"Create Organization"** or **"New Organization"**
3. Fill in:
   - **Organization Name:** "HumanifyLab" (or your business name)
   - **Slug:** `humanifylab` (used in URLs)
   - **Description:** Brief description of your business
4. Click **"Create"**

### Step 2.2: Configure Organization Settings
1. Go to **Settings** → **Organization**
2. Set up:
   - **Logo:** Upload your logo
   - **Website:** https://www.humanifylab.com
   - **Support Email:** humanifylab@gmail.com
   - **Country:** Your country (for tax purposes)

### Step 2.3: Connect Payment Provider (Stripe)
1. Go to **Settings** → **Payments**
2. Click **"Connect Stripe"**
3. Follow Stripe onboarding:
   - Business details
   - Bank account information
   - Tax information
4. Complete Stripe verification (may take 1-2 days)

**Important:** You need a verified Stripe account to receive payments!

---

## 3. Creating Products

You need to create **9 products total**:
- 3 Monthly subscription plans
- 3 Yearly subscription plans
- 3 One-time top-up packs

### Step 3.1: Create Monthly Subscription Plans

#### Product 1: Basic Plan (Monthly)

1. Go to **Products** → **Create Product**
2. Fill in:
   - **Name:** `Basic Plan`
   - **Description:** `5,000 words per month with basic humanization`
   - **Type:** Select **"Subscription"**
3. Click **"Create Product"**

4. **Add Price:**
   - Click **"Add Price"**
   - **Amount:** `$9.99` (or your price)
   - **Currency:** USD
   - **Billing Interval:** **Monthly**
   - **Billing Period:** 1 month
   - Click **"Create Price"**

5. **Copy Product ID:**
   - You'll see something like: `prod_abc123xyz`
   - **Save this!** You'll need it for `.env` as `POLAR_PRODUCT_SMALL`

6. **Publish Product:**
   - Click **"Publish"** to make it live

#### Product 2: Pro Plan (Monthly)

1. Click **"Create Product"** again
2. Fill in:
   - **Name:** `Pro Plan`
   - **Description:** `20,000 words per month with advanced humanization`
   - **Type:** **"Subscription"**
3. **Add Price:**
   - **Amount:** `$19.99`
   - **Currency:** USD
   - **Billing Interval:** **Monthly**
4. **Copy Product ID** → Save as `POLAR_PRODUCT_MEDIUM`
5. **Publish Product**

#### Product 3: Ultra Plan (Monthly)

1. Click **"Create Product"**
2. Fill in:
   - **Name:** `Ultra Plan`
   - **Description:** `45,000 words per month with advanced humanization + API access`
   - **Type:** **"Subscription"**
3. **Add Price:**
   - **Amount:** `$39.99`
   - **Currency:** USD
   - **Billing Interval:** **Monthly**
4. **Copy Product ID** → Save as `POLAR_PRODUCT_LARGE`
5. **Publish Product**

---

### Step 3.2: Create Yearly Subscription Plans

#### Product 4: Basic Plan (Yearly)

1. Click **"Create Product"**
2. Fill in:
   - **Name:** `Basic Plan (Yearly)`
   - **Description:** `5,000 words per month, billed annually (Save 20%)`
   - **Type:** **"Subscription"**
3. **Add Price:**
   - **Amount:** `$95.90` (20% discount from $119.88)
   - **Currency:** USD
   - **Billing Interval:** **Yearly**
   - **Billing Period:** 1 year
4. **Copy Product ID** → Save as `POLAR_PRODUCT_YEARLY_SMALL`
5. **Publish Product**

#### Product 5: Pro Plan (Yearly)

1. Click **"Create Product"**
2. Fill in:
   - **Name:** `Pro Plan (Yearly)`
   - **Description:** `20,000 words per month, billed annually (Save 20%)`
   - **Type:** **"Subscription"**
3. **Add Price:**
   - **Amount:** `$191.90` (20% discount from $239.88)
   - **Currency:** USD
   - **Billing Interval:** **Yearly**
4. **Copy Product ID** → Save as `POLAR_PRODUCT_YEARLY_MEDIUM`
5. **Publish Product**

#### Product 6: Ultra Plan (Yearly)

1. Click **"Create Product"**
2. Fill in:
   - **Name:** `Ultra Plan (Yearly)`
   - **Description:** `45,000 words per month, billed annually (Save 20%)`
   - **Type:** **"Subscription"**
3. **Add Price:**
   - **Amount:** `$383.90` (20% discount from $479.88)
   - **Currency:** USD
   - **Billing Interval:** **Yearly**
4. **Copy Product ID** → Save as `POLAR_PRODUCT_YEARLY_LARGE`
5. **Publish Product**

---

### Step 3.3: Create One-Time Top-Up Packs

#### Product 7: 5,000 Words Top-Up

1. Click **"Create Product"**
2. Fill in:
   - **Name:** `5,000 Words Top-Up`
   - **Description:** `One-time purchase of 5,000 extra words (never expires)`
   - **Type:** **"One-time"** (NOT subscription)
3. **Add Price:**
   - **Amount:** `$9.99`
   - **Currency:** USD
   - **Type:** One-time payment
4. **Copy Product ID** → Save as `POLAR_CREDITS_5000`
5. **Publish Product**

#### Product 8: 20,000 Words Top-Up

1. Click **"Create Product"**
2. Fill in:
   - **Name:** `20,000 Words Top-Up`
   - **Description:** `One-time purchase of 20,000 extra words (never expires)`
   - **Type:** **"One-time"**
3. **Add Price:**
   - **Amount:** `$29.99`
   - **Currency:** USD
4. **Copy Product ID** → Save as `POLAR_CREDITS_20000`
5. **Publish Product**

#### Product 9: 45,000 Words Top-Up

1. Click **"Create Product"**
2. Fill in:
   - **Name:** `45,000 Words Top-Up`
   - **Description:** `One-time purchase of 45,000 extra words (never expires)`
   - **Type:** **"One-time"**
3. **Add Price:**
   - **Amount:** `$59.99`
   - **Currency:** USD
4. **Copy Product ID** → Save as `POLAR_CREDITS_45000`
5. **Publish Product**

---

## 4. Setting Up Webhooks

Webhooks notify your app when payments are completed.

### Step 4.1: Create Webhook Endpoint

1. Go to **Settings** → **Webhooks**
2. Click **"Create Webhook"**
3. Fill in:
   - **Name:** `Humanify Production Webhook`
   - **URL:** `https://www.humanifylab.com/api/webhooks/polar`
   - **Description:** `Production webhook for payment processing`

### Step 4.2: Select Events

Select these events (IMPORTANT - select all three):
- ✅ `checkout.completed` - When checkout is completed
- ✅ `order.created` - When order is created
- ✅ `subscription.created` - When subscription is created

**Do NOT select:**
- ❌ `subscription.updated` (not needed)
- ❌ `subscription.canceled` (not needed)
- ❌ Other events

### Step 4.3: Save Webhook Secret

1. Click **"Create Webhook"**
2. You'll see a **Webhook Secret** like: `whsec_abc123xyz...`
3. **COPY THIS IMMEDIATELY!** You can't see it again
4. Save it as `POLAR_WEBHOOK_SECRET` in your `.env`

### Step 4.4: Test Webhook (Optional)

1. Click on your webhook
2. Click **"Send Test Event"**
3. Select `checkout.completed`
4. Click **"Send"**
5. Check your app logs to verify it received the webhook

---

## 5. Getting API Keys

### Step 5.1: Create Access Token

1. Go to **Settings** → **API Keys** or **Access Tokens**
2. Click **"Create Token"** or **"New Access Token"**
3. Fill in:
   - **Name:** `Humanify Production`
   - **Description:** `Production API access for HumanifyLab`
   - **Permissions:** Select:
     - ✅ Read products
     - ✅ Create checkouts
     - ✅ Read customers
     - ✅ Create customers
     - ✅ Read subscriptions
     - ✅ Update subscriptions (for cancellation)
4. Click **"Create"**

### Step 5.2: Copy Access Token

1. You'll see a token like: `polar_pat_abc123xyz...`
2. **COPY THIS IMMEDIATELY!** You can't see it again
3. Save it as `POLAR_ACCESS_TOKEN` in your `.env`

---

## 6. Configuring Your App

### Step 6.1: Update Environment Variables

Open your `Humanify/.env` file and add:

```env
# Polar Configuration
POLAR_ACCESS_TOKEN=polar_pat_YOUR_TOKEN_HERE
POLAR_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
POLAR_ENV=production

# Monthly Subscription Products
POLAR_PRODUCT_SMALL=prod_YOUR_BASIC_MONTHLY_ID
POLAR_PRODUCT_MEDIUM=prod_YOUR_PRO_MONTHLY_ID
POLAR_PRODUCT_LARGE=prod_YOUR_ULTRA_MONTHLY_ID

# Yearly Subscription Products
POLAR_PRODUCT_YEARLY_SMALL=prod_YOUR_BASIC_YEARLY_ID
POLAR_PRODUCT_YEARLY_MEDIUM=prod_YOUR_PRO_YEARLY_ID
POLAR_PRODUCT_YEARLY_LARGE=prod_YOUR_ULTRA_YEARLY_ID

# Top-Up Products
POLAR_CREDITS_5000=prod_YOUR_5K_TOPUP_ID
POLAR_CREDITS_20000=prod_YOUR_20K_TOPUP_ID
POLAR_CREDITS_45000=prod_YOUR_45K_TOPUP_ID
```

### Step 6.2: Update .env.example

Update `Humanify/.env.example` with placeholders:

```env
# Polar Configuration
POLAR_ACCESS_TOKEN=polar_pat_xxx
POLAR_WEBHOOK_SECRET=whsec_xxx
POLAR_ENV=production

# Monthly Subscription Products
POLAR_PRODUCT_SMALL=prod_xxx
POLAR_PRODUCT_MEDIUM=prod_xxx
POLAR_PRODUCT_LARGE=prod_xxx

# Yearly Subscription Products
POLAR_PRODUCT_YEARLY_SMALL=prod_xxx
POLAR_PRODUCT_YEARLY_MEDIUM=prod_xxx
POLAR_PRODUCT_YEARLY_LARGE=prod_xxx

# Top-Up Products
POLAR_CREDITS_5000=prod_xxx
POLAR_CREDITS_20000=prod_xxx
POLAR_CREDITS_45000=prod_xxx
```

### Step 6.3: Restart Your App

```bash
# Stop your development server (Ctrl+C)
# Restart it
npm run dev
```

---

## 7. Testing

### Step 7.1: Test Product Fetching

1. Open your browser
2. Go to: `http://localhost:3050/api/polar/products`
3. You should see JSON with your products:
```json
[
  {
    "key": "small",
    "name": "Basic Plan",
    "monthly": { "id": "prod_xxx", "displayPrice": "$9.99/month" },
    "yearly": { "id": "prod_xxx", "displayPrice": "$95.90/year" }
  },
  // ... more products
]
```

### Step 7.2: Test Top-Ups Fetching

1. Go to: `http://localhost:3050/api/polar/topups`
2. You should see JSON with your top-ups:
```json
[
  {
    "id": "prod_xxx",
    "name": "5,000 Words Top-Up",
    "displayPrice": "$9.99"
  },
  // ... more top-ups
]
```

### Step 7.3: Test Checkout Creation

1. Log in to your app
2. Go to the pricing page
3. Click **"Subscribe"** on any plan
4. You should be redirected to Polar's checkout page
5. **DO NOT complete payment yet** - this is just a test

### Step 7.4: Test Webhook (Using Polar Dashboard)

1. Go to Polar dashboard → **Webhooks**
2. Click on your webhook
3. Click **"Send Test Event"**
4. Select `checkout.completed`
5. Click **"Send"**
6. Check your app logs:
```
[Polar Webhook] Received webhook
[Polar Webhook] Event type: checkout.completed
```

### Step 7.5: Test Real Purchase (Optional)

**Warning:** This will charge real money!

1. Use Stripe test mode first (if available)
2. Or make a real purchase with a small amount
3. Complete the checkout
4. Check your database:
```sql
SELECT credits, subscriptionPlan, subscriptionType 
FROM "user" 
WHERE email = 'your-email@example.com';
```
5. Credits should be updated!

---

## Common Issues & Solutions

### Issue 1: "No products configured" Error

**Cause:** Product IDs not set in `.env`

**Solution:**
1. Check all 9 product IDs are in `.env`
2. Restart your app
3. Verify IDs match Polar dashboard

### Issue 2: Webhook Signature Validation Fails

**Cause:** Wrong webhook secret

**Solution:**
1. Go to Polar → Webhooks
2. Delete old webhook
3. Create new webhook
4. Copy new secret to `.env`
5. Restart app

### Issue 3: Checkout Creation Fails

**Cause:** Invalid access token or product ID

**Solution:**
1. Verify `POLAR_ACCESS_TOKEN` is correct
2. Verify product IDs exist in Polar
3. Check product is published (not draft)
4. Check API token has correct permissions

### Issue 4: Credits Not Updated After Payment

**Cause:** Webhook not received or processed

**Solution:**
1. Check webhook URL is correct
2. Check webhook events are selected
3. Check app logs for webhook errors
4. Test webhook manually from Polar dashboard

### Issue 5: "Product not found" in Webhook

**Cause:** Product ID mismatch

**Solution:**
1. Check product IDs in `.env` match Polar
2. Copy IDs directly from Polar dashboard
3. Don't use test/sandbox IDs in production

---

## Production Checklist

Before going live, verify:

### Polar Setup
- [ ] Stripe account connected and verified
- [ ] All 9 products created and published
- [ ] Product prices are correct
- [ ] Webhook created with correct URL
- [ ] Webhook events selected (checkout.completed, order.created, subscription.created)
- [ ] Access token created with correct permissions

### App Configuration
- [ ] All product IDs in `.env`
- [ ] Access token in `.env`
- [ ] Webhook secret in `.env`
- [ ] `POLAR_ENV=production`
- [ ] App deployed to production
- [ ] Webhook URL points to production (not localhost)

### Testing
- [ ] Products load on pricing page
- [ ] Checkout creation works
- [ ] Webhook receives events
- [ ] Credits update after payment
- [ ] Subscription details display correctly
- [ ] Subscription cancellation works

---

## Pricing Recommendations

Based on your credit system (1 credit = 1 word):

### Monthly Plans
- **Basic:** $9.99/month - 5,000 words
- **Pro:** $19.99/month - 20,000 words
- **Ultra:** $39.99/month - 45,000 words

### Yearly Plans (20% discount)
- **Basic:** $95.90/year (save $24)
- **Pro:** $191.90/year (save $48)
- **Ultra:** $383.90/year (save $96)

### Top-Ups (One-time)
- **5K Pack:** $9.99 (same as monthly basic)
- **20K Pack:** $29.99 (better value)
- **45K Pack:** $59.99 (best value)

---

## Support

If you need help:
1. **Polar Documentation:** https://docs.polar.sh
2. **Polar Discord:** https://discord.gg/polar
3. **Polar Support:** support@polar.sh

---

## Summary

You've now set up:
✅ Polar account and organization
✅ 9 products (3 monthly, 3 yearly, 3 top-ups)
✅ Webhook for payment notifications
✅ API access token
✅ App configuration

Your payment system is ready to accept payments! 🎉

---

**Last Updated:** February 1, 2026
**Status:** Complete Setup Guide
