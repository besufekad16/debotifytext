# Quick Testing Guide - Subscription-Based Humanization

## 🚀 Quick Start

### 1. Start Your Server
```bash
npm run dev
```

### 2. Test Each Subscription Tier

#### Test Free User
```bash
# Sign in as a user with no subscription
# Go to http://localhost:3050
# Try humanizing text
# Check server logs for: "Using template-based adapter for free user"
```

#### Test Basic User
```bash
# Sign in as a user with basic plan
# Try humanizing text
# Check server logs for: "Using advanced-ai adapter for basic user"
```

#### Test Pro User
```bash
# Sign in as a user with pro plan
# Try humanizing text
# Check server logs for: "Using advanced-ai adapter for pro user"
```

#### Test Ultra User
```bash
# Sign in as a user with ultra plan
# Try humanizing text
# Check server logs for: "Using advanced-ai adapter for ultra user"
```

---

## 📋 What to Check

### In Server Logs
Look for these messages:

✅ **Adapter Selection**:
```
[Adapter Selection] Using template-based adapter for free user
[Adapter Selection] Using advanced-ai adapter for pro user
```

✅ **API Endpoint**:
```
[HUMANIZER API] Using template-based adapter for free user
[STREAM API] Using advanced-ai adapter for pro user
```

✅ **Success**:
```
[HUMANIZER API] Result metadata: {
  "adapter": "advanced-ai",
  "source": "gemini",
  ...
}
```

### In Browser
- ✅ Humanization works for all tiers
- ✅ No errors in console
- ✅ Credits are deducted correctly
- ✅ Output quality matches tier

---

## 🧪 Test Scenarios

### Scenario 1: Free User Humanization
1. Sign in as free user
2. Paste text to humanize
3. Click "Humanize"
4. **Expected**: Template-based adapter used
5. **Check logs**: "template-based adapter for free user"

### Scenario 2: Pro User Humanization
1. Sign in as pro user
2. Paste text to humanize
3. Click "Humanize"
4. **Expected**: Advanced AI adapter used
5. **Check logs**: "advanced-ai adapter for pro user"

### Scenario 3: Team Member
1. Sign in as basic team member under pro owner
2. Paste text to humanize
3. Click "Humanize"
4. **Expected**: Advanced AI adapter used (owner's plan)
5. **Check logs**: "advanced-ai adapter for pro user"

### Scenario 4: Streaming
1. Sign in as any user
2. Use streaming endpoint
3. **Expected**: Correct adapter based on subscription
4. **Check logs**: Adapter selection message

---

## 🔍 Debugging

### If Wrong Adapter is Used

1. **Check subscription in database**:
```sql
SELECT "clerkId", "subscriptionPlan" FROM "user" WHERE email = 'user@example.com';
```

2. **Check team ownership**:
```sql
SELECT u."clerkId", u."subscriptionPlan", t."ownerId", o."subscriptionPlan" as "ownerPlan"
FROM "user" u
LEFT JOIN "Team" t ON u."teamId" = t."id"
LEFT JOIN "user" o ON t."ownerId" = o."id"
WHERE u.email = 'user@example.com';
```

3. **Check server logs** for adapter selection

### If Adapter Fails

1. **Check API keys** in `.env`:
   - `AISTUDIOS_API_KEY` (for Gemini)
   - `OPENAI_API_KEY` (for OpenAI)

2. **Check adapter logs**:
```
[Gemini] Failed to generate content: ...
[OpenAI] Failed to generate content: ...
```

3. **Verify no credits were deducted** on failure

---

## ✅ Success Checklist

- [ ] Free users use template adapter
- [ ] Basic users use template adapter
- [ ] Pro users use advanced adapter
- [ ] Ultra users use advanced adapter
- [ ] Team members use owner's adapter
- [ ] Logs show correct adapter selection
- [ ] No errors in console
- [ ] No TypeScript errors
- [ ] Credits deducted correctly
- [ ] Output quality matches tier

---

## 🚨 Common Issues

### Issue: "Cannot find module adapter-selector"
**Solution**: Restart dev server (`npm run dev`)

### Issue: Wrong adapter selected
**Solution**: Check subscription plan in database

### Issue: Both adapters fail
**Solution**: Check API keys in `.env`

### Issue: Team member gets wrong adapter
**Solution**: Verify team owner's subscription plan

---

## 📊 Expected Behavior

| User Type | Subscription | Adapter Used | Quality |
|-----------|--------------|--------------|---------|
| Free | `null` | Template | Good |
| **Basic** | `'basic'` | **Advanced AI** | **Better** ✨ |
| Pro | `'pro'` | Advanced AI | Better |
| Ultra | `'ultra'` | Advanced AI | Better |
| Team Member | Owner's plan | Owner's adapter | Inherited |

### Key Update
**Basic plan users now get the advanced AI adapter**, providing premium quality for all paid subscribers!

---

## 🎯 Quick Verification

Run this in your browser console while signed in:

```javascript
// Test non-streaming
fetch('/api/humanizer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + document.cookie.match(/__session=([^;]+)/)?.[1]
  },
  body: JSON.stringify({
    text: 'This is a test text to humanize. It should use the correct adapter based on my subscription plan.'
  })
})
.then(r => r.json())
.then(data => console.log('Result:', data))
.catch(err => console.error('Error:', err));
```

Then check server logs for adapter selection message.

---

## 📝 Notes

- **No frontend changes** - Users don't see which adapter is used
- **Automatic selection** - No manual configuration needed
- **Seamless experience** - Works for all users
- **Clear logging** - Easy to debug issues

---

## 🎉 Ready to Deploy?

Once all tests pass:

1. ✅ All subscription tiers tested
2. ✅ Team member scenarios tested
3. ✅ Error scenarios tested
4. ✅ Logs are clear and helpful
5. ✅ No TypeScript errors
6. ✅ No breaking changes

**You're ready to deploy!** 🚀
