"use client";

import { useState, useEffect } from "react";
import { X, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  const lines = description.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  let headline = "Everything you need to humanize confidently.";
  let features: string[] = [];
  const headlineLines: string[] = [];
  let foundBulletSection = false;

  for (const line of lines) {
    if (line.includes('**Credits reset:**')) {
      continue;
    }

    if (line.startsWith('•') || line.startsWith('-')) {
      foundBulletSection = true;
      const cleaned = line.replace(/^[•\-]\s*/, '').trim();
      if (cleaned) {
        features.push(cleaned);
      }
    } else if (!foundBulletSection) {
      headlineLines.push(line);
    }
  }

  if (headlineLines.length > 0) {
    headline = headlineLines.join(' ');
  }

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

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [ctaLoadingId, setCtaLoadingId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      
      // Fetch products
      (async () => {
        try {
          const res = await fetch("/api/polar/products");
          if (!res.ok) {
            throw new Error("Failed to load products");
          }
          const data = (await res.json()) as Product[];
          setProducts(data);
        } catch (e) {
          console.error('[PricingModal] Error:', e);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const onSubscribe = async (productId: string) => {
    try {
      setCtaLoadingId(productId);
      if (!isSignedIn) {
        router.push("/sign-in");
        setCtaLoadingId(null);
        return;
      }

      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create checkout");
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('[PricingModal] Error:', error);
      alert(error instanceof Error ? error.message : "Failed to create checkout. Please try again.");
      setCtaLoadingId(null);
    }
  };

  const hasYearlyPlans = products?.some((plan) => plan.yearly) ?? false;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-[#f0f9ff] rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        style={{ 
          backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-md"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] text-white p-8 text-center rounded-t-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            🎉 Welcome to HumanifyLab!
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Choose your perfect plan and start transforming AI text into natural, human-like writing
          </p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#bfdbfe] bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-[#3b82f6]" /> Loading plans…
              </div>
            </div>
          ) : !products?.length ? (
            <div className="text-center py-12">
              <p className="text-red-600">Unable to load pricing plans. Please try again later.</p>
            </div>
          ) : (
            <>
              {/* Toggle Button */}
              {hasYearlyPlans && (
                <div className="flex flex-col items-center gap-2 text-center mb-8">
                  <div className="inline-flex items-center rounded-full border border-border bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      className={`min-w-[100px] rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                        billingCycle === "monthly"
                          ? "bg-gradient-to-r from-[#5e3d2a] via-[#5e3d2a] to-[#4a2f1f] text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground bg-transparent"
                      }`}
                    >
                      Monthly billing
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("yearly")}
                      className={`min-w-[100px] rounded-full px-3 py-2 text-xs sm:text-sm font-semibold transition relative flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        billingCycle === "yearly"
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

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {products.map((product, index) => {
                  const { headline, features } = parseProductDescription(product.uiDescription ?? product.description);
                  const isPopular = index === 1 && products.length > 1;
                  const desiredOption = billingCycle === "yearly" ? product.yearly : product.monthly;
                  const fallbackOption = product.monthly ?? product.yearly;
                  const activeOption = desiredOption ?? fallbackOption;
                  const activeCycle: BillingCycle = activeOption && product.yearly && activeOption.id === product.yearly.id ? "yearly" : "monthly";
                  const activeProductId = activeOption?.id;
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
                          <h4 className={`text-lg sm:text-xl font-semibold ${isPopular ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "text-foreground"}`}>
                            {product.name}
                          </h4>
                          <div className={`mt-2 sm:mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2 ${isPopular ? "text-white" : "text-foreground"}`}>
                            {activeCycle === "yearly" && product.yearly?.priceAmount ? (
                              <>
                                {product.monthly?.priceAmount && (
                                  <span className={`text-xl sm:text-2xl font-semibold line-through decoration-2 ${isPopular ? "text-white/60" : "text-slate-400"}`}>
                                    {formatCurrency(
                                      product.monthly.priceAmount / 100,
                                      product.monthly.priceCurrency
                                    )}
                                  </span>
                                )}
                                <span className="text-3xl sm:text-4xl font-semibold">
                                  {formatCurrency(
                                    (product.yearly.priceAmount / 12) / 100,
                                    product.yearly.priceCurrency
                                  )}
                                </span>
                                <span className={`text-xs sm:text-sm w-full sm:w-auto ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>
                                  per month (billed annually)
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-3xl sm:text-4xl font-semibold">
                                  {activeOption?.priceAmount ? formatCurrency(activeOption.priceAmount / 100, activeOption.priceCurrency) : "Contact us"}
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
                            {ctaLoadingId === activeProductId ? "Processing…" : "Subscribe"}
                          </Button>
                          <p className={`text-center text-[10px] sm:text-xs ${isPopular ? "text-white/80" : "text-muted-foreground"}`}>
                            No hidden fees · Cancel anytime · Secure checkout
                          </p>
                        </div>

                        <p className={`mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>
                          {headline}
                        </p>

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

              {/* Bottom CTA */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  ✨ All plans include 99.9% writing quality enhancement and unlimited humanizations
                </p>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 underline text-sm"
                >
                  I'll decide later
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
