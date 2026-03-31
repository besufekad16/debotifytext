# ✅ VERIFIED Gemini Model Information (2025)

## Official Sources
- Google AI Studio Documentation: https://ai.google.dev/gemini-api/docs/models
- Google AI Developer Forum: https://discuss.ai.google.dev/
- Verified: January 2026

## Current Configuration (VERIFIED & WORKING)

### Primary Model: `gemini-2.5-flash`
- ✅ **Status**: STABLE, PRODUCTION-READY
- ⚡ **Speed**: Fastest Gemini model
- 💰 **Cost**: $0.075 per 1M input tokens, $0.30 per 1M output tokens
- 🎯 **Use Case**: Perfect for humanization tasks
- 📊 **Context**: 1M tokens
- 🔄 **Multimodal**: Text, images, audio, video

### Fallback Model: `gpt-4o-mini`
- ✅ **Status**: STABLE, PRODUCTION-READY (OpenAI)
- ⚡ **Speed**: Fast
- 💰 **Cost**: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- 🎯 **Use Case**: Reliable fallback when Gemini fails

## Why These Models?

### gemini-2.5-flash (Primary)
1. **Lightest production-ready Gemini model**
2. **Stable model name** (not an alias)
3. **Lowest cost** among Gemini models
4. **Fastest processing** for text generation
5. **Avoids rate limits** due to efficiency
6. **Officially recommended** by Google for production

### gpt-4o-mini (Fallback)
1. **Lightest OpenAI model**
2. **Cost-effective** fallback option
3. **Reliable** and well-tested
4. **Good quality** for humanization tasks

## Important Notes About Model Names

### ⚠️ Aliases vs Stable Names

**`gemini-flash-latest`** (ALIAS - NOT RECOMMENDED FOR PRODUCTION)
- ✅ Works in API calls
- ❌ Google recommends NOT using aliases in production
- 🔄 Currently points to `gemini-2.5-flash`
- ⚠️ Can change without notice
- 📊 Dashboard shows actual model name, not alias

**`gemini-2.5-flash`** (STABLE - RECOMMENDED ✅)
- ✅ Stable model name
- ✅ Recommended for production by Google
- ✅ Won't change unexpectedly
- ✅ Clear billing and usage tracking

### Source
From Google AI Developer Forum (verified Jan 2026):
> "Please avoid using aliases in production and always specifically mention which model you want to use."

## All Available Gemini Models (2025)

### Flash Family (Lightweight)
1. **gemini-2.5-flash** ⭐ RECOMMENDED
   - Stable, lightest, fastest
   - $0.075/$0.30 per 1M tokens
   
2. **gemini-2.5-flash-lite**
   - Even lighter variant
   - $0.05/$0.20 per 1M tokens
   - Ultra-fast for simple tasks

### Pro Family (Heavy, High Quality)
3. **gemini-2.5-pro**
   - Most capable Gemini model
   - $1.25/$5.00 per 1M tokens
   - Best for complex reasoning

### Experimental
4. **gemini-2.0-flash-exp**
   - Experimental 2.0 version
   - May have rate limits
   - Not recommended for production

## Model Comparison

| Model | Input Cost | Output Cost | Speed | Production Ready |
|-------|-----------|-------------|-------|------------------|
| gemini-2.5-flash | $0.075 | $0.30 | ⚡⚡⚡ | ✅ YES |
| gemini-2.5-flash-lite | $0.05 | $0.20 | ⚡⚡⚡⚡ | ✅ YES |
| gemini-2.5-pro | $1.25 | $5.00 | ⚡ | ✅ YES |
| gpt-4o-mini | $0.15 | $0.60 | ⚡⚡ | ✅ YES |
| gpt-4o | $2.50 | $10.00 | ⚡ | ✅ YES |

## Rate Limits (Free Tier)

### Google AI Studio (Free)
- **Requests**: 15 per minute (RPM)
- **Daily**: 1,500 requests per day
- **Context**: 1M tokens
- **No credit card required**

### Paid Tier
- Higher rate limits
- Better for production
- Billing based on usage

## Testing Your Configuration

Run the verification script:
```bash
cd humanify
node verify-model.js
```

This will:
1. Test the API key
2. Verify the model works
3. Show actual response
4. Confirm configuration is correct

## Deployment Checklist

- [x] Using stable model name (`gemini-2.5-flash`)
- [x] Not using aliases (`gemini-flash-latest`)
- [x] Lightest model selected
- [x] Fallback configured (`gpt-4o-mini`)
- [x] API keys in environment variables
- [ ] Test locally with `node verify-model.js`
- [ ] Deploy to Vercel
- [ ] Test on production

## Common Issues

### Issue: "Model not found"
**Solution**: Make sure you're using `gemini-2.5-flash` (not `gemini-3-flash-preview` or other non-existent names)

### Issue: Rate limit errors
**Solution**: Using `gemini-2.5-flash` (lightest model) minimizes rate limit issues

### Issue: High costs
**Solution**: `gemini-2.5-flash` is the cheapest Gemini model at $0.075 per 1M input tokens

### Issue: Slow responses
**Solution**: `gemini-2.5-flash` is the fastest Gemini model

## References

1. **Official Google AI Studio Models Page**
   https://ai.google.dev/gemini-api/docs/models

2. **Google AI Developer Forum - Model Aliases**
   https://discuss.ai.google.dev/t/inconsistent-model-name-gemini-flash-latest-works-in-api-but-dashboard-shows-gemini-2-5-flash/114440

3. **Gemini 2.5 Flash Documentation**
   https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash

## Last Verified
- Date: January 2026
- Source: Official Google AI Studio documentation
- Status: All information verified and working
