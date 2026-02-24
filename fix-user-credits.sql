-- Manual Credit Fix Script
-- Use this to manually update credits for users whose purchases didn't process

-- 1. First, find the user by email
SELECT 
  id, 
  "clerkId", 
  email, 
  name,
  credits, 
  "extraCredits",
  "subscriptionPlan",
  "subscriptionType",
  "productId",
  "maxWordsPerRequest",
  "polarCustomerId",
  "polarSubscriptionId"
FROM "user" 
WHERE email = 'USER_EMAIL_HERE';

-- 2. Update for Monthly Pro Plan (20,000 words)
UPDATE "user" 
SET 
  credits = 20000,
  "subscriptionPlan" = 'pro',
  "subscriptionType" = 'monthly',
  "productId" = '84637abc-8afb-4be3-b54f-e77e9680186f',
  "maxWordsPerRequest" = 2000,
  "updatedAt" = NOW()
WHERE email = 'USER_EMAIL_HERE';

-- 3. Update for Monthly Basic Plan (5,000 words)
UPDATE "user" 
SET 
  credits = 5000,
  "subscriptionPlan" = 'basic',
  "subscriptionType" = 'monthly',
  "productId" = '8dfb1747-cc3c-4138-b10a-3f538b5b0b86',
  "maxWordsPerRequest" = 600,
  "updatedAt" = NOW()
WHERE email = 'USER_EMAIL_HERE';

-- 4. Update for Monthly Ultra Plan (45,000 words)
UPDATE "user" 
SET 
  credits = 45000,
  "subscriptionPlan" = 'ultra',
  "subscriptionType" = 'monthly',
  "productId" = '4f2b7a4c-198d-4923-b4bc-24298832ab09',
  "maxWordsPerRequest" = 3000,
  "updatedAt" = NOW()
WHERE email = 'USER_EMAIL_HERE';

-- 5. Update for Yearly Pro Plan (20,000 words)
UPDATE "user" 
SET 
  credits = 20000,
  "subscriptionPlan" = 'pro',
  "subscriptionType" = 'annual',
  "productId" = 'ea63fc3e-9f0a-4f83-b3d4-cb39a1074025',
  "maxWordsPerRequest" = 2000,
  "nextResetDate" = DATE_TRUNC('month', NOW() + INTERVAL '1 month'),
  "updatedAt" = NOW()
WHERE email = 'USER_EMAIL_HERE';

-- 6. Add Top-Up Credits (doesn't change plan)
UPDATE "user" 
SET 
  "extraCredits" = "extraCredits" + 20000,
  "updatedAt" = NOW()
WHERE email = 'USER_EMAIL_HERE';

-- 7. Verify the update
SELECT 
  id, 
  email, 
  credits, 
  "extraCredits",
  "subscriptionPlan",
  "subscriptionType",
  "maxWordsPerRequest",
  "updatedAt"
FROM "user" 
WHERE email = 'USER_EMAIL_HERE';
