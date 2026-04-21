"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Flame, Clock, Infinity as InfinityIcon } from "lucide-react";
import Link from "next/link";

const DEADLINE_KEY = "banner_deadline_v5";
const BASE_SPOTS_TAKEN = 67;
const MAX_SPOTS = 200;

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

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function YearlyDiscountBanner() {
  const [timeLeft, setTimeLeft] = useState({ d: "07", h: "00", m: "00", s: "00" });
  const [spotsTaken, setSpotsTaken] = useState(BASE_SPOTS_TAKEN);
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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Fetch real spots count
  useEffect(() => {
    fetch("/api/polar/unlimited-spots")
      .then(r => r.json())
      .then((d: { taken?: number }) => { if (d.taken) setSpotsTaken(d.taken); })
      .catch(() => {});
  }, []);

  const remaining = Math.max(0, MAX_SPOTS - spotsTaken);

  return (
    <div className="w-full">
      <style>{`
        @keyframes sweep { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
        @keyframes flicker { 0%,100%{opacity:1} 45%{opacity:.65} 50%{opacity:1} 55%{opacity:.75} }
        @keyframes heartbeat-nav {
          0%,100%{filter:drop-shadow(0 0 4px rgba(212,168,85,.5)) drop-shadow(0 0 12px rgba(212,168,85,.2));transform:scale(1)}
          14%{filter:drop-shadow(0 0 14px rgba(212,168,85,1)) drop-shadow(0 0 30px rgba(212,168,85,.7));transform:scale(1.08)}
          28%{filter:drop-shadow(0 0 4px rgba(212,168,85,.5));transform:scale(1)}
          42%{filter:drop-shadow(0 0 10px rgba(212,168,85,.9)) drop-shadow(0 0 24px rgba(212,168,85,.6));transform:scale(1.05)}
          70%,100%{filter:drop-shadow(0 0 4px rgba(212,168,85,.5));transform:scale(1)}
        }
        @keyframes badge-ring { 0%,100%{box-shadow:0 0 0 0 rgba(212,168,85,.5)} 50%{box-shadow:0 0 0 6px rgba(212,168,85,0)} }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #1a0e02 0%, #2d1a05 30%, #1a0e02 100%)",
          borderBottom: "1px solid rgba(212,168,85,0.25)",
        }}
      >
        {/* Sweep */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: "linear-gradient(105deg,transparent 30%,rgba(212,168,85,.06) 50%,transparent 70%)",
          backgroundSize: "300% 100%", animation: "sweep 5s ease-in-out infinite",
        }} />
        {/* Top line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
          background: "linear-gradient(90deg,transparent,#C8922A 20%,#E8B84B 50%,#C8922A 80%,transparent)",
        }} />

        <Link
          href="/pricing"
          className="group relative flex w-full items-center justify-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Unlimited 2-Month Plan — 133 spots left"
        >
          {/* Flame badge */}
          <span
            className="hidden md:flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 flex-shrink-0"
            style={{ animation: "badge-ring 2.5s ease-in-out infinite" }}
          >
            <Flame className="h-3.5 w-3.5 text-amber-400" style={{ animation: "flicker 2.4s ease-in-out infinite" }} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
              {remaining} spots left
            </span>
          </span>

          <span className="hidden md:block h-4 w-px bg-white/10 flex-shrink-0" />

          {/* Main message */}
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-sm font-medium leading-tight text-white/90">
            <InfinityIcon className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span className="font-medium text-white/80">Unlimited Words for 2 Months —</span>
            <span
              className="font-black text-base sm:text-lg tracking-tight inline-block"
              style={{
                background: "linear-gradient(135deg,#F5D78A,#E8B84B,#C8922A)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                animation: "heartbeat-nav 1.6s ease-in-out infinite",
              }}
            >
              Only $100
            </span>
            <span className="hidden sm:inline text-white/40">·</span>
            <span className="hidden sm:inline text-white/60 text-xs font-medium">Billed every 2 months · Cancel anytime</span>
          </p>

          <span className="hidden sm:block h-4 w-px bg-white/10 flex-shrink-0" />

          {/* Countdown */}
          <span className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            <Clock className="h-3.5 w-3.5 text-white/40" />
            <span className="text-[10px] text-white/50 font-medium">Offer ends in</span>
            {[
              { val: timeLeft.d, label: "d" },
              { val: timeLeft.h, label: "h" },
              { val: timeLeft.m, label: "m" },
              { val: timeLeft.s, label: "s" },
            ].map((unit, i) => (
              <span key={i} className="flex items-center gap-0.5">
                <span className="flex flex-col items-center">
                  <span
                    className="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white"
                    style={{ minWidth: "1.8rem", background: "rgba(212,168,85,0.12)", border: "1px solid rgba(212,168,85,0.2)" }}
                  >
                    {unit.val}
                  </span>
                  <span className="text-[8px] text-white/30 font-medium mt-0.5 leading-none">{unit.label}</span>
                </span>
                {i < 3 && <span className="text-white/30 text-xs font-bold mb-2">:</span>}
              </span>
            ))}
          </span>

          {/* CTA — desktop */}
          <span
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-[#1a0e00] flex-shrink-0 transition-all duration-200 group-hover:gap-2.5"
            style={{
              background: "linear-gradient(135deg,#E8B84B 0%,#C8922A 100%)",
              boxShadow: "0 0 12px rgba(212,168,85,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            Claim Your Spot
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>

          {/* CTA — mobile */}
          <span className="sm:hidden inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-[#1a0e00] flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#E8B84B,#C8922A)" }}>
            Get It →
          </span>
        </Link>
      </div>
    </div>
  );
}
