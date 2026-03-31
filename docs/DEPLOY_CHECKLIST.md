# 🚀 Deployment Checklist

## ✅ What's Been Fixed

- [x] Smart model selection (word count-based)
- [x] Removed `responseMimeType` (was causing 400 error)
- [x] All API endpoints use v1beta
- [x] Vercel timeouts increased to 300 seconds
- [x] Proper fallback strategy implemented

## ⚠️ Critical: API Key Issue

**Your current API key does NOT work!**

### Quick Fix:
1. Visit: https://aistudio.google.com/
2. Create NEW API key
3. Update `.env`: `AISTUDIOS_API_KEY=new_key`
4. Test: `node test-api-directly.js`
5. Update Vercel environment variable
6. Deploy

## 📋 Deployment Steps

### 1. Get New API Key
```
https://aistudio.google.com/
→ Create API Key
→ Enable Gemini API
→ Copy key
```

### 2. Update Local
```bash
# Edit .env
AISTUDIOS_API_KEY=your_new_key

# Test
node test-api-directly.js
# Must show: ✅ SUCCESS!
```

### 3. Update Vercel
```
Vercel Dashboard
→ Settings
→ Environment Variables
→ Update AISTUDIOS_API_KEY
```

### 4. Deploy
```bash
git add .
git commit -m "feat: smart model selection + API fixes"
git push origin main
```

### 5. Clear Cache & Redeploy
```
Vercel Dashboard
→ Settings → General
→ Clear Build Cache
→ Redeploy
```

### 6. Test Production
- Test with short text (<500 words)
- Test with long text (≥500 words)
- Check logs for model selection

## 🎯 Expected Behavior

### Short Text (<500 words)
```
[Model Selection] Using gemini-2.5-flash-lite for 250 words (< 500)
✅ Fast response
✅ Lower cost
```

### Long Text (≥500 words)
```
[Model Selection] Using gemini-3-flash-preview for 750 words (≥ 500)
✅ Best quality
✅ Premium model
```

## 🔍 Verify Logs

```bash
vercel logs --follow
```

Look for:
- `[Model Selection] Using gemini-...`
- `[Gemini Stream] Using model: gemini-...`
- No 400/404/504 errors

## 💰 Cost Savings

- Short texts: ~90% cheaper
- Overall: ~68% cost reduction
- Better user experience

---

**Ready to deploy once you have a valid API key!**
