"use client";

import { useState, useEffect } from "react";
import { X, Loader2, ShieldCheck, Flame, Clock, ArrowRight } from "lucide-react";
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

function pad(n: number) { return String(n).padStart(2, "0"); }

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ d: "06", h: "23", m: "59", s: "59" });
  useEffect(() => {
    let deadline: number;
    try {
      const stored = localStorage.getItem("banner_deadline_v2");
      deadline = stored ? parseInt(stored, 10) : Date.now() + 7 * 24 * 60 * 60 * 1000;
      if (!stored) localStorage.setItem("banner_deadline_v2", String(deadline));
    } catch { deadline = Date.now() + 7 * 24 * 60 * 60 * 1000; }

    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) { setTimeLeft({ d: "00", h: "00", m: "00", s: "00" }); return; }
      const t = Math.floor(diff / 1000);
      setTimeLeft({ d: pad(Math.floor(t / 86400)), h: pad(Math.floor((t % 86400) / 3600)), m: pad(Math.floor((t % 3600) / 60)), s: pad(t % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [ctaLoadingId, setCtaLoadingId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const timeLeft = useCountdown();

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
      className={`fixed inset-0 z-[200] overflow-y-auto transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop — covers navbar, banner, everything */}
      <div
        className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Scroll container */}
      <div className="relative z-[201] flex min-h-full items-start justify-center p-4 pt-6 sm:items-center sm:p-6">

        {/* Modal wrapper */}
        <div className="relative w-full max-w-6xl">
          {/* Close Button — top-right corner of modal, always visible */}
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-[60] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors sm:right-4 sm:top-4 sm:h-10 sm:w-10"
            aria-label="Close pricing modal"
          >
            <X className="h-4 w-4 text-gray-700 sm:h-5 sm:w-5" />
          </button>

        {/* Modal content */}
        <div
          className={`relative w-full bg-[#f0f9ff] rounded-2xl shadow-2xl transform transition-all duration-300 ${
            isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
          style={{
            backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Discount Banner — matches homepage YearlyDiscountBanner */}
          <div
            className="relative w-full overflow-hidden rounded-t-2xl"
            style={{ background: "linear-gradient(90deg, #0f0c29 0%, #1a1040 30%, #24243e 60%, #0f0c29 100%)" }}
          >
            {/* Animated sweep */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(105deg, transparent 35%, rgba(139,92,246,0.12) 50%, transparent 65%)",
                backgroundSize: "250% 100%",
                animation: "sweep 4s ease-in-out infinite",
              }}
            />
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #7c3aed, #f59e0b, #8B6F47, #7c3aed)" }} />
            <style>{`@keyframes sweep{0%{background-position:200% center}100%{background-position:-200% center}}@keyframes flicker{0%,100%{opacity:1}45%{opacity:.75}50%{opacity:1}55%{opacity:.8}}`}</style>

            <div className="flex w-full flex-wrap items-center justify-center gap-2 px-4 py-3 sm:gap-3 sm:px-8 sm:py-4">
              {/* Badge */}
              <span className="flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5">
                <Flame className="h-3 w-3 text-amber-400" style={{ animation: "flicker 2.4s ease-in-out infinite" }} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">500K Users</span>
              </span>

              {/* Message */}
              <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center text-xs font-medium text-white/90 sm:text-sm">
                <span className="font-semibold text-white">Celebrating with</span>
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-white sm:text-sm"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 0 12px rgba(139,92,246,0.5)" }}
                >
                  50% OFF
                </span>
                <span className="font-semibold text-white">all Yearly plans</span>
                <span className="hidden text-white/50 sm:inline">·</span>
                <span className="hidden text-xs text-white/70 sm:inline">Save up to $120/yr</span>
              </p>

              {/* Countdown */}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-white/40" />
                <span className="mr-0.5 text-[10px] font-medium text-white/50">Ends in</span>
                {([
                  { val: timeLeft.d, label: "d" },
                  { val: timeLeft.h, label: "h" },
                  { val: timeLeft.m, label: "m" },
                  { val: timeLeft.s, label: "s" },
                ] as { val: string; label: string }[]).map((unit, i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    <span className="flex flex-col items-center">
                      <span className="inline-flex min-w-[1.75rem] items-center justify-center rounded border border-white/10 bg-white/10 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white">
                        {unit.val}
                      </span>
                      <span className="mt-0.5 text-[8px] font-medium leading-none text-white/30">{unit.label}</span>
                    </span>
                    {i < 3 && <span className="mb-2 text-xs font-bold text-white/40">:</span>}
                  </span>
                ))}
              </span>

              {/* CTA pill */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%)", boxShadow: "0 0 10px rgba(139,92,246,0.35)" }}
              >
                Claim 50% Off <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#8B6F47] via-[#6D5635] to-[#5A4529] px-6 py-5 text-center text-white md:px-8 md:py-6">
            <h2 className="mb-1 text-xl font-bold md:text-2xl">🎉 Welcome to HumanifyLab!</h2>
            <p className="text-sm opacity-90 md:text-base">Choose your plan and start humanizing AI text today</p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
          {loading ? (
              <div className="flex justify-center py-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A0826D] bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-[#8B6F47]" /> Loading plans…
              </div>
            </div>
          ) : !products?.length ? (
            <div className="text-center py-10">
              <p className="text-sm text-red-600">Unable to load pricing plans. Please try again later.</p>
            </div>
          ) : (
            <>
              {/* Toggle Button */}
              {hasYearlyPlans && (
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                  <div className="inline-flex items-center rounded-full border border-border bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      className={`min-w-[90px] rounded-full px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                        billingCycle === "monthly"
                          ? "bg-gradient-to-r from-[#8B6F47] to-[#6D5635] text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground bg-transparent"
                      }`}
                    >
                      Monthly billing
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("yearly")}
                      className={`min-w-[90px] rounded-full px-3 py-1.5 text-xs font-semibold transition relative flex items-center justify-center gap-1.5 whitespace-nowrap ${
                        billingCycle === "yearly"
                          ? "bg-gradient-to-r from-[#8B6F47] to-[#6D5635] text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground bg-transparent"
                      }`}
                    >
                      <span>Yearly billing</span>
                      {billingCycle === "yearly" && (
                        <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold whitespace-nowrap bg-white/25 text-white border border-white/40">
                          Save 50%
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
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
                      className={`relative flex h-full flex-col rounded-2xl border transition duration-300 p-5 md:p-6 w-full ${
                        isPopular
                          ? "bg-gradient-to-br from-[#8B6F47] to-[#6D5635] border-[#8B6F47]/30 shadow-2xl shadow-[#8B6F47]/20 scale-105 z-10"
                          : index === 2
                          ? "bg-white border-[#A0826D] shadow-lg hover:shadow-xl"
                          : "bg-white border-gray-200 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#8B6F47] shadow-lg whitespace-nowrap">
                          Most Loved
                        </div>
                      )}

                      {showSavingsBadge && (
                        <div className="absolute top-3 right-3 rounded-full bg-[#8B6F47]/10 px-2 py-0.5 text-[10px] font-semibold text-[#8B6F47] whitespace-nowrap">
                          Save {planSavings}%
                        </div>
                      )}

                      <div className="flex flex-1 flex-col w-full">
                        <div>
                          <h4 className={`text-base font-semibold ${isPopular ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "text-foreground"}`}>
                            {product.name}
                          </h4>
                          <div className={`mt-2 flex flex-wrap items-baseline gap-1.5 ${isPopular ? "text-white" : "text-foreground"}`}>
                            {activeCycle === "yearly" && product.yearly?.priceAmount ? (
                              <>
                                {product.monthly?.priceAmount && (
                                  <span className={`text-lg font-semibold line-through decoration-2 ${isPopular ? "text-white/60" : "text-slate-400"}`}>
                                    {formatCurrency(
                                      product.monthly.priceAmount / 100,
                                      product.monthly.priceCurrency
                                    )}
                                  </span>
                                )}
                                <span className="text-2xl font-semibold">
                                  {formatCurrency(
                                    (product.yearly.priceAmount / 12) / 100,
                                    product.yearly.priceCurrency
                                  )}
                                </span>
                                <span className={`text-xs w-full ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>
                                  per month (billed annually)
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-2xl font-semibold">
                                  {activeOption?.priceAmount ? formatCurrency(activeOption.priceAmount / 100, activeOption.priceCurrency) : "Contact us"}
                                </span>
                                <span className={`text-xs ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>per month</span>
                              </>
                            )}
                          </div>

                          {activeCycle === "yearly" ? (
                            <p className={`mt-1.5 text-[11px] ${isPopular ? "text-white/90" : ""}`}>
                              {annualBillingAmount != null
                                ? `Billed annually at ${formatCurrency(annualBillingAmount, activeOption?.priceCurrency)} - Save 50%!`
                                : "Billed annually"}
                            </p>
                          ) : (
                            <p className={`mt-1.5 text-[11px] ${isPopular ? "text-white/90" : ""}`}>Billed monthly</p>
                          )}
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                          <Button
                            className={`w-full h-10 rounded-xl py-2.5 text-xs font-semibold shadow-sm transition-all ${
                              isPopular
                                ? "bg-white text-[#8B6F47] hover:bg-[#F5E6D3] hover:text-[#6D5635]"
                                : index === 2
                                ? "bg-gradient-to-r from-[#8B6F47] to-[#6D5635] text-white hover:from-[#6D5635] hover:to-[#5A4529]"
                                : "bg-gray-900 text-white hover:bg-gray-800"
                            }`}
                            onClick={() => activeProductId && onSubscribe(activeProductId)}
                            disabled={!activeProductId || !!ctaLoadingId}
                          >
                            {ctaLoadingId === activeProductId ? "Processing…" : "Subscribe"}
                          </Button>
                          <p className={`text-center text-[10px] ${isPopular ? "text-white/80" : "text-muted-foreground"}`}>
                            No hidden fees · Cancel anytime · Secure checkout
                          </p>
                        </div>

                        <p className={`mt-3 text-xs leading-relaxed ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>
                          {headline}
                        </p>

                        <ul className={`mt-3 space-y-2 text-xs ${isPopular ? "text-white/90" : "text-muted-foreground"}`}>
                          {features.map((feature, featureIndex) => (
                            <li key={`${product.key}-feature-${featureIndex}`} className="flex items-start gap-2">
                              <ShieldCheck className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${isPopular ? "text-white" : "text-[#8B6F47]"}`} />
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
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  ✨ All plans include 99.9% writing quality enhancement and unlimited humanizations
                </p>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 underline text-xs"
                >
                  I'll decide later — use my free credits
                </button>
              </div>
            </>
          )}
          </div>
          {/* end content */}
        </div>
        {/* end modal content */}
      </div>
      {/* end modal wrapper */}
      </div>
      {/* end scroll container */}
    </div>
  );
}
