"use client";

import { useEffect, useState } from "react";
import { X, Check, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ReferralCodeStep from "~/components/ReferralCodeStep";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Credits-exhausted / upgrade modal — leads with Back-to-School Lifetime.
 */
export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState<string | null>(null);
  const [ctaLoading, setCtaLoading] = useState(false);
  const [showRefStep, setShowRefStep] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }
    const t = setTimeout(() => setIsVisible(true), 10);
    fetch("/api/polar/lifetime")
      .then((r) => r.json())
      .then((d: { productId?: string | null; displayPrice?: string | null }) => {
        if (d.productId) setProductId(d.productId);
        if (d.displayPrice) setDisplayPrice(d.displayPrice);
      })
      .catch(() => {});
    return () => clearTimeout(t);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 250);
  };

  const doCheckout = async () => {
    if (!productId) {
      router.push("/pricing#lifetime");
      return;
    }
    try {
      setCtaLoading(true);
      setShowRefStep(false);
      if (!isSignedIn) {
        router.push("/sign-in");
        setCtaLoading(false);
        return;
      }
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Checkout failed");
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (e) {
      console.error(e);
      setCtaLoading(false);
      router.push("/pricing#lifetime");
    }
  };

  const onClaim = () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (!productId) {
      router.push("/pricing#lifetime");
      return;
    }
    setShowRefStep(true);
  };

  return (
    <>
      {showRefStep && (
        <ReferralCodeStep
          onProceed={doCheckout}
          onCancel={() => setShowRefStep(false)}
          isLoading={ctaLoading}
        />
      )}

      <div
        className={`fixed inset-0 z-[300] flex items-end justify-center bg-[var(--hl-ink)]/60 p-4 backdrop-blur-sm transition-opacity duration-250 sm:items-center ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      >
        <div
          className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[var(--hl-ink)] shadow-2xl transition-all duration-250 ${
            isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(232,184,75,0.35), transparent 70%)" }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--hl-offer)] to-transparent" />

          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-white/45 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-6 sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--hl-offer)]/35 bg-[var(--hl-offer)]/10 px-3 py-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-[var(--hl-offer)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hl-offer)]">
                Back-to-School Lifetime
              </span>
            </div>

            <h2 className="pr-8 text-2xl font-black tracking-tight text-white">
              Out of credits?{" "}
              <span className="bg-gradient-to-r from-[#F5D78A] via-[#E8B84B] to-[#C8922A] bg-clip-text text-transparent">
                Go lifetime.
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Pay once before school opens. Get 20,000 words every month — forever. No renewals.
            </p>

            {displayPrice && (
              <div className="mt-5 text-center">
                <div className="text-4xl font-black text-white">{displayPrice}</div>
                <div className="mt-1 text-xs text-white/45">one-time · yours for life</div>
              </div>
            )}

            <ul className="mt-5 space-y-2.5">
              {[
                "20,000 words refreshed monthly",
                "Beat Turnitin, GPTZero & more",
                "Every future update included",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white/85">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--hl-offer)]/15">
                    <Check className="h-3 w-3 text-[var(--hl-offer)]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={onClaim}
              disabled={ctaLoading}
              className="group mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black uppercase tracking-wide text-[var(--hl-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg,#F5D78A 0%,#E8B84B 45%,#C8922A 100%)",
              }}
            >
              {ctaLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Claim Lifetime Access
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <button
              onClick={() => {
                handleClose();
                router.push("/pricing");
              }}
              className="mt-3 w-full py-2 text-center text-sm text-white/40 transition-colors hover:text-white/70"
            >
              See all plans
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
