"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, ShieldCheck, Flame } from "lucide-react";
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
  if (!description) return {
    headline: "Everything you need to humanize confidently.",
    features: ["Instant AI-to-human conversions", "Copy & export in one click", "Cancel or upgrade any time"],
  };
  const lines = description.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let headline = "Everything you need to humanize confidently.";
  const features: string[] = [];
  const headlineLines: string[] = [];
  let foundBullet = false;
  for (const line of lines) {
    if (line.includes("**Credits reset:**")) continue;
    if (line.startsWith("•") || line.startsWith("-")) {
      foundBullet = true;
      const cleaned = line.replace(/^[•\-]\s*/, "").trim();
      if (cleaned) features.push(cleaned);
    } else if (!foundBullet) {
      headlineLines.push(line);
    }
  }
  if (headlineLines.length > 0) headline = headlineLines.join(" ");
  return {
    headline,
    features: features.length > 0 ? features : ["Instant AI-to-human conversions", "Copy & export in one click", "Cancel or upgrade any time"],
  };
}

function formatCurrency(amount: number, currency?: string | null) {
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: currency ?? "USD",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  });
}

function getAnnualBillingAmount(option: ProductPriceOption | null): number | null {
  if (!option?.priceAmount) return null;
  if (option.recurringInterval === "year") return option.priceAmount / 100;
  if (option.recurringInterval === "month") return (option.priceAmount * 12) / 100;
  return null;
}

function computePlanSavings(plan: Product): number {
  const m = plan.monthly?.priceAmount;
  const y = plan.yearly?.priceAmount;
  if (!m || !y) return 0;
  const savings = 1 - (y * 12) / (m * 12);
  return savings <= 0 ? 0 : Math.round(savings * 100);
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [ctaLoading, setCtaLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");

  // 59-second countdown — resets every time modal opens, stops at 0, never auto-dismisses
  const [seconds, setSeconds] = useState(59);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSeconds(59);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      setLoading(true);
      fetch("/api/polar/products")
        .then(r => r.json())
        .then((data: Product[]) => {
          setProducts(data);
          // Default to yearly if available
          if (data.some((p: Product) => p.yearly)) setBillingCycle("yearly");
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Ultra plan = last product (index 2), same as pricing page
  const ultraPlan = products?.find(p => p.name.toLowerCase().includes("ultra")) ?? products?.[products.length - 1];

  const desiredOption = billingCycle === "yearly" ? ultraPlan?.yearly : ultraPlan?.monthly;
  const activeOption = desiredOption ?? ultraPlan?.monthly ?? ultraPlan?.yearly;
  const activeCycle: BillingCycle = activeOption && ultraPlan?.yearly && activeOption.id === ultraPlan.yearly.id ? "yearly" : "monthly";

  const annualBillingAmount = activeCycle === "yearly" ? getAnnualBillingAmount(ultraPlan?.yearly ?? null) : null;
  const planSavings = ultraPlan ? computePlanSavings(ultraPlan) : 0;
  const showSavingsBadge = activeCycle === "yearly" && planSavings > 0;
  const hasYearly = !!ultraPlan?.yearly;

  const { headline, features } = parseProductDescription(ultraPlan?.uiDescription ?? ultraPlan?.description);

  const pad = (n: number) => String(n).padStart(2, "0");

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const onSubscribe = async () => {
    if (!activeOption?.id) return;
    try {
      setCtaLoading(true);
      if (!isSignedIn) { router.push("/sign-in"); setCtaLoading(false); return; }
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: activeOption.id }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Checkout failed");
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (e) {
      console.error(e);
      setCtaLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[300] overflow-y-auto transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ background: "linear-gradient(160deg, #fdf8f2 0%, #f5e9d8 50%, #ede0cc 100%)" }}
    >
      {/* Dot texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(#5e3d2a 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* X button */}
      <button onClick={handleClose}
        className="fixed top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#d4b896] shadow-sm hover:bg-[#fdf0e4] transition-colors"
        aria-label="Dismiss">
        <X className="h-4 w-4 text-[#3b1f0e]" />
      </button>

      <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-10 pb-12 sm:justify-center sm:pt-12">
        <div className={`w-full max-w-sm transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>

          {/* ── HEADLINE ── */}
          <div className="text-center mb-5">
            <h1 className="text-[1.6rem] sm:text-[1.9rem] font-extrabold text-[#1a0a00] leading-tight tracking-tight mb-2">
              Unlock Ultra at <span className="text-[#8b6f47]">50% OFF</span>
            </h1>
            <p className="text-[#5e3d2a]/70 text-sm leading-relaxed max-w-xs mx-auto">
              Claim this one-time welcome offer to unlock our most powerful AI Humanizer at 50% off.
            </p>
          </div>

          {/* ── COUNTDOWN PILL ── */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 bg-white border border-[#d4b896] rounded-full px-5 py-2.5 shadow-sm">
              <span className="text-[#3b1f0e] font-semibold text-sm">Offer ends in</span>
              <span className={`font-black text-base tabular-nums tracking-tight ${seconds === 0 ? "text-[#8b6f47]/40" : "text-[#3b1f0e]"}`}>
                00:{pad(seconds)}
              </span>
              {seconds === 0 && <span className="text-[10px] text-[#8b6f47]/60 italic">still available</span>}
            </div>
          </div>

          {/* ── BILLING TOGGLE — same as pricing page ── */}
          {hasYearly && (
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center border border-[#d4b896] bg-white p-1 shadow-sm rounded-sm">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`min-w-[100px] px-4 py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-[#5e3d2a] to-[#4a2f1f] text-white shadow-sm"
                      : "text-[#8b6f47] hover:text-[#5e3d2a] bg-transparent"
                  }`}
                >
                  Monthly billing
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`min-w-[100px] px-3 py-2 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-[#5e3d2a] to-[#4a2f1f] text-white shadow-sm"
                      : "text-[#8b6f47] hover:text-[#5e3d2a] bg-transparent"
                  }`}
                >
                  Yearly billing
                  {billingCycle === "yearly" && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-white/25 text-white border border-white/40">
                      Save 50%
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── ULTRA CARD — exact same as pricing page (index 2, white card) ── */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4b896] bg-white px-4 py-2 text-xs font-medium text-[#5e3d2a] shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-[#8b6f47]" /> Loading plan…
              </div>
            </div>
          ) : !ultraPlan ? (
            <p className="text-center text-sm text-red-600 py-6">Unable to load plan. Please try again.</p>
          ) : (
            <div className="relative flex flex-col bg-white border border-[#d4b896] shadow-lg hover:shadow-xl overflow-hidden rounded-2xl p-8 w-full">

              {/* 50% OFF badge — top-right corner */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#fff3e0] border border-[#f5c87a] text-[#8b5e00] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Flame className="w-3 h-3 text-orange-500" />
                50% OFF
              </div>

              {/* Save badge (yearly) */}
              {showSavingsBadge && (
                <div className="absolute top-3 left-3 bg-[#5e3d2a]/10 px-2 py-0.5 text-[10px] font-semibold text-[#5e3d2a] whitespace-nowrap rounded-full">
                  Save {planSavings}%
                </div>
              )}

              <div className="flex flex-1 flex-col w-full">
                {/* Plan name */}
                <h4 className="text-xl sm:text-2xl font-semibold tracking-tight mb-6 text-gray-900">
                  {ultraPlan.name}
                </h4>

                {/* Price — identical logic to PolarPricing */}
                <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 text-gray-900">
                  {activeCycle === "yearly" && ultraPlan.yearly?.priceAmount ? (
                    <>
                      {ultraPlan.monthly?.priceAmount && (
                        <span className="text-xl sm:text-2xl font-semibold line-through decoration-2 text-slate-400">
                          {formatCurrency(ultraPlan.monthly.priceAmount / 100, ultraPlan.monthly.priceCurrency)}
                        </span>
                      )}
                      <span className="text-3xl sm:text-4xl font-semibold">
                        {formatCurrency((ultraPlan.yearly.priceAmount / 12) / 100, ultraPlan.yearly.priceCurrency)}
                      </span>
                      <span className="text-sm text-gray-400 w-full sm:w-auto">per month (billed annually)</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl sm:text-4xl font-semibold">
                        {activeOption?.priceAmount ? formatCurrency(activeOption.priceAmount / 100, activeOption.priceCurrency) : "Contact us"}
                      </span>
                      <span className="text-sm text-gray-400">per month</span>
                    </>
                  )}
                </div>

                {activeCycle === "yearly" ? (
                  <p className="mt-2 text-[13px] text-gray-400">
                    {annualBillingAmount != null
                      ? `Billed annually at ${formatCurrency(annualBillingAmount, activeOption?.priceCurrency)} — save 50%`
                      : "Billed annually"}
                  </p>
                ) : (
                  <p className="mt-2 text-[13px] text-gray-400">Billed monthly</p>
                )}

                {/* CTA — same as pricing page non-popular card */}
                <div className="mt-8 flex flex-col gap-4">
                  <button
                    onClick={onSubscribe}
                    disabled={ctaLoading || !activeOption}
                    className="w-full h-14 rounded-xl py-4 text-sm font-semibold shadow-lg transition-all duration-300 bg-gray-900 text-white hover:bg-[#5e3d2a] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {ctaLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                    ) : "Subscribe"}
                  </button>
                  <p className="text-center text-xs text-gray-400">No hidden fees · Cancel anytime · Secure checkout</p>
                </div>

                {/* Headline */}
                <p className="mt-6 text-sm leading-relaxed text-gray-500">{headline}</p>

                {/* Features — same as pricing page */}
                <ul className="mt-6 space-y-4 text-sm text-gray-600">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5e3d2a]" />
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Dismiss */}
          <div className="text-center mt-5">
            <button onClick={handleClose}
              className="text-xs text-[#8b6f47]/50 hover:text-[#5e3d2a] transition-colors underline underline-offset-2">
              No thanks, I'll use my free credits
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
