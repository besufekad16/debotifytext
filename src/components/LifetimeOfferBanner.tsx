"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  Feather,
  Zap,
} from "lucide-react";

const DEADLINE_KEY = "lifetime_school_deadline_v1";
const BASE_SPOTS_TAKEN = 54;
const MAX_SPOTS = 150;

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + 7 * 24 * 60 * 60 * 1000;
  try {
    const stored = localStorage.getItem(DEADLINE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed > Date.now()) return parsed;
      localStorage.removeItem(DEADLINE_KEY);
    }
    const deadline = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(DEADLINE_KEY, String(deadline));
    return deadline;
  } catch {
    return Date.now() + 7 * 24 * 60 * 60 * 1000;
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Full-bleed homepage lifetime offer - Back-to-School urgency with countdown.
 */
export default function LifetimeOfferBanner() {
  const [timeLeft, setTimeLeft] = useState({ d: "07", h: "00", m: "00", s: "00" });
  const [spotsTaken, setSpotsTaken] = useState(BASE_SPOTS_TAKEN);
  const [displayPrice, setDisplayPrice] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: "00", h: "00", m: "00", s: "00" });
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      setTimeLeft({
        d: pad(Math.floor(totalSec / 86400)),
        h: pad(Math.floor((totalSec % 86400) / 3600)),
        m: pad(Math.floor((totalSec % 3600) / 60)),
        s: pad(totalSec % 60),
      });
    };
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    fetch("/api/polar/lifetime")
      .then((r) => r.json())
      .then((d: { displayPrice?: string | null; claimedCount?: number }) => {
        if (d.displayPrice) setDisplayPrice(d.displayPrice);
        if (typeof d.claimedCount === "number" && d.claimedCount > 0) {
          setSpotsTaken(Math.min(MAX_SPOTS, BASE_SPOTS_TAKEN + d.claimedCount));
        }
      })
      .catch(() => {});
  }, []);

  const remaining = Math.max(0, MAX_SPOTS - spotsTaken);
  const pctFull = Math.min(100, Math.round((spotsTaken / MAX_SPOTS) * 100));

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-24">
      {/* Immersive Deep Green Animated Background */}
      <div className="absolute inset-0 bg-green-950" />
      
      {/* Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '3rem 3rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)'
        }} 
      />

      {/* Floating Animated Orbs */}
      <div
        className="pointer-events-none absolute -left-24 -top-32 h-[32rem] w-[32rem] animate-pulse rounded-full opacity-40 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(74,222,128,0.5), transparent 70%)", animationDuration: '4s' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-1/4 h-[28rem] w-[28rem] animate-pulse rounded-full opacity-30 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.6), transparent 70%)", animationDuration: '5s' }}
      />
      <div
        className="pointer-events-none absolute top-1/4 -right-32 h-[40rem] w-[40rem] animate-pulse rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)", animationDuration: '7s' }}
      />

      {/* Diagonal Light Sweep */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "offerShine 6s linear infinite",
        }}
      />
      
      {/* Ambient Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(2,44,34,1)] pointer-events-none" />

      {/* Subtle top/bottom borders */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2">
              <GraduationCap className="h-4 w-4 text-green-300" />
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-green-300">
                Back-to-School Lifetime Deal
              </span>
              <Feather className="h-3.5 w-3.5 text-green-300/80" />
            </div>

            <h2 className="font-heading text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              School is opening.
              <span className="mt-2 block bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent">
                Your humanizer is forever.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-green-50 sm:text-lg lg:mx-0 opacity-80">
              One payment before the semester starts. Get{" "}
              <strong className="font-semibold text-white">20,000 words every month for life</strong>
              {" "}
              - no subscription, no renewals, no surprises.
            </p>

            <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2 lg:mx-0">
              {[
                "20,000 words / month, forever",
                "Up to 2,000 words per request",
                "Built to beat Turnitin and GPTZero",
                "Every future update included",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-green-100/90">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-400/20">
                    <Check className="h-3 w-3 text-green-400" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-green-400/20 bg-green-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-400/10 blur-3xl" />

            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-300/70">
                One-time payment
              </p>
              <div className="mt-2 text-5xl font-black tracking-tight text-white sm:text-6xl">
                {displayPrice ?? "Pay Once"}
              </div>
              <p className="mt-2 text-[13px] font-medium text-green-200/60">
                lifetime access - 20k words refreshed monthly
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-green-100/80">
                  <BookOpen className="h-3.5 w-3.5 text-green-400" />
                  {spotsTaken} of {MAX_SPOTS} spots claimed
                </span>
                <span className="font-bold text-green-400">{remaining} left</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-green-950/50 border border-green-800/30">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${pctFull}%`,
                    background:
                      pctFull > 85
                        ? "linear-gradient(90deg, #22c55e, #f87171)"
                        : "linear-gradient(90deg, #166534, #22c55e, #86efac)",
                  }}
                />
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-green-300/50">
                Back-to-school pricing ends in
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { val: timeLeft.d, label: "Days" },
                  { val: timeLeft.h, label: "Hours" },
                  { val: timeLeft.m, label: "Mins" },
                  { val: timeLeft.s, label: "Secs" },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="rounded-xl border border-green-500/20 bg-green-950/40 px-2 py-3 text-center backdrop-blur-sm"
                  >
                    <div className="font-mono text-2xl font-black tabular-nums text-white sm:text-3xl">
                      {unit.val}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-green-400/60">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/pricing#lifetime"
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-[15px] font-black uppercase tracking-wide text-green-950 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              style={{
                background: "linear-gradient(135deg, #bbf7d0 0%, #4ade80 50%, #22c55e 100%)",
              }}
            >
              <Zap className="h-5 w-5 fill-green-950" />
              {displayPrice ? `Lock Lifetime before school — ${displayPrice}` : "Lock Lifetime before school opens"}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="mt-5 text-center text-[11px] font-medium text-green-100/40">
              30-day money-back · Instant access · Never billed again
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}