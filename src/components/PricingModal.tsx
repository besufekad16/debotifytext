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
    doCheckout();
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
        className={`fixed inset-0 z-[300] flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-md transition-all duration-300 sm:items-center ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      >
        <div
          className={`relative w-full max-w-[420px] max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-green-400/20 bg-green-950 shadow-[0_30px_100px_-15px_rgba(34,197,94,0.25)] transition-all duration-300 cubic-bezier(0.16,1,0.3,1) ${
            isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-400/20 blur-[80px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-green-500/10 blur-[80px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />

          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-green-100/40 transition-all hover:bg-green-400/10 hover:text-green-300"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div className="relative p-7 sm:p-9">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3.5 py-1.5 shadow-[inset_0_0_10px_rgba(74,222,128,0.1)]">
              <GraduationCap className="h-3.5 w-3.5 text-green-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-green-300">
                Back-to-School Lifetime
              </span>
            </div>

            <h2 className="pr-8 text-3xl font-black tracking-tight text-white leading-[1.1]">
              Out of credits?<br/>
              <span className="bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent">
                Go lifetime.
              </span>
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-green-100/60 font-medium">
              Pay once before school opens. Get 20,000 words every month — forever. No renewals.
            </p>

            {displayPrice && (
              <div className="mt-6 text-center bg-green-900/30 rounded-2xl border border-green-800/30 py-4">
                <div className="text-[40px] font-black text-white leading-none tracking-tight">{displayPrice}</div>
                <div className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-green-300/50">one-time · yours for life</div>
              </div>
            )}

            <ul className="mt-6 space-y-3">
              {[
                "20,000 words refreshed monthly",
                "Beat Turnitin, GPTZero & more",
                "Every future update included",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14.5px] font-medium text-green-50/90">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-400/20">
                    <Check className="h-3 w-3 text-green-400" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={onClaim}
              disabled={ctaLoading}
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[15px] font-black uppercase tracking-wide text-green-950 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              style={{
                background: "linear-gradient(135deg, #bbf7d0 0%, #4ade80 50%, #22c55e 100%)",
              }}
            >
              {ctaLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Claim Lifetime Access
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <button
              onClick={() => {
                handleClose();
                router.push("/pricing");
              }}
              className="mt-4 w-full py-2 text-center text-[13px] font-medium text-green-100/40 transition-colors hover:text-green-300"
            >
              See all plans
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
