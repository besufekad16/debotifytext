"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
    try {
      setCtaLoadingId(productId);
      if (!isSignedIn) {
        router.push("/sign-in");
        setCtaLoadingId(null);
        return;
      }

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

      // Redirect to Polar checkout
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
    <div className="space-y-12">
      {hasYearlyPlans && (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setBillingCycle("monthly");
                setHasUserChangedBilling(true);
              }}
              className={`min-w-[100px] rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${billingCycle === "monthly"
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
              className={`min-w-[100px] rounded-full px-3 py-2 text-xs sm:text-sm font-semibold transition relative flex items-center justify-center gap-1.5 whitespace-nowrap ${billingCycle === "yearly"
                ? "bg-gradient-to-r from-[#5e3d2a] via-[#5e3d2a] to-[#4a2f1f] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground bg-transparent"
                }`}
            >
              <span>Yearly billing</span>
              {billingCycle === "yearly" && (
                <span className="rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold whitespace-nowrap bg-white/25 text-white border border-white/40">
                  Save 50%
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8 w-full px-2 sm:px-0">
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
              className={`relative flex h-full flex-col rounded-[24px] sm:rounded-[28px] md:rounded-[30px] border transition duration-300 p-5 sm:p-6 md:p-8 w-full ${
                isPopular
                  ? "bg-gradient-to-br from-[#5e3d2a] via-[#5e3d2a] to-[#4a2f1f] border-[#5e3d2a]/30 shadow-2xl shadow-[#5e3d2a]/20 scale-105 z-10"
                  : index === 2
                  ? "bg-white border-blue-200 shadow-lg hover:shadow-xl"
                  : "bg-white border-gray-200 shadow-lg hover:shadow-xl"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold text-[#5e3d2a] shadow-lg whitespace-nowrap">
                  Most Loved
                </div>
              )}

              {showSavingsBadge && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 rounded-full bg-[#5e3d2a]/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#5e3d2a] whitespace-nowrap">
                  Save {planSavings}%
                </div>
              )}

              <div className="flex flex-1 flex-col w-full">
                <div>
                  <h4 className={`text-lg sm:text-xl font-semibold ${isPopular ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "text-foreground"}`}>{product.name}</h4>
                  <div className={`mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2 ${isPopular ? "text-white" : "text-foreground"}`}>
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
                        <span className={`text-xs sm:text-sm w-full sm:w-auto ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>per month (billed annually)</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl sm:text-4xl font-semibold">
                          {primaryPrice || "Contact us"}
                        </span>
                        <span className={`text-xs sm:text-sm ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>per month</span>
                      </>
                    )}
                  </div>

                  {activeCycle === "yearly" ? (
                    <p className={`mt-2 text-xs ${isPopular ? "text-white/90" : ""}`}>
                      {annualBillingAmount != null
                        ? `Billed annually at ${formatCurrency(annualBillingAmount, activeOption?.priceCurrency)} - Save 50%!`
                        : "Billed annually"}
                    </p>
                  ) : (
                    <p className={`mt-2 text-xs ${isPopular ? "text-white/90" : ""}`}>Billed monthly</p>
                  )}
                </div>

                <div className="mt-5 sm:mt-6 flex flex-col gap-3 sm:gap-4">
                  {isTeamMember ? (
                    <Button
                      className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-xs sm:text-sm font-semibold shadow-sm bg-slate-100 text-muted-foreground cursor-not-allowed hover:bg-slate-100"
                      disabled
                    >
                      Managed by Team Owner
                    </Button>
                  ) : (
                    <Button
                      className={`w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-xs sm:text-sm font-semibold shadow-sm transition-all ${
                        isPopular
                          ? "bg-white text-[#5e3d2a] hover:bg-[#5e3d2a]/10 hover:text-[#4a2f1f]"
                          : index === 2
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                      onClick={() => activeProductId && onSubscribe(activeProductId)}
                      disabled={!activeProductId || !!ctaLoadingId}
                    >
                      {ctaLoadingId === activeProductId
                        ? "Processing…"
                        : "Subscribe"}
                    </Button>
                  )}
                  <p className={`text-center text-[10px] sm:text-xs ${isPopular ? "text-white/80" : "text-muted-foreground"}`}>No hidden fees · Cancel anytime · Secure checkout</p>
                </div>

                <p className={`mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>{headline}</p>

                <ul className={`mt-3 sm:mt-4 space-y-2.5 sm:space-y-3 text-xs sm:text-sm ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>
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
  );
}



