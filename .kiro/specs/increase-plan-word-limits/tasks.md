# Implementation Plan: Increase Plan Word Limits

## Overview

This implementation updates word limit constants across 5 files to increase subscription plan limits (Basic: 5k→7k, Pro: 20k→25k, Ultra: 45k→50k). All changes must be made atomically in a single commit to ensure consistency across the application.

## Tasks

- [x] 1. Update product configuration and UI descriptions
  - [x] 1.1 Update UI_DESCRIPTIONS in src/lib/polar-products.ts
    - Change Basic plan: "5,000 words" → "7,000 words"
    - Change Pro plan: "20,000 words" → "25,000 words"
    - Change Ultra plan: "45,000 words" → "50,000 words"
    - Per-request limits remain unchanged (600, 2000, 3000)
    - _Requirements: 1.3, 2.3, 3.3, 4.2_

- [x] 2. Update webhook credit allocation
  - [x] 2.1 Update getPlanConfig function in src/app/api/webhooks/polar/route.ts
    - Change Basic plan credits: 5000 → 7000
    - Change Pro plan credits: 20000 → 25000
    - Change Ultra plan credits: 45000 → 50000
    - maxWords values remain unchanged (600, 2000, 3000)
    - _Requirements: 1.1, 1.4, 2.1, 2.4, 3.1, 3.4, 4.3_

- [x] 3. Update API validation logic
  - [x] 3.1 Update planCredits ternary in src/app/api/humanizer/route.ts
    - Change basic plan: 5000 → 7000
    - Change pro plan: 20000 → 25000
    - Change ultra plan: 45000 → 50000
    - _Requirements: 1.5, 2.5, 3.5, 4.4, 7.3_
  
  - [x] 3.2 Update planCredits ternary in src/app/api/humanizer/stream/route.ts
    - Change basic plan: 5000 → 7000
    - Change pro plan: 20000 → 25000
    - Change ultra plan: 45000 → 50000
    - _Requirements: 1.5, 2.5, 3.5, 4.5, 7.4_

- [x] 4. Update monthly credit reset logic
  - [x] 4.1 Update getPlanCredits function in src/app/api/cron/reset-credits/route.ts
    - Change basic case: return 5000 → return 7000
    - Change pro case: return 20000 → return 25000
    - Change ultra case: return 45000 → return 50000
    - Change default case: return 5000 → return 7000
    - _Requirements: 1.2, 1.5, 2.2, 2.5, 3.2, 3.5, 4.6, 6.1, 6.2, 7.5_

- [x] 5. Verify atomic deployment
  - [x] 5.1 Confirm all 5 files updated in single commit
    - Verify git diff shows changes to all 5 files
    - Ensure no other files modified
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 6. Write property-based tests for consistency
  - [ ]* 6.1 Write property test for credit allocation consistency
    - **Property 1: Credit allocation consistency**
    - **Validates: Requirements 1.1, 1.2**
    - Test that webhook credits match cron reset credits for all plans
    - Use fast-check to generate plan names ('basic', 'pro', 'ultra')
    - Assert getPlanConfig credits equal getPlanCredits for each plan
  
  - [ ]* 6.2 Write property test for validation consistency
    - **Property 2: Validation consistency**
    - **Validates: Requirements 1.3**
    - Test that maxWordsPerRequest matches plan allocation
    - Use fast-check to generate plan names
    - Assert getPlanConfig maxWords equals expected per-request limits
  
  - [ ]* 6.3 Write property test for UI display accuracy
    - **Property 3: UI display accuracy**
    - **Validates: Requirements 1.4**
    - Test that UI descriptions match allocated credits
    - Use fast-check to generate tier names ('small', 'medium', 'large')
    - Parse word limit from UI_DESCRIPTIONS and compare to getPlanConfig
  
  - [ ]* 6.4 Write property test for reset consistency
    - **Property 4: Reset consistency**
    - **Validates: Requirements 1.5**
    - Test that reset credits match webhook allocation
    - Use fast-check to generate plan names
    - Assert getPlanCredits equals getPlanConfig credits for each plan

- [ ]* 7. Write unit tests for updated functions
  - [ ]* 7.1 Write unit tests for getPlanConfig
    - Test Basic plan returns 7000 credits and 600 maxWords
    - Test Pro plan returns 25000 credits and 2000 maxWords
    - Test Ultra plan returns 50000 credits and 3000 maxWords
    - Test invalid product ID returns null
    - _Requirements: 1.1, 2.1, 3.1_
  
  - [ ]* 7.2 Write unit tests for getPlanCredits
    - Test 'basic' returns 7000
    - Test 'pro' returns 25000
    - Test 'ultra' returns 50000
    - Test default case returns 7000
    - _Requirements: 1.2, 2.2, 3.2_
  
  - [ ]* 7.3 Write unit tests for UI_DESCRIPTIONS
    - Test Basic description contains "7,000 words"
    - Test Pro description contains "25,000 words"
    - Test Ultra description contains "50,000 words"
    - Test per-request limits unchanged (600, 2000, 3000)
    - _Requirements: 1.3, 2.3, 3.3_

- [x] 8. Checkpoint - Verify all changes complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 9. Manual testing and verification
  - [ ]* 9.1 Test new subscription flow
    - Create test subscription for Basic plan
    - Verify user receives 7000 credits
    - Verify maxWordsPerRequest set to 600
    - _Requirements: 1.1, 1.4_
  
  - [ ]* 9.2 Test Pro subscription flow
    - Create test subscription for Pro plan
    - Verify user receives 25000 credits
    - Verify maxWordsPerRequest set to 2000
    - _Requirements: 2.1, 2.4_
  
  - [ ]* 9.3 Test Ultra subscription flow
    - Create test subscription for Ultra plan
    - Verify user receives 50000 credits
    - Verify maxWordsPerRequest set to 3000
    - _Requirements: 3.1, 3.4_
  
  - [ ]* 9.4 Test API validation boundaries
    - Submit 700 word request as Basic user (should reject)
    - Submit 500 word request as Basic user (should accept)
    - Submit 2500 word request as Pro user (should reject)
    - Submit 1500 word request as Pro user (should accept)
    - Submit 3500 word request as Ultra user (should reject)
    - Submit 2500 word request as Ultra user (should accept)
    - _Requirements: 1.3, 2.3, 3.3_
  
  - [ ]* 9.5 Test backward compatibility
    - Verify existing user with 3000 credits retains balance
    - Verify existing user with 15000 credits retains balance
    - Trigger monthly reset for annual subscriber
    - Verify credits reset to new plan limits
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 9.6 Verify UI displays new limits
    - Check pricing page shows "7,000 words/month" for Basic
    - Check pricing page shows "25,000 words/month" for Pro
    - Check pricing page shows "50,000 words/month" for Ultra
    - _Requirements: 1.3, 2.3, 3.3, 4.2_
  
  - [ ]* 9.7 Test credit reset cron job
    - Create annual subscriber with past nextResetDate
    - Trigger cron job manually
    - Verify credits reset to correct amount based on plan
    - Verify nextResetDate updated correctly
    - _Requirements: 1.2, 1.5, 2.2, 2.5, 3.2, 3.5, 6.1, 6.2_

- [ ] 10. Final checkpoint - Deployment verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster deployment
- All code changes (tasks 1-5) must be completed in a single atomic commit
- Property-based tests validate consistency across all configuration locations
- Manual testing verifies end-to-end functionality and backward compatibility
- No database migrations required - only constant value updates
- Zero downtime deployment - changes are backward compatible
