"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Loader2, ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import PageNavbar from "~/components/PageNavbar";
import PolarPricing from "~/components/pricing/PolarPricing";
import TopUpSection from "~/components/pricing/TopUpSection";

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

  const clean = (value: string) =>
    value
      .replace(/^[-•]\s*/, "")
      .replace(/\*\*/g, "")
      .replace(/[_`]/g, "")
      .replace(/^#+\s*/, "")
      .replace(/\s+/g, " ")
      .trim();

  const segments = description
    .split(/\r?\n|•|-|\u2022/g)
    .map(clean)
    .filter(Boolean)
    .filter((segment) => !/^key features:?$/i.test(segment.replace(/[^a-z]/gi, "")));

  const headline = segments.shift() ?? "Everything you need to humanize confidently.";
  const features = segments.length
    ? segments
    : [
      "Instant AI-to-human conversions",
      "Copy & export in one click",
      "Cancel or upgrade any time",
    ];

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
  if (monthlyYearTotal <= 0) return 0;

  const savings = 1 - yearlyAmount / monthlyYearTotal;
  if (savings <= 0) return 0;

  return Math.round(savings * 100);
}

interface PricingPageClientProps {
  isTeamMember?: boolean;
  hasSubscription?: boolean;
}

export default function PricingPageClient({ isTeamMember = false, hasSubscription = false }: PricingPageClientProps) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ctaLoadingId, setCtaLoadingId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        console.log('[PricingPage] Fetching products from API...');
        const res = await fetch("/api/polar/products");
        console.log('[PricingPage] Response status:', res.status);

        if (!res.ok) {
          const errorData = await res.json();
          console.error('[PricingPage] API error:', errorData);
          throw new Error(errorData.error || "Failed to load products");
        }

        const data = (await res.json()) as Product[];
        console.log('[PricingPage] Products loaded:', data);

        if (active) setProducts(data);
      } catch (e) {
        console.error('[PricingPage] Error:', e);
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

      console.log('[PricingPage] Creating checkout for product:', productId);

      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('[PricingPage] Checkout error:', errorData);
        throw new Error(errorData.error || "Failed to create checkout");
      }

      const { checkoutUrl } = await res.json();
      console.log('[PricingPage] Redirecting to checkout:', checkoutUrl);

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('[PricingPage] Error:', error);
      alert(error instanceof Error ? error.message : "Failed to create checkout. Please try again.");
      setCtaLoadingId(null);
    }
  };

  const hasYearlyPlans = useMemo(() => !!products?.some((plan) => plan.yearly), [products]);

  useEffect(() => {
    if (!hasYearlyPlans && billingCycle === "yearly") {
      setBillingCycle("monthly");
    }
  }, [hasYearlyPlans, billingCycle]);

  const maxSavings = useMemo(() => {
    if (!products) return 0;
    return products.reduce((acc, plan) => Math.max(acc, computePlanSavings(plan)), 0);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f9ff]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#bfdbfe] bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-[#3b82f6]" /> Fetching plans…
          </div>
        </div>
      </div>
    );
  }

  if (error || !products?.length) {
    return (
      <div className="min-h-screen bg-[#f0f9ff]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <PageNavbar isTeamMember={isTeamMember} />
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-8 gap-2 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>

          <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50/70 p-8 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-red-700">We couldn&apos;t load pricing</h3>
            <p className="mt-2 text-sm text-red-600">
              {error || "No products are currently configured in Polar."}
            </p>
            <p className="mt-4 text-xs text-red-500">
              Check your Polar environment variables: POLAR_ACCESS_TOKEN, POLAR_PRODUCT_SMALL, POLAR_PRODUCT_MEDIUM,
              POLAR_PRODUCT_LARGE, POLAR_PRODUCT_YEARLY_SMALL, POLAR_PRODUCT_YEARLY_MEDIUM, POLAR_PRODUCT_YEARLY_LARGE.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f9ff]" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="container mx-auto max-w-7xl px-4 pb-4">

        <section id="pricing">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mt-12">
              <PolarPricing isTeamMember={isTeamMember} />
            </div>

            {hasSubscription && <TopUpSection />}
          </div>
        </section>

        <div className="mt-16 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-8 text-center">
          <h3 className="mb-3 text-2xl font-bold text-slate-900">
            Need Help Choosing?
          </h3>
          <p className="mb-6 text-slate-600">
            Not sure which plan is right for you? Contact our support team for personalized recommendations.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white"
            onClick={() => router.push("/contact")}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}