# Requirements Document

## Introduction

The Affiliate Program feature enables HumanifyLab users to earn commissions by referring new paying customers. Any authenticated user can register as an affiliate and receive a unique referral code. When a referred user completes their first purchase via Polar, the affiliate earns a 25% one-time commission. Affiliates can request payouts in USDT via the Cryptomus Mass Payout API once their balance reaches the $15 minimum threshold. The system enforces a 7-day hold on new conversions, blocks self-referrals, and prevents duplicate conversions per referred user.

## Glossary

- **Affiliate**: An authenticated HumanifyLab user who has registered for the affiliate program and holds a unique referral code.
- **Referral_Code**: A unique, human-readable identifier assigned to an Affiliate upon registration (format: `humanify-NNN`).
- **Referred_User**: A visitor who arrives at HumanifyLab via a URL containing a valid `?ref=` query parameter and subsequently creates an account and makes a purchase.
- **Conversion**: A confirmed first payment by a Referred_User that triggers a commission for the Affiliate who referred them.
- **Commission**: A one-time payment equal to 25% of the Referred_User's first order amount, credited to the Affiliate's pending balance.
- **Pending_Balance**: The sum of commissions that are within the 7-day hold period and not yet available for payout.
- **Available_Balance**: The sum of commissions that have passed the 7-day hold period and are eligible for payout.
- **Payout**: A transfer of Available_Balance funds to an Affiliate's USDT wallet address via the Cryptomus Mass Payout API.
- **Payout_Threshold**: The minimum Available_Balance of $15.00 USD required before an Affiliate may request a Payout.
- **Hold_Period**: The 7-calendar-day window after a Conversion is recorded during which the Commission remains in Pending_Balance.
- **Referral_Cookie**: A browser cookie named `ref` storing the Referral_Code with a 30-day expiry, set when a visitor lands on a referral URL.
- **Self_Referral**: A situation where an Affiliate uses their own Referral_Code to make a purchase.
- **Cryptomus_API**: The Cryptomus Mass Payout API used to disburse USDT payouts to Affiliate wallet addresses.
- **Polar_Webhook**: The existing `order.created` webhook event from Polar that signals a completed first payment.
- **Affiliate_Dashboard**: The authenticated UI page where an Affiliate views stats, referral link, and requests payouts.
- **Commission_Rate**: Fixed at 25% of the first order amount.
- **System**: The HumanifyLab Next.js application including its API routes, database, and background jobs.

---

## Requirements

### Requirement 1: Affiliate Registration

**User Story:** As an authenticated HumanifyLab user, I want to register as an affiliate with a single click, so that I can start earning commissions immediately without waiting for approval.

#### Acceptance Criteria

1. WHEN an authenticated user submits a registration request, THE System SHALL create an Affiliate record and assign a unique Referral_Code in the format `humanify-NNN` where NNN is a zero-padded sequential integer.
2. THE System SHALL generate Referral_Codes sequentially, incrementing the counter by 1 for each new Affiliate registration.
3. IF an authenticated user attempts to register as an Affiliate when they already have an Affiliate record, THEN THE System SHALL return the existing Affiliate record without creating a duplicate.
4. THE System SHALL associate the Affiliate record with the user's Clerk ID.
5. WHEN an Affiliate record is created, THE System SHALL initialize the Affiliate's Pending_Balance and Available_Balance to $0.00.

---

### Requirement 2: Referral Link and Cookie Tracking

**User Story:** As an Affiliate, I want visitors who click my referral link to be tracked for 30 days, so that I receive credit for conversions even if the visitor doesn't purchase immediately.

#### Acceptance Criteria

1. WHEN a visitor loads any page on the System with a `?ref=` query parameter containing a valid Referral_Code, THE System SHALL set a Referral_Cookie named `ref` with the Referral_Code value and a 30-day expiry.
2. WHEN a visitor loads any page with a `?ref=` query parameter containing a Referral_Code that does not exist in the database, THE System SHALL ignore the parameter and not set a Referral_Cookie.
3. WHILE a Referral_Cookie is present in the visitor's browser, THE System SHALL read the Referral_Code from the cookie during checkout to associate the purchase with the correct Affiliate.
4. WHEN a visitor already has a Referral_Cookie and loads a page with a different valid `?ref=` parameter, THE System SHALL overwrite the existing Referral_Cookie with the new Referral_Code and reset the 30-day expiry.
5. THE System SHALL set the Referral_Cookie with `SameSite=Lax` and `Path=/` attributes.

---

### Requirement 3: Self-Referral Prevention

**User Story:** As the platform operator, I want to prevent affiliates from referring themselves, so that the commission system is not abused.

#### Acceptance Criteria

1. WHEN the Polar_Webhook receives an `order.created` event and the purchasing user's Clerk ID matches the Clerk ID of the Affiliate associated with the Referral_Code stored in the order metadata, THEN THE System SHALL skip commission creation and log the self-referral attempt.
2. WHEN a self-referral is detected, THE System SHALL still process the order normally (credits, plan update) and return a 200 response to Polar.

---

### Requirement 4: Commission Calculation on First Payment

**User Story:** As an Affiliate, I want to earn a 25% commission on the first payment of every user I refer, so that I am rewarded for bringing in paying customers.

#### Acceptance Criteria

1. WHEN the Polar_Webhook receives an `order.created` event and a valid Referral_Code is present in the order metadata, THE System SHALL check whether a Conversion already exists for the combination of the Referred_User's Clerk ID and the Affiliate's ID.
2. IF no prior Conversion exists for that Referred_User and Affiliate combination, THEN THE System SHALL create a Conversion record with the Commission amount equal to 25% of the order's `price_amount` converted from cents to dollars.
3. IF a Conversion already exists for that Referred_User and Affiliate combination, THEN THE System SHALL skip commission creation to enforce the one-conversion-per-referred-user rule.
4. WHEN a Conversion is created, THE System SHALL set its status to `pending` and record the `available_at` timestamp as 7 calendar days after the Conversion creation time.
5. WHEN a Conversion is created, THE System SHALL increment the Affiliate's Pending_Balance by the Commission amount.
6. THE System SHALL process commission logic only for `order.created` events, not for subscription renewals or other event types.

---

### Requirement 5: 7-Day Hold Period and Balance Release

**User Story:** As the platform operator, I want commissions to be held for 7 days before becoming available for payout, so that there is time to handle refunds before funds are disbursed.

#### Acceptance Criteria

1. THE System SHALL run a scheduled job at least once every 24 hours to identify Conversion records with status `pending` whose `available_at` timestamp is in the past.
2. WHEN the scheduled job identifies an eligible Conversion, THE System SHALL update the Conversion status to `available`, decrement the Affiliate's Pending_Balance by the Commission amount, and increment the Affiliate's Available_Balance by the Commission amount.
3. THE System SHALL process balance releases atomically per Conversion to prevent partial updates.

---

### Requirement 6: Payout Request

**User Story:** As an Affiliate, I want to request a payout of my available balance to my USDT wallet, so that I can receive my earned commissions.

#### Acceptance Criteria

1. WHEN an Affiliate submits a payout request, THE System SHALL validate that the Affiliate's Available_Balance is greater than or equal to the Payout_Threshold of $15.00.
2. IF the Affiliate's Available_Balance is below $15.00, THEN THE System SHALL reject the payout request with an error message indicating the minimum threshold.
3. WHEN an Affiliate submits a payout request, THE System SHALL validate that the provided USDT wallet address is a non-empty string of 26 to 62 characters.
4. IF the USDT wallet address fails validation, THEN THE System SHALL reject the payout request with a descriptive error message.
5. WHEN a valid payout request is submitted, THE System SHALL create a Payout record with status `processing`, decrement the Affiliate's Available_Balance by the full payout amount, and call the Cryptomus_API to initiate the transfer.
6. IF the Cryptomus_API call succeeds, THEN THE System SHALL update the Payout record status to `completed` and store the Cryptomus transaction ID.
7. IF the Cryptomus_API call fails, THEN THE System SHALL update the Payout record status to `failed`, restore the Affiliate's Available_Balance by the payout amount, and return an error message to the Affiliate.
8. WHILE a Payout record with status `processing` exists for an Affiliate, THE System SHALL reject any new payout requests from that Affiliate.

---

### Requirement 7: Referral Code Propagation to Checkout

**User Story:** As the platform operator, I want the referral code to be passed through the Polar checkout flow, so that the webhook can attribute commissions correctly.

#### Acceptance Criteria

1. WHEN an authenticated user initiates a Polar checkout and a Referral_Cookie is present in their browser, THE System SHALL include the Referral_Code as a `ref` key in the Polar checkout metadata.
2. WHEN an authenticated user initiates a Polar checkout and no Referral_Cookie is present, THE System SHALL not include a `ref` key in the checkout metadata.
3. THE System SHALL read the Referral_Code from the server-side cookie during checkout API route execution.

---

### Requirement 8: Affiliate Dashboard

**User Story:** As an Affiliate, I want a dashboard showing my referral stats and payout history, so that I can track my earnings and manage payouts.

#### Acceptance Criteria

1. WHEN an authenticated Affiliate visits the Affiliate_Dashboard, THE System SHALL display the Affiliate's Referral_Code, full referral URL, total number of referred users who converted, Pending_Balance, and Available_Balance.
2. WHEN an authenticated Affiliate visits the Affiliate_Dashboard, THE System SHALL display a list of the Affiliate's Payout records including date, amount, status, and Cryptomus transaction ID where available.
3. WHEN an authenticated user who has not registered as an Affiliate visits the Affiliate_Dashboard, THE System SHALL display a registration prompt and allow the user to register as an Affiliate.
4. WHEN an unauthenticated user visits the Affiliate_Dashboard, THE System SHALL redirect the user to the sign-in page.
5. THE Affiliate_Dashboard SHALL provide a copy-to-clipboard button for the full referral URL.
6. THE Affiliate_Dashboard SHALL provide a payout request form where the Affiliate can enter a USDT wallet address and submit a payout request.

---

### Requirement 9: Referral Code in Webhook Processing

**User Story:** As the platform operator, I want the Polar webhook to extract and validate the referral code from order metadata, so that commissions are attributed correctly and reliably.

#### Acceptance Criteria

1. WHEN the Polar_Webhook processes an `order.created` event, THE System SHALL extract the `ref` value from the order's `metadata` field.
2. IF the `ref` value is present, THEN THE System SHALL look up the Affiliate record by Referral_Code before processing commission logic.
3. IF no Affiliate record matches the `ref` value, THEN THE System SHALL skip commission processing and continue with normal order fulfillment.
4. THE System SHALL complete normal order fulfillment (credits, plan update) regardless of whether commission processing succeeds or fails.
