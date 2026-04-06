# Implementation Plan: Affiliate Program

## Overview

Implement a referral-based commission system: Prisma models → Cryptomus utility → API routes → middleware → webhook/checkout updates → dashboard UI → property tests. Each step builds on the previous so no code is left unintegrated.

## Tasks

- [x] 1. Add Prisma schema models and run migration
  - Add `Affiliate`, `AffiliateConversion`, and `AffiliatePayout` models to `prisma/schema.prisma` exactly as specified in the design
  - Add `affiliate` relation field to the existing `User` model (optional back-relation via `clerkId`)
  - Run `npx prisma migrate dev --name add-affiliate-program` to generate and apply the migration
  - Run `npx prisma generate` to regenerate the Prisma client
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 4.1, 4.4, 5.2, 6.5_

- [x] 2. Add environment variables
  - Append `CRYPTOMUS_MERCHANT_ID`, `CRYPTOMUS_API_KEY`, and `CRON_SECRET` to `.env` and `.env.example`
  - Add the three variables to `src/env.js` (or `src/env.ts`) validation schema so they are type-safe at runtime
  - _Requirements: 6.5_

- [x] 3. Implement Cryptomus client utility
  - Create `src/server/utils/cryptomus-client.ts`
  - Implement `signRequest(body: string): string` — computes `md5(base64(body) + CRYPTOMUS_API_KEY)`
  - Implement `sendPayout(params: { amount: string; walletAddress: string; orderId: string; network?: string }): Promise<{ success: boolean; cryptomusId?: string; error?: string }>` — POSTs to `https://api.cryptomus.com/v1/payout` with correct `merchant` and `sign` headers
  - _Requirements: 6.5, 6.6, 6.7_

  - [ ]* 3.1 Write unit test for Cryptomus signature computation
    - Verify `signRequest` produces the correct md5 hash for a known body/key pair
    - _Requirements: 6.5_

- [x] 4. Implement affiliate API routes
  - [x] 4.1 Create `src/app/api/affiliate/register/route.ts` (POST, Clerk-protected)
    - Look up existing `Affiliate` by `clerkId`; if found return it (idempotent)
    - Otherwise count existing affiliates, generate `humanify-NNN` code, create record with zero balances
    - Return `{ referralCode, referralUrl, pendingBalance, availableBalance }`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 4.2 Write property test for registration idempotence (Property 2)
    - `// Feature: affiliate-program, Property 2: Registration idempotence`
    - Use `fc.string()` as clerkId; call register handler twice with same clerkId; assert same code returned and exactly one DB record
    - _Requirements: 1.3, 1.4_

  - [ ]* 4.3 Write property test for new affiliate balance invariant (Property 3)
    - `// Feature: affiliate-program, Property 3: New affiliate balance invariant`
    - Use `fc.string()` as clerkId; register; assert `pendingBalance === 0` and `availableBalance === 0`
    - _Requirements: 1.5_

  - [ ]* 4.4 Write property test for referral code format and uniqueness (Property 1)
    - `// Feature: affiliate-program, Property 1: Referral code format and uniqueness`
    - Use `fc.array(fc.string(), { minLength: 1, maxLength: 50 })` as clerkIds; register each; assert every code matches `/^humanify-\d{3,}$/` and all codes are distinct
    - _Requirements: 1.1, 1.2_

  - [x] 4.5 Create `src/app/api/affiliate/me/route.ts` (GET, Clerk-protected)
    - Return `{ referralCode, referralUrl, conversionCount, pendingBalance, availableBalance, payouts[] }` where each payout includes `createdAt`, `amount`, `status`, `cryptomusId`
    - Return 404 if user is not yet an affiliate
    - _Requirements: 8.1, 8.2_

  - [ ]* 4.6 Write property test for affiliate stats completeness (Property 19)
    - `// Feature: affiliate-program, Property 19: Affiliate stats completeness`
    - Use `fc.record(...)` for affiliate with N payouts; assert response shape contains all required fields
    - _Requirements: 8.1, 8.2_

  - [x] 4.7 Create `src/app/api/affiliate/payout/route.ts` (POST, Clerk-protected)
    - Validate `availableBalance >= 15.00`; reject with 400 if not
    - Validate wallet address length 26–62 chars; reject with 400 if not
    - Check for existing `processing` payout; reject with 409 if found
    - Create `AffiliatePayout` with status `processing`, decrement `availableBalance`
    - Call `sendPayout` from cryptomus-client; on success set status `completed` + store `cryptomusId`; on failure restore balance + set status `failed`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ]* 4.8 Write property test for payout threshold enforcement (Property 13)
    - `// Feature: affiliate-program, Property 13: Payout threshold enforcement`
    - Use `fc.float({ min: 0, max: 100 })` as balance; assert request rejected iff `balance < 15.00`
    - _Requirements: 6.1, 6.2_

  - [ ]* 4.9 Write property test for wallet address length validation (Property 14)
    - `// Feature: affiliate-program, Property 14: Wallet address length validation`
    - Use `fc.string()` of varying lengths; assert reject if `len < 26 || len > 62`, accept otherwise
    - _Requirements: 6.3, 6.4_

  - [ ]* 4.10 Write property test for payout balance deduction (Property 15)
    - `// Feature: affiliate-program, Property 15: Payout balance deduction`
    - Use `fc.float({ min: 15, max: 1000 })` as availableBalance; assert after successful payout `availableBalance === 0` and payout record has status `processing`
    - _Requirements: 6.5_

  - [ ]* 4.11 Write property test for payout failure rollback (Property 16)
    - `// Feature: affiliate-program, Property 16: Payout failure rollback`
    - Mock Cryptomus to fail; assert `availableBalance` restored and payout status `failed`
    - _Requirements: 6.7_

  - [ ]* 4.12 Write property test for processing lock (Property 17)
    - `// Feature: affiliate-program, Property 17: Processing lock prevents concurrent payouts`
    - Seed a `processing` payout; assert new payout request returns 409
    - _Requirements: 6.8_

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Update Next.js middleware for ref cookie tracking
  - Create or update `middleware.ts` at the project root
  - On every request, check `request.nextUrl.searchParams.get('ref')`
  - If present, query DB for matching `Affiliate.referralCode`; if found set cookie `ref=<code>; Path=/; Max-Age=2592000; SameSite=Lax` on the response
  - If not found or param absent, pass through without modifying cookies
  - Ensure existing Clerk auth middleware logic is preserved
  - _Requirements: 2.1, 2.2, 2.4, 2.5_

  - [ ]* 6.1 Write property test for valid ref cookie being set (Property 4)
    - `// Feature: affiliate-program, Property 4: Valid ref cookie is set`
    - Mock DB lookup to return a valid affiliate; assert cookie `ref` is set with correct value and `Max-Age ≈ 2592000`
    - _Requirements: 2.1, 2.5_

  - [ ]* 6.2 Write property test for invalid ref being ignored (Property 5)
    - `// Feature: affiliate-program, Property 5: Invalid ref is ignored`
    - Mock DB lookup to return null; assert no `ref` cookie is set
    - _Requirements: 2.2_

  - [ ]* 6.3 Write property test for cookie overwrite (Property 6)
    - `// Feature: affiliate-program, Property 6: Cookie overwrite`
    - Simulate existing `ref=A` cookie; load page with `?ref=B` (valid); assert cookie updated to B with reset expiry
    - _Requirements: 2.4_

- [x] 7. Update Polar checkout route to inject ref cookie into metadata
  - In `src/app/api/polar/checkout/route.ts`, import `cookies` from `next/headers`
  - Read `cookies().get('ref')?.value`; if present, add `metadata: { ..., ref: refCode }` to the Polar checkout creation payload
  - If no cookie, omit the `ref` key entirely
  - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 7.1 Write property test for ref cookie injected into checkout metadata (Property 18)
    - `// Feature: affiliate-program, Property 18: Ref cookie injected into checkout metadata`
    - Use `fc.string()` as referral code in cookie; mock checkout creation; assert `metadata.ref` equals the cookie value
    - _Requirements: 7.1_

- [x] 8. Update Polar webhook to create affiliate conversions
  - In `src/app/api/webhooks/polar/route.ts`, after successful order fulfillment inside the `order.created` branch:
    - Extract `ref` from `data.metadata?.ref`
    - If present, look up `Affiliate` by `referralCode`
    - Check self-referral: skip if `affiliate.clerkId === clerkId`
    - Upsert `AffiliateConversion` using `orderId` as idempotency key (catch unique constraint violation)
    - On new conversion: set `status = "pending"`, `availableAt = now + 7 days`, `commission = priceAmount / 100 * 0.25`
    - Increment `affiliate.pendingBalance` by commission in the same transaction
    - Wrap commission logic in try/catch so any error does not affect the 200 response to Polar
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 9.1, 9.2, 9.3, 9.4_

  - [ ]* 8.1 Write property test for self-referral producing no conversion (Property 7)
    - `// Feature: affiliate-program, Property 7: Self-referral produces no conversion`
    - Use `fc.record({ clerkId: fc.string(), referralCode: fc.string() })` where buyer clerkId equals affiliate clerkId; assert no `AffiliateConversion` created
    - _Requirements: 3.1_

  - [ ]* 8.2 Write property test for commission calculation correctness (Property 8)
    - `// Feature: affiliate-program, Property 8: Commission calculation correctness`
    - Use `fc.integer({ min: 100, max: 1000000 })` as `price_amount` in cents; assert `commission === (price_amount / 100 * 0.25)` rounded to 2 decimal places
    - _Requirements: 4.2_

  - [ ]* 8.3 Write property test for conversion deduplication (Property 9)
    - `// Feature: affiliate-program, Property 9: Conversion deduplication`
    - Process same `orderId` twice; assert exactly one `AffiliateConversion` record and `pendingBalance` reflects only one commission
    - _Requirements: 4.1, 4.3_

  - [ ]* 8.4 Write property test for new conversion state invariant (Property 10)
    - `// Feature: affiliate-program, Property 10: New conversion state invariant`
    - For any new conversion; assert `status === "pending"` and `availableAt` is within 1 second of `createdAt + 7 days`
    - _Requirements: 4.4_

  - [ ]* 8.5 Write property test for pending balance increment (Property 11)
    - `// Feature: affiliate-program, Property 11: Pending balance increment on conversion`
    - Use `fc.float()` for balance B and commission C; assert `pendingBalance === B + C` after conversion
    - _Requirements: 4.5_

  - [ ]* 8.6 Write property test for order fulfillment independence (Property 20)
    - `// Feature: affiliate-program, Property 20: Order fulfillment is independent of commission outcome`
    - Use `fc.record(...)` for order events with various ref states (invalid, self-referral, duplicate); assert user credits always updated correctly
    - _Requirements: 9.4_

- [x] 9. Implement cron job route for hold period release
  - Create `src/app/api/cron/affiliate-release/route.ts` (POST)
  - Validate `Authorization: Bearer <CRON_SECRET>` header; return 401 if missing or wrong
  - Query all `AffiliateConversion` where `status = "pending"` and `availableAt <= now()`
  - For each conversion, run a Prisma transaction: update conversion `status = "available"`, decrement `affiliate.pendingBalance`, increment `affiliate.availableBalance`
  - Wrap each conversion in its own try/catch so one failure does not block others
  - Return `{ released: N }` on success
  - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 9.1 Write property test for hold release balance transfer (Property 12)
    - `// Feature: affiliate-program, Property 12: Hold release balance transfer`
    - Use `fc.array(fc.record({ commission: fc.float({ min: 0.01, max: 500 }) }))` of past-due conversions; run cron handler; assert each conversion status `available`, `pendingBalance` decreased by sum, `availableBalance` increased by same sum
    - _Requirements: 5.2_

- [x] 10. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Build affiliate dashboard page
  - [x] 11.1 Create `src/app/affiliate/page.tsx` (Server Component, Clerk-protected)
    - Redirect unauthenticated users to sign-in via Clerk's `auth()` helper
    - Fetch `/api/affiliate/me`; if 404, render registration prompt with a "Join Affiliate Program" button that calls `POST /api/affiliate/register`
    - If affiliate exists, render stats: referral URL with copy-to-clipboard button, conversion count, pending balance, available balance
    - Render payout history table: date, amount, status, Cryptomus ID
    - Render payout request form: wallet address input + submit button (calls `POST /api/affiliate/payout`)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 11.2 Create `src/app/affiliate/actions.ts` (Server Actions or client fetch helpers)
    - `registerAffiliate()` — POST to `/api/affiliate/register`, return result
    - `requestPayout(walletAddress: string)` — POST to `/api/affiliate/payout`, return result
    - _Requirements: 8.3, 8.6_

- [x] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical boundaries
- Property tests use fast-check and are tagged with `// Feature: affiliate-program, Property N: ...`
- Unit tests validate specific examples; property tests validate universal correctness properties
- The Polar webhook commission logic is wrapped in try/catch so order fulfillment is never blocked (Requirement 9.4)
