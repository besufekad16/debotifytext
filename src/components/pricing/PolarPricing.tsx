"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ReferralCodeStep from "~/components/ReferralCodeStep";

type BillingCycle = "monthly" | "yearly";

type ProductPriceOption = {
  id: string;
  displayPrice: string;
  priceAmount: number | null;
  priceCurrency: string | null;
  priceType: "one_time" | "recurring" | null;
  recurringInterval: string | null;
};

type Product = {
  key: string;
  name: string;
  description?: string | null;
  uiDescription?: string;
  monthly: ProductPriceOption | null;
  yearly: ProductPriceOption | null;
};

type ParsedDescription = {
  headline: string;
  features: string[];
};

function parseProductDescription(description?: string | null): ParsedDescription {
  if (!description) {
    return {
      headline: "Everything you need to humanize confidently.",
      features: [
        "Instant AI-to-human conversions",
        "Copy & export in one click",
        "Cancel or upgrade any time",
      ],
    };
  }

  // Split by lines first
  const lines = description.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

  // Find the headline (all text before the first bullet point)
  let headline = "Everything you need to humanize confidently.";
  let features: string[] = [];

  const headlineLines: string[] = [];
  let foundBulletSection = false;

  for (const line of lines) {
    // Skip the credits reset line
    if (line.includes('**Credits reset:**')) {
      continue;
    }

    // Check if this is a bullet point line (starts with • or -)
    if (line.startsWith('•') || line.startsWith('-')) {
      foundBulletSection = true;
      // Clean up the bullet point
      const cleaned = line.replace(/^[•\-]\s*/, '').trim();
      if (cleaned) {
        features.push(cleaned);
      }
    } else if (!foundBulletSection) {
      // This is part of the headline (all lines before bullet points)
      headlineLines.push(line);
    }
  }

  // Join all headline lines into one
  if (headlineLines.length > 0) {
    headline = headlineLines.join(' ');
  }

  // If no features were found, use defaults
  if (features.length === 0) {
    features = [
      "Instant AI-to-human conversions",
      "Copy & export in one click",
      "Cancel or upgrade any time",
    ];
  }

  return { headline, features };
}

function formatCurrency(amount: number, currency?: string | null) {
  const resolvedCurrency = currency ?? "USD";

  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: resolvedCurrency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
}

function getEffectiveMonthlyAmount(option: ProductPriceOption | null): number | null {
  if (!option?.priceAmount) return null;

  const amount = option.priceAmount / 100;

  if (option.recurringInterval === "year") {
    return amount / 12;
  }

  return amount;
}

function getAnnualBillingAmount(option: ProductPriceOption | null): number | null {
  if (!option?.priceAmount) return null;

  if (option.recurringInterval === "year") {
    return option.priceAmount / 100;
  }

  if (option.recurringInterval === "month") {
    return (option.priceAmount * 12) / 100;
  }

  return null;
}

function computePlanSavings(plan: Product): number {
  const monthlyAmount = plan.monthly?.priceAmount;
  const yearlyAmount = plan.yearly?.priceAmount;

  if (!monthlyAmount || !yearlyAmount) return 0;

  const monthlyYearTotal = monthlyAmount * 12;
  const yearlyYearTotal = yearlyAmount * 12;
  if (monthlyYearTotal <= 0) return 0;

  const savings = 1 - yearlyYearTotal / monthlyYearTotal;
  if (savings <= 0) return 0;

  return Math.round(savings * 100);
}

interface PolarPricingProps {
  isTeamMember?: boolean;
}

export default function PolarPricing({ isTeamMember = false }: PolarPricingProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ctaLoadingId, setCtaLoadingId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  // Referral code step state
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        console.log('[PolarPricing] Fetching products from API...');
        const res = await fetch("/api/polar/products");
        console.log('[PolarPricing] Response status:', res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error('[PolarPricing] API error:', errorData);
          throw new Error(errorData.error || "Failed to load products");
        }

        const data = (await res.json()) as Product[];
        console.log('[PolarPricing] Products loaded:', data);

        if (active) setProducts(data);
      } catch (e) {
        console.error('[PolarPricing] Error:', e);
        setError((e as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onSubscribe = async (productId: string) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    // Show referral code step before proceeding to checkout
    setPendingProductId(productId);
  };

  const doCheckout = async (productId: string) => {
    try {
      setCtaLoadingId(productId);
      setPendingProductId(null);

      console.log('[PolarPricing] Creating checkout for product:', productId);

      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('[PolarPricing] Checkout error:', errorData);
        throw new Error(errorData.error || "Failed to create checkout");
      }

      const { checkoutUrl } = await res.json();
      console.log('[PolarPricing] Redirecting to checkout:', checkoutUrl);

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('[PolarPricing] Error:', error);
      alert(error instanceof Error ? error.message : "Failed to create checkout. Please try again.");
      setCtaLoadingId(null);
    }
  };

  // const featureList = [
  //   "AI Text Humanization",
  //   "Smart Paraphrasing",
  //   "AI Detection Bypass",
  //   "Multiple Presets",
  //   "Fast Processing",
  //   "History Tracking",
  // ];

  const hasYearlyPlans = useMemo(() => !!products?.some((plan) => plan.yearly), [products]);
  const [hasUserChangedBilling, setHasUserChangedBilling] = useState(false);

  useEffect(() => {
    // Only adjust billing cycle after products have loaded
    if (!loading && products) {
      if (!hasYearlyPlans && billingCycle === "yearly") {
        // No yearly plans available, switch to monthly
        setBillingCycle("monthly");
      } else if (hasYearlyPlans && billingCycle === "monthly" && !hasUserChangedBilling) {
        // Yearly plans are available and user hasn't manually changed it, ensure yearly is selected
        setBillingCycle("yearly");
      }
    }
  }, [hasYearlyPlans, billingCycle, products, loading, hasUserChangedBilling]);

  const maxSavings = useMemo(() => {
    if (!products) return 0;
    return products.reduce((acc, plan) => Math.max(acc, computePlanSavings(plan)), 0);
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center pt-10">
        <div className="inline-flex items-center gap-3 rounded-full border border-[#5e3d2a]/30 bg-card px-5 py-3 text-sm font-medium text-muted-foreground shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[#5e3d2a]" /> Fetching plans…
        </div>
      </div>
    );
  }

  if (error || !products?.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50/70 p-8 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-red-700">We couldn’t load pricing</h3>
        <p className="mt-2 text-sm text-red-600">
          {error || "No products are currently configured in Polar."}
        </p>
        <p className="mt-4 text-xs text-red-500">
          Check your Polar environment variables: POLAR_ACCESS_TOKEN, POLAR_PRODUCT_SMALL, POLAR_PRODUCT_MEDIUM,
          POLAR_PRODUCT_LARGE, POLAR_PRODUCT_YEARLY_SMALL, POLAR_PRODUCT_YEARLY_MEDIUM, POLAR_PRODUCT_YEARLY_LARGE.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Referral code step overlay — shown before checkout */}
      {pendingProductId && (
        <ReferralCodeStep
          onProceed={() => doCheckout(pendingProductId)}
          onCancel={() => setPendingProductId(null)}
          isLoading={!!ctaLoadingId}
        />
      )}

    <div className="space-y-12">
      {hasYearlyPlans && (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setBillingCycle("monthly");
                setHasUserChangedBilling(true);
              }}
              className={`min-w-[100px] px-4 py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${billingCycle === "monthly"
                ? "bg-gradient-to-r from-[#5e3d2a] via-[#5e3d2a] to-[#4a2f1f] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent"
                }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => {
                setBillingCycle("yearly");
                setHasUserChangedBilling(true);
              }}
              className={`min-w-[100px] px-3 py-2 text-xs sm:text-sm font-semibold transition relative flex items-center justify-center gap-1.5 whitespace-nowrap ${billingCycle === "yearly"
                ? "bg-gradient-to-r from-[#5e3d2a] via-[#5e3d2a] to-[#4a2f1f] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent"
                }`}
            >
              <span>Yearly billing</span>
              {billingCycle === "yearly" && (
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold whitespace-nowrap bg-white/25 text-white border border-white/40">
                  Save 50%
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8 w-full px-2 sm:px-0 overflow-visible">
        {products.map((product, index) => {
          const { headline, features } = parseProductDescription(product.uiDescription ?? product.description);
          const isPopular = index === 1 && products.length > 1;
          const desiredOption = billingCycle === "yearly" ? product.yearly : product.monthly;
          const fallbackOption = product.monthly ?? product.yearly;
          const activeOption = desiredOption ?? fallbackOption;
          const activeCycle: BillingCycle = activeOption && product.yearly && activeOption.id === product.yearly.id ? "yearly" : "monthly";
          const activeProductId = activeOption?.id;
          const effectiveMonthlyAmount = getEffectiveMonthlyAmount(activeOption);
          const primaryPrice = effectiveMonthlyAmount != null ? formatCurrency(effectiveMonthlyAmount, activeOption?.priceCurrency) : "";
          const annualBillingAmount = activeCycle === "yearly" ? getAnnualBillingAmount(product.yearly) : null;
          const planSavings = computePlanSavings(product);
          const showSavingsBadge = activeCycle === "yearly" && planSavings > 0;

          return (
            <div
              key={product.key}
              className={`group relative flex h-full flex-col border transition-all duration-700 p-8 sm:p-10 md:p-12 w-full ${
                isPopular
                  ? "bg-white/5 backdrop-blur-3xl border-[#8B6F47]/60 shadow-2xl shadow-[#8B6F47]/50 scale-105 z-10 hover:shadow-[0_0_100px_rgba(139,111,71,1),0_0_150px_rgba(139,111,71,0.8),0_0_200px_rgba(139,111,71,0.5),inset_0_0_80px_rgba(139,111,71,0.4)] hover:border-[#8B6F47] hover:scale-[1.08] hover:bg-white/15 overflow-visible"
                  : "bg-white border-gray-200 shadow-lg hover:shadow-xl overflow-hidden"
              }`}
              style={isPopular ? {
                background: 'linear-gradient(135deg, rgba(139, 111, 71, 0.35) 0%, rgba(109, 86, 53, 0.45) 50%, rgba(90, 69, 41, 0.35) 100%)',
                backdropFilter: 'blur(60px) saturate(200%)',
                WebkitBackdropFilter: 'blur(60px) saturate(200%)',
                boxShadow: '0 12px 48px 0 rgba(139, 111, 71, 0.6), inset 0 2px 0 0 rgba(255, 255, 255, 0.5), inset 0 -2px 0 0 rgba(139, 111, 71, 0.4), 0 0 60px rgba(139, 111, 71, 0.4)'
              } : undefined}
            >
              {/* Multiple glass reflection layers */}
              {isPopular && (
                <>
                  {/* Top glass shine - more brownish when not hovering */}
                  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#D4C4B0]/30 via-[#A0826D]/10 to-transparent opacity-50 group-hover:from-white/40 group-hover:via-white/10 group-hover:opacity-80 transition-all duration-700 pointer-events-none"></div>
                  
                  {/* Diagonal glass reflection - brownish tint */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A0826D]/20 via-transparent to-[#8B6F47]/30 opacity-40 group-hover:from-white/30 group-hover:opacity-80 transition-all duration-700 pointer-events-none"></div>
                  
                  {/* Reverse diagonal for depth - brownish */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#8B6F47]/25 via-transparent to-[#A0826D]/15 opacity-35 group-hover:to-white/20 group-hover:opacity-70 transition-all duration-700 pointer-events-none"></div>
                  
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" style={{
                    animation: 'shimmer 3s infinite'
                  }}></div>
                  
                  {/* Outer glow aura - multiple layers */}
                  <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{
                    background: 'radial-gradient(circle at center, rgba(139, 111, 71, 0.8), rgba(139, 111, 71, 0.4), transparent)',
                    filter: 'blur(30px)',
                    zIndex: -1
                  }}></div>
                  
                  <div className="absolute -inset-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{
                    background: 'radial-gradient(circle at center, rgba(139, 111, 71, 0.6), rgba(139, 111, 71, 0.2), transparent)',
                    filter: 'blur(50px)',
                    zIndex: -2
                  }}></div>
                </>
              )}
              {isPopular && (
                <>
                  <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F5E6D3] to-white px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-[#8B6F47] shadow-lg whitespace-nowrap border border-[#8B6F47]/20">
                    Most Loved
                  </div>
                  {/* Glowing orb effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#8B6F47]/30 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#6D5635]/30 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                </>
              )}

              {showSavingsBadge && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white whitespace-nowrap border border-white/30 shadow-lg">
                  Save {planSavings}%
                </div>
              )}

              <div className="flex flex-1 flex-col w-full">
                <div className="mb-8">
                  <h4 className={`text-xl sm:text-2xl font-semibold tracking-tight mb-6 ${isPopular ? "text-white" : "text-gray-900"}`}>{product.name}</h4>
                  <div className={`mt-4 sm:mt-5 flex flex-wrap items-baseline gap-1.5 sm:gap-2 ${isPopular ? "text-white" : "text-gray-900"}`}>
                    {activeCycle === "yearly" && product.yearly?.priceAmount ? (
                      <>
                        {/* Show monthly (original) price struck out if available */}
                        {product.monthly?.priceAmount && (
                          <span className={`text-xl sm:text-2xl font-semibold line-through decoration-2 ${isPopular ? "text-white/60" : "text-slate-400"}`}>
                            {formatCurrency(
                              product.monthly.priceAmount / 100,
                              product.monthly.priceCurrency
                            )}
                          </span>
                        )}

                        {/* Show yearly divided by 12 */}
                        <span className="text-3xl sm:text-4xl font-semibold">
                          {formatCurrency(
                            (product.yearly.priceAmount / 12) / 100,
                            product.yearly.priceCurrency
                          )}
                        </span>
                        <span className={`text-sm w-full sm:w-auto ${isPopular ? "text-white/90" : "text-gray-400"}`}>per month (billed annually)</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl sm:text-4xl font-semibold">
                          {primaryPrice || "Contact us"}
                        </span>
                        <span className={`text-sm ${isPopular ? "text-white/90" : "text-gray-400"}`}>per month</span>
                      </>
                    )}
                  </div>

                  {activeCycle === "yearly" ? (
                    <p className={`mt-2 text-[13px] ${isPopular ? "text-white/80" : "text-gray-400"}`}>
                      {annualBillingAmount != null
                        ? `Billed annually at ${formatCurrency(annualBillingAmount, activeOption?.priceCurrency)} — save 50%`
                        : "Billed annually"}
                    </p>
                  ) : (
                    <p className={`mt-2 text-[13px] ${isPopular ? "text-white/80" : "text-gray-400"}`}>Billed monthly</p>
                  )}
                </div>

                <div className="mt-8 sm:mt-10 flex flex-col gap-4 sm:gap-5">
                  {isTeamMember ? (
                    <Button
                      className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl py-4 sm:py-5 text-xs sm:text-sm font-semibold shadow-sm bg-slate-100 text-muted-foreground cursor-not-allowed hover:bg-slate-100"
                      disabled
                    >
                      Managed by Team Owner
                    </Button>
                  ) : (
                      <Button
                      className={`w-full h-14 sm:h-16 py-4 sm:py-5 text-sm sm:text-[15px] font-semibold shadow-lg transition-all duration-300 ${
                        isPopular
                          ? "bg-white text-[#8B6F47] hover:bg-[#F5E6D3] hover:text-[#6D5635] hover:shadow-[0_0_30px_rgba(245,230,211,0.8)] hover:scale-105"
                          : "bg-gray-900 text-white hover:bg-[#5e3d2a]"
                      }`}
                      onClick={() => activeProductId && onSubscribe(activeProductId)}
                      disabled={!activeProductId || !!ctaLoadingId}
                    >
                      {ctaLoadingId === activeProductId
                        ? "Processing…"
                        : "Subscribe"}
                    </Button>
                  )}
                <p className={`text-center text-xs sm:text-[13px] ${isPopular ? "text-white/80" : "text-gray-400"}`}>No hidden fees · Cancel anytime · Secure checkout</p>
                </div>

                <p className={`mt-6 sm:mt-8 text-sm leading-relaxed ${isPopular ? "text-white/90" : "text-gray-500"}`}>{headline}</p>

                <ul className={`mt-6 sm:mt-8 space-y-4 sm:space-y-5 text-sm ${isPopular ? "text-white/90" : "text-gray-600"}`}>
                  {features.map((feature, featureIndex) => (
                    <li key={`${product.key}-feature-${featureIndex}`} className="flex items-start gap-2 sm:gap-3">
                      <ShieldCheck className={`mt-0.5 sm:mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${isPopular ? "text-white" : "text-[#5e3d2a]"}`} />
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}

                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}



