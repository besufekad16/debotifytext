"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, Flame, Zap } from "lucide-react";

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
    <div className="relative w-full overflow-hidden bg-green-950 border-b border-green-900/50">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background: "linear-gradient(105deg, transparent 35%, rgba(74,222,128,0.15) 50%, transparent 65%)",
          backgroundSize: "240% 100%",
          animation: "offerShine 4.5s linear infinite",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50" />

      <Link
        href="/pricing#lifetime"
        className="group relative flex w-full items-center justify-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        aria-label="Back-to-School Lifetime Deal - pay once, humanize forever"
      >
        <span className="flex items-center gap-1.5 rounded-full border border-green-400/40 bg-green-400/10 px-2.5 py-1 sm:hidden shadow-[inset_0_0_10px_rgba(74,222,128,0.1)]">
          <Zap className="h-3 w-3 text-green-400 fill-green-400" />
          <span className="text-[10px] font-black uppercase tracking-wider text-green-400">
            School Offer
          </span>
        </span>

        <span className="hidden items-center gap-1.5 rounded-full border border-green-400/40 bg-green-400/10 px-3 py-1 md:inline-flex shadow-[inset_0_0_10px_rgba(74,222,128,0.1)]">
          <GraduationCap className="h-3.5 w-3.5 text-green-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.14em] text-green-400">
            Back to School - Lifetime
          </span>
        </span>

        <p className="flex min-w-0 flex-wrap items-center justify-center gap-x-1.5 text-center text-[11.5px] font-medium leading-tight text-green-50 sm:text-[13.5px]">
          <span className="truncate sm:whitespace-normal">School opens soon — lock Lifetime now</span>
          {displayPrice && (
            <span className="font-bold text-green-300">{displayPrice} once</span>
          )}
          <span className="hidden text-green-800 sm:inline">·</span>
          <span className="hidden text-green-100/60 sm:inline">20k words/mo forever</span>
        </p>

        <span className="hidden items-center gap-1 sm:inline-flex">
          <Clock className="h-3.5 w-3.5 text-green-400/60" />
          {[timeLeft.d, timeLeft.h, timeLeft.m, timeLeft.s].map((val, i) => (
            <span key={i} className="inline-flex items-center gap-0.5">
              <span className="rounded-md border border-green-400/30 bg-green-400/10 px-1.5 py-0.5 font-mono text-[11px] font-bold tabular-nums text-green-300">
                {val}
              </span>
              {i < 3 && <span className="text-green-800">:</span>}
            </span>
          ))}
        </span>

        <span className="inline-flex items-center gap-0.5 font-mono text-[10px] font-bold tabular-nums text-green-400 sm:hidden">
          {timeLeft.d}d {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
        </span>

        <span
          className="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-green-950 transition-all group-hover:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-xs shadow-[0_0_15px_rgba(74,222,128,0.3)]"
          style={{
            background: "linear-gradient(135deg, #bbf7d0, #4ade80, #22c55e)",
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