const fs = require('fs');

function removeAffiliate() {
  // 1. SiteFooter.tsx
  let footer = fs.readFileSync('src/components/SiteFooter.tsx', 'utf8');
  footer = footer.replace('{ label: "Affiliate Program", href: "/affiliate" },', '');
  fs.writeFileSync('src/components/SiteFooter.tsx', footer);

  // 2. PageNavbar.tsx
  let navbar = fs.readFileSync('src/components/PageNavbar.tsx', 'utf8');
  navbar = navbar.replace('{ href: "/affiliate", label: "Affiliates" },', '');
  fs.writeFileSync('src/components/PageNavbar.tsx', navbar);

  // 3. UnifiedHomePage.tsx
  let home = fs.readFileSync('src/app/UnifiedHomePage.tsx', 'utf8');
  // Remove Affiliate Program Banner (find lines 1562-1595 approx)
  const affiliateBannerStart = home.indexOf('{/* Affiliate Program Banner */}');
  if (affiliateBannerStart !== -1) {
    const affiliateBannerEnd = home.indexOf('</section>', affiliateBannerStart) + '</section>'.length;
    home = home.substring(0, affiliateBannerStart) + home.substring(affiliateBannerEnd);
    fs.writeFileSync('src/app/UnifiedHomePage.tsx', home);
  }

  // 4. PricingPageClient.tsx
  let pricing = fs.readFileSync('src/components/PricingPageClient.tsx', 'utf8');
  const affiliateCalloutStart = pricing.indexOf('{/* Affiliate callout */}');
  if (affiliateCalloutStart !== -1) {
    // Look for the end of the div
    const nextCloseDiv = pricing.indexOf('</div>', affiliateCalloutStart + 1000);
    // Actually let's just use regex or specific strings.
    // The callout starts at {/* Affiliate callout */} and ends after </Button> </div> </div>
    // Let's just slice it out manually based on specific known text
    const endStr = 'Start Earning\n            </Button>\n          </div>\n        </div>';
    const endIdx = pricing.indexOf(endStr, affiliateCalloutStart);
    if (endIdx !== -1) {
      pricing = pricing.substring(0, affiliateCalloutStart) + pricing.substring(endIdx + endStr.length);
      fs.writeFileSync('src/components/PricingPageClient.tsx', pricing);
    }
  }

  // 5. PricingModal.tsx
  let pricingModal = fs.readFileSync('src/components/PricingModal.tsx', 'utf8');
  pricingModal = pricingModal.replace('setShowRefStep(true);', 'doCheckout();');
  fs.writeFileSync('src/components/PricingModal.tsx', pricingModal);

  // 6. PolarPricing.tsx
  let polarPricing = fs.readFileSync('src/components/pricing/PolarPricing.tsx', 'utf8');
  polarPricing = polarPricing.replace('setPendingProductId(productId);', 'doCheckout(productId);');
  fs.writeFileSync('src/components/pricing/PolarPricing.tsx', polarPricing);

  // 7. UnlimitedCard.tsx
  let unlimitedCard = fs.readFileSync('src/components/pricing/UnlimitedCard.tsx', 'utf8');
  unlimitedCard = unlimitedCard.replace('setShowRefStep(true);', 'doCheckout();');
  fs.writeFileSync('src/components/pricing/UnlimitedCard.tsx', unlimitedCard);

  console.log('Removed affiliate references from all components!');
}

removeAffiliate();
