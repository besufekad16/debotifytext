"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, Flame } from "lucide-react";

const DEADLINE_KEY = "lifetime_school_deadline_v1";

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
 * Sticky promo strip above the navbar - Back-to-School Lifetime Deal.
 */
export default function LifetimeOfferBar() {
  const [timeLeft, setTimeLeft] = useState({ d: "07", h: "00", m: "00", s: "00" });
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
      .then((d: { displayPrice?: string | null }) => {
        if (d.displayPrice) setDisplayPrice(d.displayPrice);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[var(--hl-ink)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "linear-gradient(105deg, transparent 35%, rgba(232,184,75,0.14) 50%, transparent 65%)",
          backgroundSize: "240% 100%",
          animation: "offerShine 4.5s linear infinite",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--hl-offer)] to-transparent" />

      <Link
        href="/pricing#lifetime"
        className="group relative flex w-full items-center justify-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hl-offer)]"
        aria-label="Back-to-School Lifetime Deal - pay once, humanize forever"
      >
        <span className="flex items-center gap-1.5 rounded-full border border-[var(--hl-offer)]/40 bg-[var(--hl-offer)]/10 px-2.5 py-1 sm:hidden">
          <Flame className="h-3 w-3 text-[var(--hl-offer)]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--hl-offer)]">
            School Offer
          </span>
        </span>

        <span className="hidden items-center gap-1.5 rounded-full border border-[var(--hl-offer)]/40 bg-[var(--hl-offer)]/10 px-3 py-1 md:inline-flex">
          <GraduationCap className="h-3.5 w-3.5 text-[var(--hl-offer)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--hl-offer)]">
            Back to School - Lifetime
          </span>
        </span>

        <p className="flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 text-center text-[11px] font-semibold leading-tight text-white/90 sm:text-sm">
          <span className="truncate sm:whitespace-normal">School opens soon — lock Lifetime now</span>
          {displayPrice && (
            <span className="font-black text-[var(--hl-offer)]">{displayPrice} once</span>
          )}
          <span className="hidden text-white/45 sm:inline">·</span>
          <span className="hidden text-white/65 sm:inline">20k words/mo forever</span>
        </p>

        <span className="hidden items-center gap-1 sm:inline-flex">
          <Clock className="h-3.5 w-3.5 text-white/40" />
          {[timeLeft.d, timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
            <span key={i} className="inline-flex items-center gap-0.5">
              <span className="rounded-md border border-[var(--hl-offer)]/25 bg-[var(--hl-offer)]/10 px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums text-white">
                {val}
              </span>
              {i < 3 && <span className="text-white/30">:</span>}
            </span>
          ))}
        </span>

        <span className="inline-flex items-center gap-0.5 font-mono text-[10px] font-bold tabular-nums text-[var(--hl-offer)] sm:hidden">
          {timeLeft.d}d {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
        </span>

        <span
          className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--hl-ink)] transition-all group-hover:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-xs"
          style={{
            background: "linear-gradient(135deg, #F5D78A, #E8B84B, #C8922A)",
            animation: "offerPulse 2.2s ease-in-out infinite",
          }}
        >
          Grab deal
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
}