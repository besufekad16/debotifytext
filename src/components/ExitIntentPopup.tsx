"use client";

import { useState, useEffect } from "react";
import { X, Check, GraduationCap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const EXIT_INTENT_SHOWN_KEY = "exit_intent_shown_v2_lifetime";
const EXIT_INTENT_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

export default function ExitIntentPopup() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const checkCooldown = () => {
      try {
        const lastShown = localStorage.getItem(EXIT_INTENT_SHOWN_KEY);
        if (lastShown) {
          const timeSince = Date.now() - parseInt(lastShown, 10);
          if (timeSince < EXIT_INTENT_COOLDOWN) {
            setHasShown(true);
            return true;
          }
        }
        return false;
      } catch {
        return false;
      }
    };

    if (checkCooldown()) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && !isVisible) {
        setIsVisible(true);
        setHasShown(true);
        try {
          localStorage.setItem(EXIT_INTENT_SHOWN_KEY, Date.now().toString());
        } catch {
          // Ignore storage errors
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown, isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 200);
  };

  const handleCTA = () => {
    handleClose();
    router.push("/pricing#lifetime");
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-[var(--hl-ink)]/55 backdrop-blur-[2px] transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed inset-x-4 bottom-4 z-50 w-auto transition-all duration-200 sm:inset-x-0 sm:top-1/2 sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 ${
          isClosing
            ? "translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            : "translate-y-0 opacity-100 sm:scale-100"
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--hl-ink)] shadow-2xl">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(232,184,75,0.35), transparent 70%)" }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--hl-offer)] to-transparent" />

          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-6 sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--hl-offer)]/35 bg-[var(--hl-offer)]/10 px-3 py-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-[var(--hl-offer)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hl-offer)]">
                Back-to-School · Lifetime
              </span>
            </div>

            <h2 className="pr-8 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Wait — lock in lifetime before semester starts
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">
              Pay once. Get 20,000 words every month forever. No subscription. No renewals.
            </p>

            <div className="mt-5 space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              {[
                "20,000 words / month for life",
                "Built for Turnitin & GPTZero",
                "30-day money-back guarantee",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-white/85">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--hl-offer)]/15">
                    <Check className="h-3 w-3 text-[var(--hl-offer)]" />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleCTA}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black uppercase tracking-wide text-[var(--hl-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#F5D78A 0%,#E8B84B 45%,#C8922A 100%)",
                }}
              >
                Claim Lifetime Access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={handleClose}
                className="w-full px-6 py-2 text-sm text-white/40 transition-colors hover:text-white/70"
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
