-- Check user status for segnia05@gmail.com
-- Run this in your database to see the current state

SELECT 
  id,
  email,
  "clerkId",
  credits,
  "extraCredits",
  "subscriptionPlan",
  "subscriptionType",
  "productId",
  "polarCustomerId",
  "polarSubscriptionId",
  "maxWordsPerRequest",
  "createdAt",
  "updatedAt"
FROM "user"
WHERE email = 'segnia05@gmail.com';

-- If user doesn't exist, you'll need to sign up first
-- If user exists, you'll see their current credit balance and subscription status
