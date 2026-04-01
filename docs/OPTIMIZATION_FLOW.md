# CPU Optimization Flow Diagram

## Request Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Submits Text                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Validate Request (word count, credits)              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           Get User Subscription Plan from Database               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────┴────────┐
                    │  Check Batching │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐         ┌─────────────────────┐
    │ Free User       │         │ Paid User           │
    │ <300 words?     │         │ Any word count      │
    └────────┬────────┘         └──────────┬──────────┘
             │                              │
             │ YES                          │ NO BATCHING
             ▼                              │
    ┌─────────────────┐                    │
    │ ADD TO BATCH    │                    │
    │ QUEUE           │                    │
    └────────┬────────┘                    │
             │                              │
             ▼                              │
    ┌─────────────────┐                    │
    │ Wait for:       │                    │
    │ • 3 seconds OR  │                    │
    │ • 5 requests    │                    │
    └────────┬────────┘                    │
             │                              │
             ▼                              │
    ┌─────────────────┐                    │
    │ COMBINE TEXTS   │                    │
    │ with separator  │                    │
    └────────┬────────┘                    │
             │                              │
             └──────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  SELECT MODEL           │
              │  (Smart Routing)        │
              └────────────┬────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Free User    │  │ Basic/Pro    │  │ Ultra User   │
│ → Light      │  │ → Smart      │  │ → Heavy      │
│   Model      │  │   Routing    │  │   Model      │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                         ▼
              ┌─────────────────────────┐
              │  CALL GOOGLE AI STUDIO  │
              │  with selected model    │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  STREAM RESPONSE        │
              │  to user                │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  SPLIT BATCHED RESULTS  │
              │  (if batched)           │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  DEDUCT CREDITS         │
              │  SAVE HISTORY           │
              │  TRACK USAGE            │
              └─────────────────────────┘
```

---

## Model Selection Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                    selectModelByComplexity()                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Subscription?   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌─────────┐    ┌─────────┐    ┌─────────┐
        │  FREE   │    │  BASIC  │    │   PRO   │
        └────┬────┘    └────┬────┘    └────┬────┘
             │              │              │
             ▼              ▼              ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ ALL WORDS    │  │ <300 words   │  │ <300 words   │
    │ → Light      │  │ → Light      │  │ → Light      │
    │              │  │              │  │              │
    │              │  │ 300-1000     │  │ 300-2000     │
    │              │  │ → Standard   │  │ → Standard   │
    │              │  │              │  │              │
    │              │  │              │  │ >2000        │
    │              │  │              │  │ → Heavy      │
    └──────────────┘  └──────────────┘  └──────────────┘

              ┌─────────┐
              │  ULTRA  │
              └────┬────┘
                   │
                   ▼
              ┌──────────────┐
              │ <500 words   │
              │ → Standard   │
              │              │
              │ ≥500 words   │
              │ → Heavy      │
              └──────────────┘
```

---

## Batching System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Request Batcher                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Request Queue │
                    │  (Max 5)       │
                    └────────┬───────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐         ┌─────────────────┐
    │ Timer Trigger   │         │ Size Trigger    │
    │ (3 seconds)     │         │ (5 requests)    │
    └────────┬────────┘         └──────────┬──────┘
             │                              │
             └──────────────┬───────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  Process Batch          │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  Combine Texts:         │
              │                         │
              │  Text 1                 │
              │  ---SEPARATOR---        │
              │  Text 2                 │
              │  ---SEPARATOR---        │
              │  Text 3                 │
              │  ---SEPARATOR---        │
              │  Text 4                 │
              │  ---SEPARATOR---        │
              │  Text 5                 │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  Single API Call        │
              │  (Light Model)          │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  Receive Response       │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  Split by Separator:    │
              │                         │
              │  Result 1 → User 1      │
              │  Result 2 → User 2      │
              │  Result 3 → User 3      │
              │  Result 4 → User 4      │
              │  Result 5 → User 5      │
              └─────────────────────────┘
```

---

## CPU Usage Comparison

### Before Optimization
```
┌─────────────────────────────────────────────────────────────────┐
│                        CPU Usage: 49 hours/month                 │
│                        (12x over free tier limit)                │
└─────────────────────────────────────────────────────────────────┘

Free Users:    ████████████████████████████████ 100%
Basic Users:   ████████████████████████████████ 100%
Pro Users:     ████████████████████████████████ 100%
Ultra Users:   ████████████████████████████████ 100%
```

### After Optimization
```
┌─────────────────────────────────────────────────────────────────┐
│                     CPU Usage: 10-15 hours/month                 │
│                     (Within free/pro tier limits)                │
└─────────────────────────────────────────────────────────────────┘

Free Users:    ██████ 20-30% (Batching + Light Model)
Basic Users:   ███████████████ 50-60% (Smart Routing)
Pro Users:     ████████████████████ 60-70% (Smart Routing)
Ultra Users:   ████████████████████████████████ 100% (Premium Quality)
```

---

## Cost Savings Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│                         Cost Reduction                           │
└─────────────────────────────────────────────────────────────────┘

Free Users (70-80% reduction)
├─ Batching: 60-70% reduction (5x fewer API calls)
└─ Light Model: 10-20% additional reduction

Basic Users (40-50% reduction)
├─ Light Model (<300 words): 30-40% reduction
└─ Standard Model (300-1000): Normal cost

Pro Users (30-40% reduction)
├─ Light Model (<300 words): 20-30% reduction
├─ Standard Model (300-2000): Normal cost
└─ Heavy Model (>2000): Premium cost (rare)

Ultra Users (0% reduction)
├─ Standard Model (<500): Normal cost
└─ Heavy Model (≥500): Premium cost
└─ Reason: Premium quality maintained
```

---

## Fallback Mechanisms

```
┌─────────────────────────────────────────────────────────────────┐
│                      Error Handling Flow                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
              ┌─────────────────────────┐
              │  Batching Fails?        │
              └────────────┬────────────┘
                           │
                    ┌──────┴──────┐
                    │ YES         │ NO
                    ▼             ▼
        ┌─────────────────┐  ┌─────────────────┐
        │ Fall back to    │  │ Continue with   │
        │ Direct          │  │ Batch           │
        │ Processing      │  │                 │
        └────────┬────────┘  └────────┬────────┘
                 │                    │
                 └────────┬───────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │  Gemini Fails?          │
              └────────────┬────────────┘
                           │
                    ┌──────┴──────┐
                    │ YES         │ NO
                    ▼             ▼
        ┌─────────────────┐  ┌─────────────────┐
        │ Fall back to    │  │ Return Gemini   │
        │ OpenAI          │  │ Result          │
        │ (gpt-5-mini)    │  │                 │
        └────────┬────────┘  └────────┬────────┘
                 │                    │
                 └────────┬───────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │  Return Result to User  │
              └─────────────────────────┘
```

---

## Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                      Key Metrics to Watch                        │
└─────────────────────────────────────────────────────────────────┘

CPU Usage (Vercel Dashboard)
├─ Current: 49 hours/month
├─ Target: 10-15 hours/month
└─ Status: [Monitor for 24 hours]

Model Distribution (Application Logs)
├─ Light Model: [Expected: 60-70% of requests]
├─ Standard Model: [Expected: 25-35% of requests]
└─ Heavy Model: [Expected: 5-10% of requests]

Batch Queue (Application Logs)
├─ Average Queue Size: [Expected: 2-3 requests]
├─ Average Wait Time: [Expected: 1-2 seconds]
└─ Batch Success Rate: [Expected: >95%]

Response Times
├─ Free Users: [Expected: +0-3 seconds]
├─ Basic Users: [Expected: No change]
├─ Pro Users: [Expected: No change]
└─ Ultra Users: [Expected: No change]

Error Rates
├─ Batching Failures: [Expected: <5%]
├─ Model Failures: [Expected: <1%]
└─ Fallback Usage: [Expected: <2%]
```

---

## Success Indicators

✅ CPU usage drops to 10-15 hours/month within 24 hours
✅ No increase in error rates
✅ No user complaints about quality
✅ Model distribution matches expectations
✅ Batch queue processes smoothly
✅ Response times acceptable for all tiers

---

**Status**: Ready for Production Monitoring
**Next Action**: Deploy and monitor metrics above
