"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Flame, Clock } from "lucide-react";
import Link from "next/link";

// Countdown: 7 days from first visit, stored in localStorage
function getDeadline(): number {
  if (typeof window === "undefined") return Date.now() + 7 * 24 * 60 * 60 * 1000;
  try {
    const stored = localStorage.getItem("banner_deadline_v2");
    if (stored) return parseInt(stored, 10);
    const deadline = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem("banner_deadline_v2", String(deadline));
    return deadline;
  } catch {
    return Date.now() + 7 * 24 * 60 * 60 * 1000;
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function YearlyDiscountBanner() {
  const [timeLeft, setTimeLeft] = useState({ d: "06", h: "23", m: "59", s: "59" });

  useEffect(() => {
    const deadline = getDeadline();

    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: "00", m: "00", s: "00" });
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setTimeLeft({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, #0f0c29 0%, #1a1040 30%, #24243e 60%, #0f0c29 100%)",
        }}
      >
      {/* Animated gradient sweep */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 35%, rgba(139,92,246,0.12) 50%, transparent 65%)",
          backgroundSize: "250% 100%",
          animation: "sweep 4s ease-in-out infinite",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, #7c3aed, #f59e0b, #8B6F47, #7c3aed)",
        }}
      />

      <style>{`
        @keyframes sweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45%       { opacity: 0.75; }
          50%       { opacity: 1; }
          55%       { opacity: 0.8; }
        }
        @keyframes tick-pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
      `}</style>

      <Link
        href="/pricing"
        className="group flex w-full items-center justify-center gap-2 sm:gap-3 px-4 sm:px-12 py-3 sm:py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        aria-label="500k celebration — 50% off yearly plans"
      >
        {/* Milestone badge */}
        <span className="hidden md:flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 flex-shrink-0">
          <Flame
            className="h-3 w-3 text-amber-400"
            style={{ animation: "flicker 2.4s ease-in-out infinite" }}
            aria-hidden="true"
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
            500K Users
          </span>
        </span>

        <span className="hidden md:block h-3.5 w-px bg-white/15 flex-shrink-0" />

        {/* Main message */}
        <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center text-[11px] sm:text-sm font-medium leading-tight text-white/90">
          <span className="font-semibold text-white">We&apos;re celebrating with</span>
          <span
            className="rounded px-1.5 py-0.5 text-xs sm:text-sm font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              boxShadow: "0 0 12px rgba(139,92,246,0.5)",
            }}
          >
            50% OFF
          </span>
          <span className="font-semibold text-white">all Yearly plans</span>
          <span className="hidden sm:inline text-white/50">·</span>
          <span className="hidden sm:inline text-white/70 text-xs">
            Save up to $120/yr
          </span>
        </p>

        <span className="hidden sm:block h-3.5 w-px bg-white/15 flex-shrink-0" />

        <span className="hidden sm:flex items-center gap-1 flex-shrink-0">
          <Clock className="h-3 w-3 text-white/40 flex-shrink-0" aria-hidden="true" />
          <span className="text-[10px] text-white/50 font-medium mr-0.5">Ends in</span>
          {[
            { val: timeLeft.d, label: "d" },
            { val: timeLeft.h, label: "h" },
            { val: timeLeft.m, label: "m" },
            { val: timeLeft.s, label: "s" },
          ].map((unit, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span className="flex flex-col items-center">
                <span
                  className="inline-flex items-center justify-center rounded bg-white/10 border border-white/10 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white"
                  style={{ minWidth: "1.75rem" }}
                >
                  {unit.val}
                </span>
                <span className="text-[8px] text-white/30 font-medium mt-0.5 leading-none">{unit.label}</span>
              </span>
              {i < 3 && (
                <span className="text-white/40 text-xs font-bold mb-2">:</span>
              )}
            </span>
          ))}
        </span>

        {/* CTA — desktop */}
        <span
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-white flex-shrink-0 transition-all duration-200 group-hover:gap-2.5 group-hover:shadow-[0_0_18px_rgba(139,92,246,0.6)]"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
            boxShadow: "0 0 10px rgba(139,92,246,0.35)",
          }}
        >
          Claim 50% Off
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>

        {/* CTA — mobile */}
        <span className="sm:hidden inline-flex items-center gap-1 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white flex-shrink-0">
          50% OFF →
        </span>
      </Link>
      </div>
    </div>
  );
}
