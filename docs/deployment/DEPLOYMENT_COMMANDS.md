# Deployment Commands
## Phase 6: Git & Deployment

**Status:** Ready to Execute  
**Time Estimate:** 5 minutes

---

## Step 1: Verify Changes

```bash
# Check git status
git status

# Should show:
# - Modified: .env.example, package.json, src/lib/polar-products.ts, .env
# - Untracked: 7 new component files and 1 API route
```

---

## Step 2: Stage Changes

```bash
# Stage all changes
git add -A

# Verify staged changes
git status
```

---

## Step 3: Commit Changes

```bash
git commit -m "feat: add clarity-bubble feature parity

- Add AnimatedLogo component for interactive branding
- Add ChristmasDiscount component for New Year promotion
- Add ComparisonSection component for product demo
- Add SEOBreadcrumbs component for navigation
- Add BlackFridayBanner component for seasonal promo
- Add CyberMondayDeals component for lifetime deal
- Add GET /api/polar/lifetime endpoint
- Add POLAR_PRODUCT_LIFETIME environment variable
- Add RESEND_API_KEY environment variable
- Update dependencies: next, @google/genai, resend
- Export fetchPolarProduct from polar-products.ts

This brings Humanify to 100% feature parity with Clarity-Bubble."
```

---

## Step 4: Create Feature Branch (If Not Already Done)

```bash
# If you haven't created a feature branch yet:
git checkout -b feature/clarity-parity

# Or if already on the branch:
git branch -v
```

---

## Step 5: Push to Remote

```bash
# Push feature branch
git push origin feature/clarity-parity

# Or if pushing to main directly:
git push origin main
```

---

## Step 6: Create Pull Request

### On GitHub:
1. Go to repository
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select `feature/clarity-parity` → `main`
5. Add title: "feat: add clarity-bubble feature parity"
6. Add description:

```markdown
## Description
This PR brings Humanify to 100% feature parity with Clarity-Bubble by adding all missing components, API endpoints, and environment variables.

## Changes
- ✅ 6 new UI components
- ✅ 1 new API endpoint
- ✅ 2 new environment variables
- ✅ 3 dependency updates

## Testing
- ✅ Build successful
- ✅ No type errors
- ✅ All imports resolved
- ✅ No breaking changes

## Deployment
- Ready for staging
- Ready for production
```

7. Click "Create pull request"

---

## Step 7: Code Review

```bash
# After PR is created, wait for code review
# Reviewers will check:
# - Code quality
# - No breaking changes
# - Proper testing
# - Documentation
```

---

## Step 8: Merge to Main

### Option A: Via GitHub UI
1. Go to PR
2. Click "Merge pull request"
3. Select merge strategy (default: Create a merge commit)
4. Click "Confirm merge"
5. Delete feature branch (optional)

### Option B: Via Command Line
```bash
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Merge feature branch
git merge feature/clarity-parity

# Push to remote
git push origin main

# Delete feature branch (optional)
git branch -d feature/clarity-parity
git push origin --delete feature/clarity-parity
```

---

## Step 9: Deploy to Staging

```bash
# Trigger staging deployment (depends on your CI/CD setup)

# If using Vercel:
# - Staging deployment automatically triggered on main branch
# - Check Vercel dashboard for deployment status

# If using other CI/CD:
# - Follow your deployment process
# - Verify staging environment
```

---

## Step 10: Deploy to Production

```bash
# After staging verification, deploy to production

# If using Vercel:
# - Production deployment automatically triggered
# - Or manually promote from staging

# If using other CI/CD:
# - Follow your deployment process
# - Monitor production environment
```

---

## Verification Checklist

### After Merge
- [ ] PR merged successfully
- [ ] Feature branch deleted
- [ ] Main branch updated

### After Staging Deployment
- [ ] Staging deployment successful
- [ ] All components render correctly
- [ ] API endpoint responds
- [ ] No console errors
- [ ] All links work

### After Production Deployment
- [ ] Production deployment successful
- [ ] All components render correctly
- [ ] API endpoint responds
- [ ] No console errors
- [ ] All links work
- [ ] Monitor for errors

---

## Rollback Procedure (If Needed)

### Quick Rollback
```bash
# Revert last commit
git revert HEAD

# Or reset to previous commit
git reset --hard HEAD~1

# Push to remote
git push origin main --force-with-lease
```

### Full Rollback
```bash
# If deployment is already live and needs rollback:

# 1. Revert the commit
git revert <commit-hash>

# 2. Push revert
git push origin main

# 3. Redeploy
# (Follow your deployment process)
```

---

## Monitoring After Deployment

### Check Logs
```bash
# Monitor application logs
# - Check for errors
# - Check for warnings
# - Monitor API calls

# If using Vercel:
# - Go to Vercel dashboard
# - Check deployment logs
# - Check function logs
```

### Test Components
```bash
# Visit production URL
# - Check homepage (AnimatedLogo, ChristmasDiscount)
# - Check pricing page (BlackFridayBanner, CyberMondayDeals)
# - Check API endpoint: /api/polar/lifetime
# - Check SEO pages (SEOBreadcrumbs)
```

### Monitor Metrics
- Page load times
- Error rates
- API response times
- User interactions

---

## Success Criteria

✅ All checks passed:
- [ ] PR merged
- [ ] Staging deployment successful
- [ ] Production deployment successful
- [ ] All components working
- [ ] API endpoint responding
- [ ] No errors in logs
- [ ] Users can access new features

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| Stage changes | 1 min | Ready |
| Commit | 1 min | Ready |
| Push | 1 min | Ready |
| Create PR | 2 min | Ready |
| Code review | 5-30 min | Pending |
| Merge | 1 min | Ready |
| Deploy staging | 5-10 min | Ready |
| Deploy production | 5-10 min | Ready |
| **Total** | **~30 min** | **Ready** |

---

## Important Notes

1. **No Breaking Changes** - This deployment is safe and backward compatible
2. **Easy Rollback** - Can be reverted quickly if needed
3. **Zero Downtime** - Deployment doesn't require downtime
4. **Tested** - All components tested and verified
5. **Documented** - All changes documented

---

## Support

If you encounter any issues:

1. Check the logs
2. Review the error message
3. Refer to `IMPLEMENTATION_GUIDE.md` troubleshooting section
4. Rollback if necessary
5. Contact team for support

---

## Final Checklist

Before deploying:
- [ ] All changes committed
- [ ] PR created and reviewed
- [ ] Build successful
- [ ] No critical errors
- [ ] Staging tested
- [ ] Ready for production

---

**Status:** ✅ READY FOR DEPLOYMENT  
**Risk Level:** 🟢 LOW  
**Confidence:** 🟢 HIGH

**Next Step:** Execute Step 1 (Verify Changes)
