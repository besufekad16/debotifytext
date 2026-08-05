"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  Sparkles,
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
      <div className="absolute inset-0 bg-[var(--hl-ink)]" />
      <div
        className="pointer-events-none absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,184,75,0.35), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-[24rem] w-[24rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(166,124,82,0.35), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(232,184,75,0.08) 50%, transparent 60%)",
          backgroundSize: "220% 100%",
          animation: "offerShine 6s linear infinite",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--hl-offer)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--hl-mint-bright)]/50 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--hl-offer)]/35 bg-[var(--hl-offer)]/10 px-4 py-2">
              <GraduationCap className="h-4 w-4 text-[var(--hl-offer)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--hl-offer)]">
                Back-to-School Lifetime Deal
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[var(--hl-offer)]/80" />
            </div>

            <h2 className="font-heading text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              School is opening.
              <span className="mt-2 block bg-gradient-to-r from-[#F5D78A] via-[#E8B84B] to-[#C8922A] bg-clip-text text-transparent">
                Your humanizer is forever.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg lg:mx-0">
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
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--hl-offer)]/15">
                    <Check className="h-3 w-3 text-[var(--hl-offer)]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--hl-offer)]/20 blur-2xl" />

            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                One-time payment
              </p>
              <div className="mt-2 text-5xl font-black tracking-tight text-white sm:text-6xl">
                {displayPrice ?? "Pay Once"}
              </div>
              <p className="mt-2 text-sm text-white/55">
                lifetime access - 20k words refreshed monthly
              </p>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-white/60">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--hl-offer)]" />
                  {spotsTaken} of {MAX_SPOTS} spots claimed
                </span>
                <span className="font-bold text-[var(--hl-offer)]">{remaining} left</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pctFull}%`,
                    background:
                      pctFull > 70
                        ? "linear-gradient(90deg,#f97316,#ef4444)"
                        : "linear-gradient(90deg,#C8922A,#E8B84B,#F5D78A)",
                  }}
                />
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Back-to-school pricing ends in
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: timeLeft.d, label: "Days" },
                  { val: timeLeft.h, label: "Hours" },
                  { val: timeLeft.m, label: "Mins" },
                  { val: timeLeft.s, label: "Secs" },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="rounded-2xl border border-white/10 bg-black/30 px-2 py-3 text-center"
                  >
                    <div className="font-mono text-2xl font-black tabular-nums text-white sm:text-3xl">
                      {unit.val}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/pricing#lifetime"
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-wide text-[var(--hl-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-base"
              style={{
                background: "linear-gradient(135deg,#F5D78A 0%,#E8B84B 45%,#C8922A 100%)",
                animation: "offerPulse 2.4s ease-in-out infinite",
              }}
            >
              <Zap className="h-5 w-5" />
              {displayPrice ? `Lock Lifetime before school — ${displayPrice}` : "Lock Lifetime before school opens"}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="mt-4 text-center text-xs text-white/35">
              30-day money-back · Instant access · Never billed again
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}