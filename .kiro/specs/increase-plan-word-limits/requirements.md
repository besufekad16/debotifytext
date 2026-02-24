# Requirements Document

## Introduction

This document specifies the requirements for increasing word limits across all subscription plans in the HumanifyLab application. The feature updates credit allocations for Basic, Pro, and Ultra plans while maintaining backward compatibility with existing subscriptions and ensuring consistency across all application touchpoints.

## Glossary

- **Credit_System**: The application's word tracking mechanism where 1 credit equals 1 word
- **Subscription_Plan**: A billing tier (Basic, Pro, or Ultra) that determines monthly word allocation
- **Word_Limit**: The maximum number of words (credits) a user can process per month based on their plan
- **Polar**: The third-party billing and subscription management service
- **Monthly_Reset**: The process of restoring credits to the plan limit at the start of each billing cycle
- **UI_Description**: User-facing text that describes plan features and limits
- **Webhook_Handler**: Server endpoint that processes subscription events from Polar
- **Product_Details**: Configuration mapping Polar product IDs to plan limits and features

## Requirements

### Requirement 1: Update Basic Plan Word Limit

**User Story:** As a Basic plan subscriber, I want an increased word limit from 5,000 to 7,000 words per month, so that I can process more content without upgrading.

#### Acceptance Criteria

1. THE Credit_System SHALL allocate 7,000 credits to new Basic plan subscriptions
2. THE Credit_System SHALL allocate 7,000 credits to existing Basic plan subscriptions at their next monthly reset
3. THE UI_Description SHALL display "7,000 words/month" for the Basic plan
4. WHEN a Basic plan subscription is created via Polar webhook, THE Webhook_Handler SHALL assign 7,000 credits
5. WHEN the monthly reset occurs, THE Credit_System SHALL restore Basic plan users to 7,000 credits

### Requirement 2: Update Pro Plan Word Limit

**User Story:** As a Pro plan subscriber, I want an increased word limit from 20,000 to 25,000 words per month, so that I can handle larger content volumes.

#### Acceptance Criteria

1. THE Credit_System SHALL allocate 25,000 credits to new Pro plan subscriptions
2. THE Credit_System SHALL allocate 25,000 credits to existing Pro plan subscriptions at their next monthly reset
3. THE UI_Description SHALL display "25,000 words/month" for the Pro plan
4. WHEN a Pro plan subscription is created via Polar webhook, THE Webhook_Handler SHALL assign 25,000 credits
5. WHEN the monthly reset occurs, THE Credit_System SHALL restore Pro plan users to 25,000 credits

### Requirement 3: Update Ultra Plan Word Limit

**User Story:** As an Ultra plan subscriber, I want an increased word limit from 45,000 to 50,000 words per month, so that I can process enterprise-level content volumes.

#### Acceptance Criteria

1. THE Credit_System SHALL allocate 50,000 credits to new Ultra plan subscriptions
2. THE Credit_System SHALL allocate 50,000 credits to existing Ultra plan subscriptions at their next monthly reset
3. THE UI_Description SHALL display "50,000 words/month" for the Ultra plan
4. WHEN an Ultra plan subscription is created via Polar webhook, THE Webhook_Handler SHALL assign 50,000 credits
5. WHEN the monthly reset occurs, THE Credit_System SHALL restore Ultra plan users to 50,000 credits

### Requirement 4: Maintain Consistency Across Application

**User Story:** As a user, I want to see consistent word limits displayed throughout the application, so that I have clear expectations about my plan's capabilities.

#### Acceptance Criteria

1. THE Product_Details configuration SHALL define word limits for all subscription plans
2. THE UI_Description in polar-products.ts SHALL reflect the updated word limits
3. THE Webhook_Handler getProductDetails function SHALL return the updated word limits
4. THE Credit_System annual reset logic in humanizer route SHALL use the updated word limits
5. THE Credit_System annual reset logic in humanizer stream route SHALL use the updated word limits
6. THE Monthly_Reset getPlanCredits function SHALL return the updated word limits

### Requirement 5: Preserve Backward Compatibility

**User Story:** As an existing subscriber, I want my subscription to continue working without interruption, so that the limit increase doesn't break my access.

#### Acceptance Criteria

1. WHEN word limits are updated, THE Credit_System SHALL continue to process existing user sessions
2. WHEN word limits are updated, THE Webhook_Handler SHALL continue to process subscription events
3. THE Credit_System SHALL apply new limits at the next monthly reset without requiring user action
4. WHEN a user has credits remaining from the old limit, THE Credit_System SHALL preserve those credits until the next reset
5. THE Credit_System SHALL not reduce any user's current credit balance during the update

### Requirement 6: Handle Both Monthly and Annual Subscriptions

**User Story:** As a subscriber with either monthly or annual billing, I want the word limit increase to apply correctly to my subscription type, so that I receive the appropriate credit allocation.

#### Acceptance Criteria

1. WHEN a monthly subscription resets, THE Credit_System SHALL allocate credits based on the updated plan limits
2. WHEN an annual subscription resets monthly, THE Credit_System SHALL allocate credits based on the updated plan limits
3. THE Webhook_Handler SHALL assign updated credit limits regardless of billing frequency
4. THE Credit_System SHALL treat monthly and annual subscriptions identically for credit allocation purposes

### Requirement 7: Update All Configuration Locations

**User Story:** As a developer, I want all word limit definitions updated in a single deployment, so that there are no inconsistencies between different parts of the application.

#### Acceptance Criteria

1. THE Product_Details in src/lib/polar-products.ts SHALL define the updated word limits
2. THE Webhook_Handler in src/app/api/webhooks/polar/route.ts SHALL use the updated word limits
3. THE Credit_System in src/app/api/humanizer/route.ts SHALL use the updated word limits for annual resets
4. THE Credit_System in src/app/api/humanizer/stream/route.ts SHALL use the updated word limits for annual resets
5. THE Monthly_Reset in src/app/api/cron/reset-credits/route.ts SHALL use the updated word limits
