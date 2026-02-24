# Subscription-Based Humanization Adapter Selection

## Overview
Implement intelligent adapter selection based on user subscription status to provide different humanization quality levels for free/basic users vs. subscribed (pro/ultra) users.

## Problem Statement
Currently, all users (free and subscribed) use the same humanization adapter (`aistudios.ts`), which provides the same quality output regardless of subscription level. This doesn't incentivize upgrades and doesn't differentiate the value proposition between free and paid tiers.

## Solution
Use two different AI adapters based on subscription status:
- **Free/Basic users**: Use `aistudio99%.ts` (template-based approach with 99% human detection bypass)
- **Pro/Ultra users**: Use `aistudios.ts` (advanced AI-powered humanization with better quality)

## User Stories

### 1. As a free user
**I want** to receive humanized text that bypasses AI detection  
**So that** I can use the service without paying  
**Acceptance Criteria:**
- Free users automatically use the `aistudio99%.ts` adapter
- Output uses template-based humanization (sandwich method)
- No errors or degraded experience
- Clear indication that upgrading provides better quality

### 2. As a subscribed user (Pro/Ultra)
**I want** to receive higher quality humanized text  
**So that** I get value for my subscription  
**Acceptance Criteria:**
- Pro and Ultra users automatically use the `aistudios.ts` adapter
- Output uses advanced AI humanization
- Seamless experience with no manual selection needed
- Better quality and more natural output than free tier

### 3. As a basic plan user
**I want** to receive the same quality as free users  
**So that** I understand the value of upgrading to Pro/Ultra  
**Acceptance Criteria:**
- Basic plan users use `aistudio99%.ts` adapter (same as free)
- Clear messaging about Pro/Ultra benefits
- Smooth upgrade path

### 4. As a team member
**I want** to use the adapter based on my team owner's subscription  
**So that** team benefits are shared  
**Acceptance Criteria:**
- Team members inherit adapter selection from team owner's plan
- Billing user's subscription determines adapter choice
- No confusion about which adapter is being used

### 5. As a developer
**I want** the adapter selection to be automatic and maintainable  
**So that** the system is reliable and easy to update  
**Acceptance Criteria:**
- Single source of truth for adapter selection logic
- No code duplication
- Easy to test and debug
- Clear logging of which adapter is used

## Technical Requirements

### 1. Adapter Selection Logic
- Create a utility function to determine which adapter to use
- Input: User subscription plan
- Output: Adapter instance (either `aistudios` or `aistudios99%`)
- Logic:
  - `null`, `'free'`, `'basic'` → Use `aistudio99%.ts`
  - `'pro'`, `'ultra'` → Use `aistudios.ts`

### 2. Integration Points
- **Non-streaming endpoint**: `src/app/api/humanizer/route.ts`
- **Streaming endpoint**: `src/app/api/humanizer/stream/route.ts`
- Both endpoints must use the same selection logic

### 3. Adapter Compatibility
- Both adapters must implement the same interface:
  - `humanizeText(text, options)` → Returns `HumanizeResult`
  - `humanizeTextStream(text, options)` → Returns `ReadableStream`
- Options must include `isFreeUser` flag for adapter-specific behavior

### 4. Error Handling
- If adapter selection fails, default to free tier adapter
- Log all adapter selection decisions
- Graceful fallback if preferred adapter fails

### 5. Testing Requirements
- Unit tests for adapter selection logic
- Integration tests for both endpoints
- Test all subscription tiers
- Test team member scenarios
- Test error scenarios

## Non-Functional Requirements

### Performance
- Adapter selection must be instant (< 1ms)
- No additional API calls for selection
- No impact on streaming performance

### Reliability
- Must work for all subscription states
- Graceful degradation if adapter fails
- Clear error messages

### Maintainability
- Single function for adapter selection
- Easy to add new subscription tiers
- Clear documentation

### Security
- No exposure of adapter selection logic to frontend
- Validate subscription status server-side
- Prevent adapter manipulation

## Out of Scope
- Frontend UI changes (users don't need to know which adapter is used)
- Pricing changes
- New subscription tiers
- Adapter algorithm changes

## Success Metrics
- ✅ All free/basic users use template-based adapter
- ✅ All pro/ultra users use advanced adapter
- ✅ No errors in adapter selection
- ✅ Clear logs showing adapter usage
- ✅ No performance degradation

## Dependencies
- Existing adapters: `aistudios.ts` and `aistudio99%.ts`
- User subscription data from database
- Team ownership logic

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Adapter interface mismatch | High | Verify both adapters have identical interfaces |
| Performance degradation | Medium | Benchmark adapter selection |
| Wrong adapter selected | High | Comprehensive testing of all subscription states |
| Team billing confusion | Medium | Clear logging and documentation |

## Timeline
- Design & Planning: 30 minutes
- Implementation: 1 hour
- Testing: 30 minutes
- Documentation: 15 minutes
- **Total: ~2 hours**

## Next Steps
1. Review and approve requirements
2. Create design document
3. Implement adapter selection utility
4. Update both API endpoints
5. Test all scenarios
6. Deploy and monitor
