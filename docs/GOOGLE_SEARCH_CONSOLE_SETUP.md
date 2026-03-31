# Google Search Console Setup Guide for HumanifyLab

## Step 1: Add Property to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **"Add Property"**
3. Choose **"URL prefix"** method
4. Enter: `https://www.humanifylab.com`
5. Click **"Continue"**

## Step 2: Verify Ownership

Google will provide several verification methods. Choose ONE:

### Method 1: HTML Meta Tag (Recommended - Already Set Up!)

Your site already has the meta tag in `src/app/layout.tsx`:

```html
<meta name="google-site-verification" content="google11bdb4ff94bca264.html" />
```

**Steps:**
1. In Search Console, select "HTML tag" verification method
2. Copy the `content` value from the meta tag Google provides
3. If it's different from `google11bdb4ff94bca264.html`, update it in `src/app/layout.tsx` line 127
4. Deploy your site
5. Click "Verify" in Search Console

### Method 2: HTML File Upload (Alternative)

1. Download the verification file from Search Console (e.g., `google1234567890abcdef.html`)
2. Place it in the `public/` folder
3. Deploy your site
4. The file will be accessible at `https://www.humanifylab.com/google1234567890abcdef.html`
5. Click "Verify" in Search Console

### Method 3: DNS Verification (Alternative)

1. Get the TXT record from Search Console
2. Add it to your domain's DNS settings (where you manage humanifylab.com)
3. Wait for DNS propagation (can take up to 48 hours)
4. Click "Verify" in Search Console

## Step 3: Submit Sitemap

Once verified:

1. In Search Console, go to **"Sitemaps"** in the left menu
2. Enter: `sitemap.xml`
3. Click **"Submit"**

Your sitemap is already configured at:
- Main sitemap: `https://www.humanifylab.com/sitemap.xml`
- Sitemap index: `https://www.humanifylab.com/sitemaps/sitemap-index.xml`

## Step 4: Request Indexing for Key Pages

After sitemap submission, manually request indexing for important pages:

1. In Search Console, go to **"URL Inspection"**
2. Enter each URL and click **"Request Indexing"**:
   - `https://www.humanifylab.com/`
   - `https://www.humanifylab.com/pricing`
   - `https://www.humanifylab.com/faq`
   - `https://www.humanifylab.com/contact`

## Step 5: Monitor Indexing Progress

- Go to **"Coverage"** or **"Pages"** to see indexing status
- It can take 1-7 days for Google to index your pages
- Check **"Performance"** after a few weeks to see search traffic

## Current SEO Configuration

✅ **Already Configured:**
- Sitemap: `https://www.humanifylab.com/sitemap.xml`
- Robots.txt: `https://www.humanifylab.com/robots.txt`
- Meta tags in layout.tsx
- Open Graph tags
- Twitter Card tags
- Structured data (Schema.org)
- Google Analytics: G-6C1TZBERFK
- Bing verification: 3178076F587E8E4C2D782D2DCE659D9C

## Verification Status

- ✅ Bing: Verified (BingSiteAuth.xml exists)
- ⏳ Google: Needs verification (follow steps above)

## Automated Sitemap Submission (Optional)

You can automate sitemap submission using the Search Console API:

```bash
# Set up service account (see SEARCH_CONSOLE_SETUP.md for details)
npm run seo:submit-sitemap
```

**Note:** Manual submission is easier and only needs to be done once!

## Expected Timeline

- **Verification**: Immediate (once you complete steps above)
- **Sitemap Processing**: 1-3 days
- **First Indexing**: 3-7 days
- **Ranking for "humanifylab"**: 1-2 weeks
- **Organic Traffic**: 2-4 weeks

## Tips for Faster Indexing

1. **Build backlinks**: Share your site on social media, forums, directories
2. **Create quality content**: Add blog posts, guides, tutorials
3. **Update regularly**: Fresh content signals to Google your site is active
4. **Mobile-friendly**: Your site is already responsive ✅
5. **Fast loading**: Optimize images and code (already done ✅)

## Troubleshooting

### "Site not verified"
- Make sure the verification code matches exactly
- Deploy your changes before clicking "Verify"
- Clear your browser cache

### "Sitemap couldn't be read"
- Check that `https://www.humanifylab.com/sitemap.xml` is accessible
- Verify XML syntax is valid
- Wait 24 hours and try again

### "Pages not indexed"
- Check robots.txt isn't blocking pages
- Ensure pages return 200 status code
- Wait 7 days before worrying

## Next Steps After Setup

1. Set up Google Analytics 4 (already done ✅)
2. Link Search Console to Analytics
3. Monitor search queries in Performance report
4. Fix any coverage issues that appear
5. Submit new pages as you add them

---

**Need Help?**
- [Search Console Help](https://support.google.com/webmasters)
- [Sitemap Protocol](https://www.sitemaps.org/)
- Email: humanifylab1@gmail.com
