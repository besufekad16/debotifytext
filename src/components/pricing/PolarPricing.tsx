"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ReferralCodeStep from "~/components/ReferralCodeStep";
import UnlimitedCard from "~/components/pricing/UnlimitedCard";
import { Infinity as InfinityIcon } from "lucide-react";

type BillingCycle = "monthly" | "yearly" | "unlimited";

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
  defaultBillingCycle?: BillingCycle;
}

export default function PolarPricing({ isTeamMember = false, defaultBillingCycle }: PolarPricingProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ctaLoadingId, setCtaLoadingId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(defaultBillingCycle ?? "unlimited");
  // Referral code step state
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  // Unlimited spots counter
  const [spots, setSpots] = useState<{ taken: number; max: number; remaining: number; isFull: boolean } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        console.log('[PolarPricing] Fetching products from API...');
        const [productsRes, spotsRes] = await Promise.all([
          fetch("/api/polar/products"),
          fetch("/api/polar/unlimited-spots"),
        ]);

        if (!productsRes.ok) {
          const textData = await productsRes.text();
          let errorData: any = {};
          try {
            errorData = JSON.parse(textData);
          } catch (e) {}
          if (active) {
            setError(errorData.error || `Failed to load products (Status ${productsRes.status})`);
            setLoading(false);
          }
          return;
        }

        const data = (await productsRes.json()) as Product[];
        if (active) setProducts(data);

        if (spotsRes.ok) {
          const spotsData = await spotsRes.json();
          if (active) setSpots(spotsData);
        }
      } catch (e) {
        if (active) setError((e as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const onSubscribe = async (productId: string) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    // Show referral code step before proceeding to checkout
    doCheckout(productId);
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
  const hasUnlimitedPlan = useMemo(() => !!products?.some((p) => p.key === 'unlimited_2m'), [products]);
  const [hasUserChangedBilling, setHasUserChangedBilling] = useState(false);

  useEffect(() => {
    if (!loading && products) {
      // Only auto-switch if no defaultBillingCycle was provided
      if (!defaultBillingCycle) {
        if (hasUnlimitedPlan && !hasUserChangedBilling) {
          setBillingCycle("unlimited");
        } else if (!hasYearlyPlans && billingCycle === "yearly") {
          setBillingCycle("monthly");
        } else if (hasYearlyPlans && billingCycle === "monthly" && !hasUserChangedBilling) {
          setBillingCycle("yearly");
        }
      } else {
        // If defaultBillingCycle is provided, only switch if the current cycle is invalid
        if (!hasYearlyPlans && billingCycle === "yearly") {
          setBillingCycle("monthly");
        }
      }
    }
  }, [hasYearlyPlans, hasUnlimitedPlan, billingCycle, products, loading, hasUserChangedBilling, defaultBillingCycle]);

  const maxSavings = useMemo(() => {
    if (!products) return 0;
    return products.reduce((acc, plan) => Math.max(acc, computePlanSavings(plan)), 0);
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center pt-10">
        <div className="inline-flex items-center gap-3 rounded-full border border-green-700/30 bg-card px-5 py-3 text-sm font-medium text-muted-foreground shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-green-700" /> Fetching plans…
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
      {(hasYearlyPlans || hasUnlimitedPlan) && (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/50 p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => { setBillingCycle("monthly"); setHasUserChangedBilling(true); }}
              className={`min-w-[100px] rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                billingCycle === "monthly"
                  ? "bg-white text-green-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  : "bg-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>

            {hasUnlimitedPlan && (
              <button
                type="button"
                onClick={() => { setBillingCycle("unlimited"); setHasUserChangedBilling(true); }}
                className={`relative min-w-[120px] rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  billingCycle === "unlimited"
                    ? "bg-white text-green-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "bg-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <InfinityIcon className="h-3.5 w-3.5" />
                <span>Unlimited</span>
                {billingCycle === "unlimited" && (
                  <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold whitespace-nowrap bg-green-100 text-green-800 rounded-full ml-1">
                    2 Months
                  </span>
                )}
                {/* Hot badge when not selected */}
                {billingCycle !== "unlimited" && (
                  <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full leading-none">
                    HOT
                  </span>
                )}
              </button>
            )}

            {hasYearlyPlans && (
              <button
                type="button"
                onClick={() => { setBillingCycle("yearly"); setHasUserChangedBilling(true); }}
                className={`relative flex min-w-[100px] rounded-full items-center justify-center gap-1.5 whitespace-nowrap px-5 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                  billingCycle === "yearly"
                    ? "bg-white text-green-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "bg-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>Yearly</span>
                {billingCycle === "yearly" && (
                  <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold whitespace-nowrap bg-green-100 text-green-800 rounded-full ml-1">
                    Save 50%
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Regular plans grid — hidden when Unlimited tab is active */}
      {billingCycle !== 'unlimited' && (
      <div className="mx-auto grid max-w-6xl gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8 w-full px-2 sm:px-0 overflow-visible">
        {products.filter(p => p.key !== 'unlimited_2m').map((product, index) => {
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
              className={`group relative flex h-full flex-col transition-all duration-300 p-8 sm:p-10 md:p-12 w-full rounded-[2rem] ${
                isPopular
                  ? "z-10 border border-green-700 bg-[#052E16] shadow-xl"
                  : "border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm"
              }`}
              style={isPopular ? {
                background: 'linear-gradient(180deg, #052E16 0%, #064E3B 100%)',
              } : undefined}
            >
              {isPopular && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent pointer-events-none rounded-[2rem]"></div>
                  <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-500 px-4 py-1.5 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                    Most Loved
                  </div>
                </>
              )}

              {showSavingsBadge && (
                <div className="absolute top-4 right-4 rounded-full bg-slate-100 px-3 py-1 text-[10px] sm:text-xs font-bold text-green-700">
                  Save {planSavings}%
                </div>
              )}

              <div className="flex flex-1 flex-col w-full">
                <div className="mb-8">
                  <h4 className={`text-xl sm:text-2xl font-semibold tracking-tight mb-6 ${isPopular ? "text-white" : "text-slate-900"}`}>{product.name}</h4>
                  <div className={`mt-4 sm:mt-5 flex flex-wrap items-baseline gap-1.5 sm:gap-2 ${isPopular ? "text-white" : "text-slate-900"}`}>
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
                      className={`w-full h-14 sm:h-14 rounded-xl py-4 sm:py-5 text-sm sm:text-[15px] font-semibold shadow-sm transition-all duration-300 ${
                        isPopular
                          ? "bg-green-500 text-white hover:bg-green-400"
                          : "bg-slate-900 text-white hover:bg-slate-800"
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

                <p className={`mt-6 sm:mt-8 text-sm leading-relaxed ${isPopular ? "text-white/90" : "text-slate-400"}`}>{headline}</p>

                <ul className={`mt-6 sm:mt-8 space-y-4 sm:space-y-5 text-sm ${isPopular ? "text-white/90" : "text-slate-500"}`}>
                  {features.map((feature, featureIndex) => (
                    <li key={`${product.key}-feature-${featureIndex}`} className="flex items-start gap-2 sm:gap-3">
                      <ShieldCheck className={`mt-0.5 sm:mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${isPopular ? "text-green-300" : "text-green-800"}`} />
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}

                </ul>
              </div>
            </div>
          );
        })}
      </div>
      )} {/* end billingCycle !== 'unlimited' */}

      {/* Unlimited 2-Month Plan — shown ONLY when Unlimited tab is selected */}
      {billingCycle === 'unlimited' && (() => {
        const unlimitedProduct = products.find(p => p.key === 'unlimited_2m');
        const unlimitedProductId = unlimitedProduct?.monthly?.id ?? unlimitedProduct?.yearly?.id;
        if (!unlimitedProductId) return null;
        return (
          <UnlimitedCard
            productId={unlimitedProductId}
            isTeamMember={isTeamMember}
            spots={spots}
          />
        );
      })()}
    </div>
    </>
  );
}



