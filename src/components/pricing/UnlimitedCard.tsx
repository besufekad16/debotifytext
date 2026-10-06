"use client";

import { useState } from "react";
import { Loader2, ShieldCheck, Infinity as InfinityIcon, Flame, Zap } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ReferralCodeStep from "~/components/ReferralCodeStep";

interface SpotsData {
  taken: number;
  max: number;
  remaining: number;
  isFull: boolean;
}

interface Props {
  productId: string;
  isTeamMember?: boolean;
  spots?: SpotsData | null;
  compact?: boolean; // compact mode for use inside modals
}

const FEATURES = [
  "Unlimited words for 2 full months",
  "Up to 2,000 words per request",
  "Billed every 2 months — cancel anytime",
  "Priority processing speed",
  "Advanced Humanization Engine",
  "All humanization presets included",
  "All 50+ languages supported",
  "API access for integrations",
  "Dedicated support & onboarding",
  "No daily limits, no caps",
];

export default function UnlimitedCard({ productId, isTeamMember = false, spots, compact = false }: Props) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRefStep, setShowRefStep] = useState(false);

  const isFull = spots?.isFull ?? false;
  const remaining = spots?.remaining ?? 200;
  const taken = spots?.taken ?? 0;
  const max = spots?.max ?? 200;
  const pctFull = Math.min(100, Math.round((taken / max) * 100));
  const isUrgent = pctFull > 70;

  const handleSubscribe = () => {
    if (isFull) return;
    if (!isSignedIn) { router.push("/sign-in"); return; }
    doCheckout();
  };

  const doCheckout = async () => {
    try {
      setLoading(true);
      setShowRefStep(false);
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Failed to create checkout");
      }
      const { checkoutUrl } = await res.json() as { checkoutUrl: string };
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("[UnlimitedCard] Checkout error:", error);
      alert(error instanceof Error ? error.message : "Failed to create checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {showRefStep && (
        <ReferralCodeStep
          onProceed={doCheckout}
          onCancel={() => setShowRefStep(false)}
          isLoading={loading}
        />
      )}

      <style>{`
        @keyframes shimmer-u {
          0%   { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(500%) skewX(-12deg); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow:
              0 0 30px rgba(212,168,85,0.5),
              0 0 60px rgba(139,111,71,0.3),
              0 20px 60px rgba(0,0,0,0.5),
              inset 0 1px 0 rgba(255,255,255,0.15);
          }
          50% {
            box-shadow:
              0 0 60px rgba(212,168,85,0.8),
              0 0 120px rgba(139,111,71,0.5),
              0 20px 80px rgba(0,0,0,0.6),
              inset 0 1px 0 rgba(255,255,255,0.2);
          }
        }
        @keyframes orb-a {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(15px,-12px) scale(1.08); }
        }
        @keyframes orb-b {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(-12px,10px) scale(1.06); }
        }
      `}</style>

      <div className={compact ? "w-full" : "mx-auto max-w-6xl w-full px-2 sm:px-0"}>
        {/* Outer wrapper — adds top margin for the badge */}
        <div className="relative mt-6 pt-5">

          {/* Badge — centered above card */}
          <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-gradient-to-r from-[#C8922A] via-[#E8B84B] to-[#C8922A] px-4 py-1.5 rounded-sm shadow-xl border border-[#F5D78A]/40 whitespace-nowrap">
            <Flame className="h-3 w-3 text-[#3b1f0e]" />
            <span className="text-[10px] sm:text-xs font-bold text-[#3b1f0e] uppercase tracking-widest">
              Limited — {remaining} of {max} spots left
            </span>
          </div>

          {/* Card */}
          <div
            className="relative overflow-hidden rounded-2xl border-2 w-full"
            style={{
              background: 'linear-gradient(145deg, #2a1a06 0%, #3d2508 35%, #2e1c07 65%, #1e1204 100%)',
              borderColor: 'rgba(212,168,85,0.65)',
              animation: 'glow-pulse 3.5s ease-in-out infinite',
            }}
          >
            {/* Glass top sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D78A]/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.07] to-transparent" />

            {/* Diagonal glass reflection */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#D4A855]/10 via-transparent to-green-700/15" />

            {/* Shimmer sweep */}
            <div
              className="pointer-events-none absolute inset-y-0 w-20 sm:w-32 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
              style={{ animation: 'shimmer-u 6s ease-in-out infinite' }}
            />

            {/* Ambient orbs */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212,168,85,0.25) 0%, transparent 70%)',
                animation: 'orb-a 9s ease-in-out infinite',
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 w-56 h-56 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139,111,71,0.2) 0%, transparent 70%)',
                animation: 'orb-b 11s ease-in-out infinite',
              }}
            />

            {/* Bottom border glow */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4A855]/40 to-transparent" />

            {/* ── Content ── */}
            <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">

              {/* Top row: icon + name + price */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">

                {/* Left: identity */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#D4A855]/50 bg-[#D4A855]/10">
                      <InfinityIcon className="h-5 w-5 text-[#E8C870]" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                        Unlimited
                      </h3>
                      <p className="text-[#D4A855] text-xs font-semibold uppercase tracking-widest mt-0.5">
                        2-Month Access
                      </p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm max-w-md leading-relaxed">
                    Billed every 2 months. Unlimited humanization — no word caps, no daily limits. Cancel anytime.
                  </p>
                </div>

                {/* Right: price */}
                <div className="sm:text-right flex-shrink-0">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-5xl sm:text-6xl font-black text-white leading-none">$100</span>
                  </div>
                  <p className="text-white/50 text-xs mt-1">billed every 2 months · cancel anytime</p>
                  <p className="text-[#D4A855] text-xs font-medium mt-0.5">Unlimited access for 2 months per cycle</p>
                </div>
              </div>

              {/* Spots progress */}
              <div className="mb-8 p-4 rounded-xl bg-white/[0.05] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/70 font-medium flex items-center gap-1.5">
                    <Flame className={`h-3.5 w-3.5 ${isUrgent ? 'text-orange-400' : 'text-[#D4A855]'}`} />
                    {taken} of {max} spots claimed
                  </span>
                  <span className={`text-xs font-bold ${isUrgent ? 'text-orange-400' : 'text-[#D4A855]'}`}>
                    {remaining} remaining
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pctFull}%`,
                      background: isUrgent
                        ? 'linear-gradient(90deg, #f97316, #ef4444)'
                        : 'linear-gradient(90deg, #C8922A, #E8B84B, #F5D78A)',
                    }}
                  />
                </div>
                {isUrgent && (
                  <p className="text-[11px] text-orange-300 mt-1.5 font-semibold">
                    Filling fast — only {remaining} spots left
                  </p>
                )}
              </div>

              {/* Features + CTA — side by side on desktop */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">

                {/* Features grid */}
                <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {FEATURES.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                      <ShieldCheck className="h-4 w-4 text-[#D4A855] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA block */}
                <div className="lg:min-w-[220px] flex flex-col gap-3">
                  {isTeamMember ? (
                    <button
                      disabled
                      className="w-full py-4 rounded-xl bg-white/10 text-white/40 text-sm font-semibold cursor-not-allowed"
                    >
                      Managed by Team Owner
                    </button>
                  ) : isFull ? (
                    <button
                      disabled
                      className="w-full py-4 rounded-xl bg-white/10 text-white/40 text-sm font-semibold cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      disabled={loading}
                      className="w-full py-4 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #E8B84B 0%, #C8922A 50%, #A87020 100%)',
                        color: '#1a0e00',
                        boxShadow: '0 4px 20px rgba(212,168,85,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                      }}
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                      ) : (
                        <><Zap className="h-4 w-4" /> Get Unlimited — $100</>
                      )}
                    </button>
                  )}
                  <p className="text-center text-[11px] text-white/40">
                    No hidden fees · Cancel anytime · Billed every 2 months
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
