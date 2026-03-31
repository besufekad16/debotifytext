# Polar Product Setup Guide

This guide will help you create the necessary products in Polar and get their IDs to configure your application.

> **IMPORTANT**: The codebase processes "Monthly" and "Yearly" plans separately. To ensure the correct price is displayed on your website, you should create **separate products** for the Monthly and Yearly versions of each plan (e.g., "Basic Monthly" and "Basic Yearly").

## 1. Setup Meters (Prerequisite)

Ensure you have created the "Word Usage" meter as described in `POLAR_QUICK_SETUP.md`.
- **Name**: `Word Usage`
- **Aggregation**: `Sum` on `metadata.word_count`

---

## 2. Subscription Products (Create 6 Total)

For each plan (Basic, Pro, Ultra), create two products: one for **Monthly** and one for **Yearly**.

### A. Basic Plan

#### 1. Basic (Monthly)
- **Name**: `Basic Plan (Monthly)`
- **Description**: (Copy/Paste)
  ```
  • 5,000 words / mo
  • Up to 600 words per request
  • Basic Humanization Engine
  • Bypass all AI detectors
  • Error free rewriting
  ```
- **Pricing**: Subscription -> **Monthly** -> **$9**
- **Metered Price**: Add price -> Metered -> Link "Word Usage" -> Rate (e.g. $0.01 per word)
- **Action**: Create Product, then **copy the Product ID** from the URL.
  - *URL Format*: `https://polar.sh/dashboard/.../products/PRODUCT_ID_IS_HERE`

#### 2. Basic (Yearly)
- **Name**: `Basic Plan (Yearly)`
- **Description**: Same as above
- **Pricing**: Subscription -> **Yearly** -> **$90** (example)
- **Metered Price**: Add price -> Metered -> Link "Word Usage" -> Rate (e.g. $0.01 per word)
- **Action**: Create Product, then **copy the Product ID**.

---

### B. Pro Plan

#### 3. Pro (Monthly)
- **Name**: `Pro Plan (Monthly)`
- **Description**: (Copy/Paste)
  ```
  • 20,000 words / mo
  • Up to 2,000 words per request
  • Faster processing
  • Advanced Humanization Engine
  • All core humanization presets
  • Priority email support
  ```
- **Pricing**: Subscription -> **Monthly** -> **$29**
- **Metered Price**: Rate (e.g. $0.008 per word)
- **Action**: Create Product, copy Product ID.

#### 4. Pro (Yearly)
- **Name**: `Pro Plan (Yearly)`
- **Description**: Same as above
- **Pricing**: Subscription -> **Yearly** -> **$290**
- **Metered Price**: Rate (e.g. $0.008 per word)
- **Action**: Create Product, copy Product ID.

---

### C. Ultra Plan

#### 5. Ultra (Monthly)
- **Name**: `Ultra Plan (Monthly)`
- **Description**: (Copy/Paste)
  ```
  • 45,000 words / mo
  • Up to 3,000 words per request
  • Priority processing
  • Advanced Humanization Engine
  • API access for integrations
  • Dedicated support & onboarding
  ```
- **Pricing**: Subscription -> **Monthly** -> **$79**
- **Metered Price**: Rate (e.g. $0.005 per word)
- **Action**: Create Product, copy Product ID.

#### 6. Ultra (Yearly)
- **Name**: `Ultra Plan (Yearly)`
- **Description**: Same as above
- **Pricing**: Subscription -> **Yearly** -> **$790**
- **Metered Price**: Rate (e.g. $0.005 per word)
- **Action**: Create Product, copy Product ID.

---

## 3. Top-Up Products (One-Time Purchases)

Create these as "One-Time" products (not subscriptions).

#### 7. 5,000 Credits
- **Name**: `5,000 Word Credits`
- **Pricing**: One-Time -> **$5** (example)
- **Action**: Copy Product ID.

#### 8. 20,000 Credits
- **Name**: `20,000 Word Credits`
- **Pricing**: One-Time -> **$15** (example)
- **Action**: Copy Product ID.

#### 9. 45,000 Credits
- **Name**: `45,000 Word Credits`
- **Pricing**: One-Time -> **$30** (example)
- **Action**: Copy Product ID.

---

## 4. Configuration

Open your `.env` file and paste the matching IDs:

```env
# Subscriptions
POLAR_PRODUCT_SMALL="<Paste Basic Monthly ID>"
POLAR_PRODUCT_YEARLY_SMALL="<Paste Basic Yearly ID>"

POLAR_PRODUCT_MEDIUM="<Paste Pro Monthly ID>"
POLAR_PRODUCT_YEARLY_MEDIUM="<Paste Pro Yearly ID>"

POLAR_PRODUCT_LARGE="<Paste Ultra Monthly ID>"
POLAR_PRODUCT_YEARLY_LARGE="<Paste Ultra Yearly ID>"

# Top-Ups (One-time)
POLAR_CREDITS_5000="<Paste 5k Credits ID>"
POLAR_CREDITS_20000="<Paste 20k Credits ID>"
POLAR_CREDITS_45000="<Paste 45k Credits ID>"
```
