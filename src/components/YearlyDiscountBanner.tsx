"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Flame, Clock } from "lucide-react";
import Link from "next/link";

function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + 7 * 24 * 60 * 60 * 1000;
  try {
    const KEY = "banner_deadline_v3";
    const stored = localStorage.getItem(KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed > Date.now()) return parsed;
      localStorage.removeItem(KEY);
    }
    const deadline = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(KEY, String(deadline));
    return deadline;
  } catch {
    return Date.now() + 7 * 24 * 60 * 60 * 1000;
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function YearlyDiscountBanner() {
  const [timeLeft, setTimeLeft] = useState({ d: "07", h: "00", m: "00", s: "00" });
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
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setTimeLeft({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) });
    };

    tick(); // run immediately so display is correct on mount
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="w-full">
      <style>{`
        @keyframes sweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.7; }
          50% { opacity: 1; }
          55% { opacity: 0.8; }
        }
        @keyframes heartbeat-glow {
          0%   { text-shadow: 0 0 8px rgba(168,85,247,0.6), 0 0 20px rgba(168,85,247,0.3); transform: scale(1); }
          14%  { text-shadow: 0 0 16px rgba(168,85,247,0.9), 0 0 40px rgba(168,85,247,0.6), 0 0 60px rgba(168,85,247,0.3); transform: scale(1.08); }
          28%  { text-shadow: 0 0 8px rgba(168,85,247,0.6), 0 0 20px rgba(168,85,247,0.3); transform: scale(1); }
          42%  { text-shadow: 0 0 14px rgba(168,85,247,0.85), 0 0 35px rgba(168,85,247,0.55), 0 0 55px rgba(168,85,247,0.25); transform: scale(1.05); }
          70%  { text-shadow: 0 0 8px rgba(168,85,247,0.6), 0 0 20px rgba(168,85,247,0.3); transform: scale(1); }
          100% { text-shadow: 0 0 8px rgba(168,85,247,0.6), 0 0 20px rgba(168,85,247,0.3); transform: scale(1); }
        }
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(168,85,247,0); }
        }
        @keyframes tick-pop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #0a0718 0%, #130d2e 25%, #1e1545 50%, #130d2e 75%, #0a0718 100%)",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        {/* Glass shimmer sweep */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 48%, rgba(139,92,246,0.08) 50%, rgba(255,255,255,0.04) 52%, transparent 70%)",
            backgroundSize: "300% 100%",
            animation: "sweep 5s ease-in-out infinite",
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #7c3aed 20%, #a855f7 50%, #f59e0b 80%, transparent)" }}
        />

        <Link
          href="/pricing"
          className="group relative flex w-full items-center justify-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          aria-label="50% off yearly plans — limited time offer"
        >
          {/* Flame badge */}
          <span
            className="hidden md:flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 flex-shrink-0 backdrop-blur-sm"
            style={{ animation: "badge-pulse 2s ease-in-out infinite" }}
          >
            <Flame className="h-3.5 w-3.5 text-amber-400" style={{ animation: "flicker 2.4s ease-in-out infinite" }} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">500K Users</span>
          </span>

          <span className="hidden md:block h-4 w-px bg-white/10 flex-shrink-0" />

          {/* Main message */}
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-sm font-medium leading-tight text-white/90">
            <span className="font-medium text-white/80">Celebrating 500K users —</span>
            <span
              className="font-black text-base sm:text-lg tracking-tight inline-block"
              style={{
                background: "linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "heartbeat-glow 1.6s ease-in-out infinite",
                filter: "drop-shadow(0 0 8px rgba(168,85,247,0.7))",
              }}
            >
              50% OFF Yearly Plans
            </span>
            <span className="hidden sm:inline text-white/40">·</span>
            <span className="hidden sm:inline text-white/60 text-xs font-medium">Save up to $120/yr</span>
          </p>

          <span className="hidden sm:block h-4 w-px bg-white/10 flex-shrink-0" />

          {/* Countdown */}
          <span className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            <Clock className="h-3.5 w-3.5 text-white/40" />
            <span className="text-[10px] text-white/50 font-medium">Ends in</span>
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
                    style={{
                      minWidth: "1.8rem",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {unit.val}
                  </span>
                  <span className="text-[8px] text-white/30 font-medium mt-0.5 leading-none">{unit.label}</span>
                </span>
                {i < 3 && <span className="text-white/30 text-xs font-bold mb-2">:</span>}
              </span>
            ))}
          </span>

          {/* CTA button — desktop */}
          <span
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white flex-shrink-0 transition-all duration-200 group-hover:gap-2.5"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              boxShadow: "0 0 12px rgba(139,92,246,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            Claim 50% Off
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>

          {/* CTA — mobile */}
          <span className="sm:hidden inline-flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white flex-shrink-0">
            50% OFF →
          </span>
        </Link>
      </div>
    </div>
  );
}
