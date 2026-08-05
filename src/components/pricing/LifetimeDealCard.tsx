"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { BadgeCheck, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";

interface LifetimeDealCardProps {
  isTeamMember?: boolean;
}

const LIFETIME_FEATURES = [
  "20,000 words every single month",
  "Up to 2,000 words per request",
  "Credits refresh monthly — forever",
  "All core humanization presets",
  "All future updates included",
  "No recurring bills. Ever.",
];

export default function LifetimeDealCard({ isTeamMember = false }: LifetimeDealCardProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [productId, setProductId] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState<string | null>(null);
  const [claimedCount, setClaimedCount] = useState<number>(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const isLifetime = subscriptionPlan === "lifetime";

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/polar/lifetime");
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        setProductId(data.productId ?? null);
        setDisplayPrice(data.displayPrice ?? null);
        setClaimedCount(typeof data.claimedCount === "number" ? data.claimedCount : 0);
      } catch (error) {
        console.error("Failed to fetch lifetime deal:", error);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Know whether the signed-in user already owns the lifetime deal
  useEffect(() => {
    if (!isSignedIn) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/user/credits");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setSubscriptionPlan(data.subscriptionPlan ?? null);
      } catch {
        // Non-critical — worst case the CTA stays enabled
      }
    })();
    return () => {
      active = false;
    };
  }, [isSignedIn]);

  const onClaim = async () => {
    if (!productId) return;
    try {
      setIsSubscribing(true);
      if (!isSignedIn) {
        router.push("/sign-in");
        setIsSubscribing(false);
        return;
      }
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create checkout");
      }
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create checkout. Please try again.");
      setIsSubscribing(false);
    }
  };

  // Only render when the lifetime product is configured in Polar
  if (!productId) {
    return null;
  }

  return (
    <div id="lifetime" className="relative mt-16 scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-[var(--hl-ink)] text-white shadow-2xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--hl-offer)]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--hl-mint-bright)]/20 blur-3xl" />

      <div className="relative grid gap-10 p-8 sm:p-10 md:p-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--hl-offer)]/40 bg-[var(--hl-offer)]/10 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--hl-offer)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--hl-offer)]">
              Back-to-School · Lifetime Deal
            </span>
          </div>

          <h2 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Pay once.{" "}
            <span className="bg-gradient-to-r from-[#F5D78A] via-[#E8B84B] to-[#C8922A] bg-clip-text text-transparent">
              Humanize forever.
            </span>
          </h2>

          <p className="mt-5 max-w-md text-base text-white/75">
            One payment, lifetime access. Your 20,000-word balance refreshes
            every month for as long as HumanifyLab exists — no subscription,
            no renewal, no surprises.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {LIFETIME_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-white/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hl-offer)]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-8 text-center text-gray-900 shadow-xl">
          {displayPrice && (
            <>
              <div className="text-5xl font-black text-[var(--hl-ink)]">{displayPrice}</div>
              <div className="mt-1 text-sm text-gray-500">
                one-time payment · yours for life
              </div>
            </>
          )}

          <Button
            size="lg"
            onClick={onClaim}
            disabled={isSubscribing || isLifetime || isTeamMember}
            className="mt-6 w-full rounded-2xl font-black uppercase tracking-wide text-[var(--hl-ink)] hover:opacity-95"
            style={{
              background: "linear-gradient(135deg,#F5D78A 0%,#E8B84B 45%,#C8922A 100%)",
            }}
          >
            {isSubscribing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isTeamMember ? (
              "Managed by Team"
            ) : isLifetime ? (
              <>
                <BadgeCheck className="h-4 w-4" />
                Lifetime Active
              </>
            ) : (
              "Claim School Lifetime Deal"
            )}
          </Button>

          <p className="mt-4 text-xs text-gray-500">
            {claimedCount > 0
              ? `${claimedCount.toLocaleString()} ${claimedCount === 1 ? "member has" : "members have"} already claimed lifetime access`
              : "30-day money-back guarantee"}
          </p>
        </div>
      </div>
    </div>
  );
}
