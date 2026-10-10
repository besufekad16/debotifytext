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
        className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 ${
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
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(21,128,61,0.15), transparent 70%)" }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-600/50 to-transparent" />

          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-6 sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-700/20 bg-green-700/10 px-3 py-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-green-700 dark:text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-green-800 dark:text-green-400">
                Back-to-School · Lifetime
              </span>
            </div>

            <h2 className="pr-8 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Wait — lock in lifetime before semester starts
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Pay once. Get 20,000 words every month forever. No subscription. No renewals.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              {[
                "20,000 words / month for life",
                "Built for Turnitin & GPTZero",
                "30-day money-back guarantee",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-700/15">
                    <Check className="h-3.5 w-3.5 text-green-700 dark:text-green-500" />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleCTA}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#15803D] px-6 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-green-700/20 transition-all hover:scale-[1.02] hover:bg-green-800 hover:shadow-green-700/30 active:scale-[0.98]"
              >
                Claim Lifetime Access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleClose}
                className="w-full rounded-xl px-6 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800/50 dark:hover:text-slate-300"
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
