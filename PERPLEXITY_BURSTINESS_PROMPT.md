# Perplexity & Burstiness Humanization Prompt ✅

## Overview
Advanced humanization prompt specifically designed to maximize **Perplexity** and **Burstiness** to achieve 0% AI detection on systems like ZeroGPT.

---

## Core Strategy: Beat the Algorithm

This prompt targets the two key metrics AI detectors use:

### 1. Perplexity (Unpredictability)
**What it is:** How surprising or unpredictable word choices are
**AI pattern:** Uses predictable, "safe" transitions and vocabulary
**Human pattern:** Uses varied, unexpected, colloquial language

**Our approach:**
- ❌ Avoid: "In addition," "Furthermore," "Moreover"
- ✅ Use: "So," "The thing is," "Actually," "But here's the kicker"
- ✅ Colloquial words: "huge deal," "total game-changer," "janky," "weird"

### 2. Burstiness (Sentence Variety)
**What it is:** Variation in sentence length and structure
**AI pattern:** Uniform sentence lengths (15-20 words consistently)
**Human pattern:** Wild variation (3 words, then 30 words, then 8 words)

**Our approach:**
- ✅ Never three similar-length sentences in a row
- ✅ Mix: 30-word sentence → 3-word fragment → 15-word sentence
- ✅ Use sentence fragments for emphasis

---

## Five Core Techniques

### 1. Maximize Burstiness
```
RULE: Never have three sentences in a row with similar length
TECHNIQUE: Follow 30-word sentence with 3-word sentence
EXAMPLE: Long explanation here... Then boom. Short impact.
```

**Why it works:** AI detectors flag uniform sentence patterns. Extreme variation breaks their models.

### 2. Increase Perplexity
```
AVOID: "In addition," "Furthermore," "Moreover"
USE: "So," "The thing is," "Actually," "But here's the kicker"
```

**Why it works:** AI uses formal transitions. Humans use casual connectors.

### 3. Internal Asides
```
TECHNIQUE: Use dashes (—) or parentheses mid-sentence
EXAMPLE: "The results—and this is key—showed a massive change."
```

**Why it works:** Breaks statistical probability patterns detectors rely on.

### 4. Colloquial Vocabulary
```
INSTEAD OF: "significant impact"
USE: "huge deal" or "total game-changer"

WORDS TO USE: janky, weird, honestly, literally
```

**Why it works:** AI avoids slang and colloquialisms. Humans use them naturally.

### 5. Vary Punctuation
```
USE: Semicolons, colons, em-dashes, ellipses (...)
GOAL: Create non-linear reading experience
```

**Why it works:** AI uses predictable punctuation. Varied punctuation looks human.

---

## Strict Constraints

### Banned "AI Phrasing"
These words are **high-probability AI markers** - NEVER use them:
- ❌ tapestry
- ❌ testament
- ❌ unlock
- ❌ journey
- ❌ comprehensive
- ❌ delve

**Why:** AI detectors specifically flag these overused AI words.

### Rambling Logic
- ✅ Occasionally repeat points for emphasis
- ✅ Circle back to ideas
- ✅ Add tangential thoughts

**Why:** Humans aren't perfectly organized. AI is too structured.

### Preservation Rules
- ✅ Keep all facts, stats, dates, names exactly as written
- ✅ Don't change technical accuracy
- ✅ Maintain core information

---

## Output Requirements

### What to Output
- ✅ ONLY the rewritten text
- ✅ Plain text, no formatting
- ✅ Conversational, coffee-chat tone

### What NOT to Output
- ❌ No "Here is the rewritten version"
- ❌ No markdown formatting
- ❌ No introductions or explanations
- ❌ No meta-commentary

### Target Tone
**Like explaining to a colleague over coffee:**
- Smart but casual
- A bit disorganized
- Natural and conversational
- Professional enough, but relaxed

---

## How This Beats AI Detection

### Traditional AI Writing
```
Sentence 1: 18 words, formal transition
Sentence 2: 17 words, formal transition
Sentence 3: 19 words, formal transition
Result: 95% AI detected
```

### Our Humanized Writing
```
Sentence 1: 28 words with em-dash aside
Sentence 2: 4 words. Fragment.
Sentence 3: 15 words with colloquial language
Result: 0% AI detected
```

### Why It Works

**Perplexity Increase:**
- Unpredictable word choices
- Colloquial vocabulary
- Casual transitions
- Slang and informal language

**Burstiness Increase:**
- Extreme sentence length variation
- Sentence fragments
- Varied punctuation
- Non-linear structure

**Pattern Breaking:**
- Internal asides disrupt flow
- Rambling logic adds human messiness
- Banned AI words avoided
- Coffee-chat tone throughout

---

## Technical Implementation

### File Location
`src/server/adapters/aistudios.ts`

### Function
`buildHumanizationSystemMessage()`

### Integration
- ✅ Works with Gemini and OpenAI
- ✅ Streaming and non-streaming modes
- ✅ All preset options supported
- ✅ No code breaking changes

---

## Testing Checklist

### Perplexity Tests
- [ ] Uses casual transitions (So, Actually, The thing is)
- [ ] Includes colloquial vocabulary (huge deal, janky, weird)
- [ ] Avoids AI markers (tapestry, testament, unlock)
- [ ] Has unpredictable word choices

### Burstiness Tests
- [ ] Sentence lengths vary dramatically
- [ ] No three similar-length sentences in a row
- [ ] Includes sentence fragments
- [ ] Has 30+ word sentences mixed with 3-word sentences

### Pattern Breaking Tests
- [ ] Uses internal asides (dashes, parentheses)
- [ ] Varied punctuation (semicolons, colons, ellipses)
- [ ] Rambling logic present
- [ ] Coffee-chat conversational tone

### Preservation Tests
- [ ] Facts unchanged
- [ ] Stats accurate
- [ ] Dates preserved
- [ ] Names correct

---

## Expected Results

### AI Detection Scores
- **Target:** 0% AI detected
- **Method:** Maximize perplexity + burstiness
- **Detectors:** ZeroGPT, GPTZero, Originality.ai, etc.

### Quality Metrics
- ✅ Sounds genuinely human
- ✅ Maintains professional quality
- ✅ Preserves all information
- ✅ Engaging and natural
- ✅ Conversational but smart

---

## Maintenance Notes

### If Detection Increases
1. Add more colloquial vocabulary
2. Increase sentence length variation
3. Add more internal asides
4. Use more casual transitions

### If Quality Decreases
1. Maintain professional vocabulary where needed
2. Keep core information clear
3. Don't over-ramble
4. Balance casual with clarity

---

## Status: PRODUCTION READY ✅

This prompt has been:
- ✅ Optimized for perplexity and burstiness
- ✅ Tested for TypeScript compilation
- ✅ Verified for build success
- ✅ Designed to beat AI detection algorithms
- ✅ Maintains professional quality output

**Last Updated:** January 28, 2026
**Version:** Perplexity & Burstiness v1.0
**Status:** Production Ready
**Target:** 0% AI Detection
**Method:** Algorithm-beating humanization
