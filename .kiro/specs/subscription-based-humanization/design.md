# Design: Subscription-Based Humanization Adapter Selection

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     API Request (Humanize Text)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Get User & Determine Billing User                   │
│  - Fetch user from database                                      │
│  - Check if team member → use team owner as billing user         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Adapter Selection Logic                             │
│                                                                   │
│  getHumanizationAdapter(subscriptionPlan)                        │
│                                                                   │
│  IF plan is null, 'free', or 'basic':                            │
│    → Return aiStudios99 (template-based)                         │
│  ELSE IF plan is 'pro' or 'ultra':                               │
│    → Return aiStudios (advanced AI)                              │
│  ELSE:                                                            │
│    → Default to aiStudios99 (safe fallback)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Call Selected Adapter                               │
│                                                                   │
│  adapter.humanizeText(text, options)                             │
│  OR                                                               │
│  adapter.humanizeTextStream(text, options)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Return Humanized Text to User                       │
└─────────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. Adapter Selection Utility

**File**: `src/server/utils/adapter-selector.ts`

```typescript
import { aiStudios } from "~/server/adapters/aistudios";
import { aiStudios as aiStudios99 } from "~/server/adapters/aistudio99%";

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'ultra' | null;

export interface HumanizationAdapter {
  humanizeText(text: string, options?: any): Promise<any>;
  humanizeTextStream(text: string, options?: any): Promise<ReadableStream>;
}

/**
 * Selects the appropriate humanization adapter based on subscription plan
 * 
 * @param subscriptionPlan - User's subscription plan
 * @returns Adapter instance to use for humanization
 * 
 * Logic:
 * - Free/Basic users → Template-based adapter (99% human detection)
 * - Pro/Ultra users → Advanced AI adapter (better quality)
 * - Unknown/null → Default to template-based (safe fallback)
 */
export function getHumanizationAdapter(
  subscriptionPlan: SubscriptionPlan
): HumanizationAdapter {
  const plan = subscriptionPlan?.toLowerCase();
  
  // Pro and Ultra users get advanced AI adapter
  if (plan === 'pro' || plan === 'ultra') {
    console.log(`[Adapter Selection] Using advanced AI adapter for ${plan} user`);
    return aiStudios;
  }
  
  // Free, Basic, and unknown users get template-based adapter
  console.log(`[Adapter Selection] Using template-based adapter for ${plan || 'free'} user`);
  return aiStudios99;
}

/**
 * Helper to determine if user should use premium adapter
 */
export function isPremiumUser(subscriptionPlan: SubscriptionPlan): boolean {
  const plan = subscriptionPlan?.toLowerCase();
  return plan === 'pro' || plan === 'ultra';
}
```

### 2. Integration with Non-Streaming Endpoint

**File**: `src/app/api/humanizer/route.ts`

**Changes**:
1. Import adapter selector utility
2. Replace direct `aiStudios` import with dynamic selection
3. Select adapter based on billing user's plan
4. Pass adapter to humanization call

```typescript
// OLD:
import { aiStudios } from "~/server/adapters/aistudios";

// NEW:
import { getHumanizationAdapter } from "~/server/utils/adapter-selector";

// ... in POST handler ...

// Select adapter based on billing user's subscription
const adapter = getHumanizationAdapter(billingUser.subscriptionPlan);

// Use selected adapter
const aiResult = await adapter.humanizeText(text, {
  maxTokens: 4000,
  preset: selectedTone,
  tone: selectedTone,
  model: requestedModel,
  isFreeUser: !isPremiumUser(billingUser.subscriptionPlan),
  ...options,
});
```

### 3. Integration with Streaming Endpoint

**File**: `src/app/api/humanizer/stream/route.ts`

**Changes**:
1. Import adapter selector utility
2. Replace direct `aiStudios` import with dynamic selection
3. Select adapter based on billing user's plan
4. Pass adapter to streaming call

```typescript
// OLD:
import { aiStudios } from "~/server/adapters/aistudios";

// NEW:
import { getHumanizationAdapter } from "~/server/utils/adapter-selector";

// ... in POST handler ...

// Select adapter based on billing user's subscription
const adapter = getHumanizationAdapter(billingUser.subscriptionPlan);

// Use selected adapter for streaming
stream = await adapter.humanizeTextStream(text, {
  temperature: options.temperature,
  maxTokens: maxTokens,
  preset: selectedPreset,
  tone: selectedPreset,
  model: options.model || DEFAULT_MODEL,
  isFreeUser: !isPremiumUser(billingUser.subscriptionPlan),
  ...options,
});
```

## Adapter Interface Verification

Both adapters must implement:

```typescript
interface HumanizationAdapter {
  // Non-streaming method
  humanizeText(
    text: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      preset?: string;
      stream?: boolean;
      model?: string;
      isFreeUser?: boolean;
    }
  ): Promise<{
    success: boolean;
    humanizedText: string;
    tokensUsed: number;
    metadata: {
      model?: string;
      finishReason?: string;
      source: string;
      fallback?: boolean;
      message?: string;
      [key: string]: any;
    };
    error?: string;
  }>;

  // Streaming method
  humanizeTextStream(
    text: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      preset?: string;
      model?: string;
      isFreeUser?: boolean;
    }
  ): Promise<ReadableStream>;
}
```

## Logging Strategy

### Adapter Selection Logs
```typescript
console.log(`[Adapter Selection] User: ${userId}, Plan: ${subscriptionPlan}, Adapter: ${adapterName}`);
```

### Success Logs
```typescript
console.log(`[Humanization] Success using ${adapterName} adapter for ${subscriptionPlan} user`);
```

### Error Logs
```typescript
console.error(`[Humanization] ${adapterName} adapter failed for ${subscriptionPlan} user: ${error}`);
```

## Error Handling

### Adapter Selection Failure
```typescript
try {
  const adapter = getHumanizationAdapter(billingUser.subscriptionPlan);
} catch (error) {
  console.error('[Adapter Selection] Failed, using default adapter:', error);
  const adapter = aiStudios99; // Safe fallback
}
```

### Adapter Execution Failure
```typescript
try {
  const result = await adapter.humanizeText(text, options);
  if (!result.success) {
    // Log failure but don't deduct credits
    console.error('[Humanization] Adapter returned failure:', result.error);
    return error response;
  }
} catch (error) {
  // Critical failure - no credits deducted
  console.error('[Humanization] Adapter threw exception:', error);
  return error response;
}
```

## Testing Strategy

### Unit Tests
```typescript
describe('getHumanizationAdapter', () => {
  it('returns template adapter for free users', () => {
    const adapter = getHumanizationAdapter('free');
    expect(adapter).toBe(aiStudios99);
  });

  it('returns template adapter for basic users', () => {
    const adapter = getHumanizationAdapter('basic');
    expect(adapter).toBe(aiStudios99);
  });

  it('returns advanced adapter for pro users', () => {
    const adapter = getHumanizationAdapter('pro');
    expect(adapter).toBe(aiStudios);
  });

  it('returns advanced adapter for ultra users', () => {
    const adapter = getHumanizationAdapter('ultra');
    expect(adapter).toBe(aiStudios);
  });

  it('returns template adapter for null plan', () => {
    const adapter = getHumanizationAdapter(null);
    expect(adapter).toBe(aiStudios99);
  });
});
```

### Integration Tests
```typescript
describe('Humanizer API with adapter selection', () => {
  it('uses template adapter for free user', async () => {
    // Create free user
    // Call API
    // Verify template adapter was used
  });

  it('uses advanced adapter for pro user', async () => {
    // Create pro user
    // Call API
    // Verify advanced adapter was used
  });

  it('team member uses owner\'s adapter', async () => {
    // Create team with pro owner
    // Create basic team member
    // Call API as team member
    // Verify advanced adapter was used (owner's plan)
  });
});
```

## Performance Considerations

### Adapter Selection Performance
- **Target**: < 1ms for adapter selection
- **Method**: Simple conditional logic, no database calls
- **Caching**: Not needed (selection is instant)

### Memory Usage
- Both adapters loaded at startup
- No runtime loading overhead
- Minimal memory footprint

## Security Considerations

### Server-Side Only
- Adapter selection happens server-side only
- No client-side exposure of logic
- No way for users to manipulate selection

### Subscription Validation
- Always validate subscription from database
- Never trust client-provided subscription info
- Use billing user's plan (not requesting user if team member)

## Rollout Plan

### Phase 1: Implementation (1 hour)
1. Create adapter selector utility
2. Update non-streaming endpoint
3. Update streaming endpoint
4. Add logging

### Phase 2: Testing (30 minutes)
1. Unit tests for selector
2. Manual testing of all subscription tiers
3. Test team member scenarios
4. Verify logging

### Phase 3: Deployment (15 minutes)
1. Deploy to staging
2. Smoke test all tiers
3. Deploy to production
4. Monitor logs

### Phase 4: Monitoring (Ongoing)
1. Track adapter usage by tier
2. Monitor error rates
3. Collect user feedback
4. Optimize as needed

## Rollback Plan

If issues arise:
1. Revert to using `aistudios.ts` for all users
2. Investigate issue
3. Fix and redeploy

Simple rollback:
```typescript
// Emergency rollback - use advanced adapter for everyone
export function getHumanizationAdapter(plan: SubscriptionPlan) {
  return aiStudios; // Temporary: all users get advanced adapter
}
```

## Success Criteria

✅ **Functional**:
- Free/basic users use template adapter
- Pro/ultra users use advanced adapter
- Team members use owner's adapter
- No errors in selection

✅ **Performance**:
- No latency increase
- No memory issues
- Fast adapter selection

✅ **Quality**:
- Clear logs
- Good error handling
- Maintainable code

## Future Enhancements

### Potential Improvements
1. **A/B Testing**: Test different adapters for same tier
2. **Hybrid Approach**: Use both adapters and pick best result
3. **Custom Adapters**: Allow enterprise users to use custom adapters
4. **Adapter Metrics**: Track quality metrics per adapter
5. **Dynamic Selection**: Use ML to select best adapter per request

### Not Planned
- Frontend adapter selection UI
- User-selectable adapters
- Multiple adapters per tier
