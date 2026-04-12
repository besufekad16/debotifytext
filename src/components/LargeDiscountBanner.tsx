"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Flame, Sparkles, Zap } from "lucide-react";
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

export default function LargeDiscountBanner() {
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

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden">
      <style>{`
        @keyframes sweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.65; }
          50% { opacity: 1; }
          55% { opacity: 0.75; }
        }
        @keyframes heartbeat-glow {
          0%   { filter: drop-shadow(0 0 6px rgba(168,85,247,0.5)) drop-shadow(0 0 20px rgba(168,85,247,0.2)); transform: scale(1); }
          14%  { filter: drop-shadow(0 0 20px rgba(168,85,247,1)) drop-shadow(0 0 50px rgba(168,85,247,0.7)) drop-shadow(0 0 80px rgba(168,85,247,0.4)); transform: scale(1.06); }
          28%  { filter: drop-shadow(0 0 6px rgba(168,85,247,0.5)) drop-shadow(0 0 20px rgba(168,85,247,0.2)); transform: scale(1); }
          42%  { filter: drop-shadow(0 0 16px rgba(168,85,247,0.9)) drop-shadow(0 0 40px rgba(168,85,247,0.6)) drop-shadow(0 0 65px rgba(168,85,247,0.3)); transform: scale(1.04); }
          70%  { filter: drop-shadow(0 0 6px rgba(168,85,247,0.5)) drop-shadow(0 0 20px rgba(168,85,247,0.2)); transform: scale(1); }
          100% { filter: drop-shadow(0 0 6px rgba(168,85,247,0.5)) drop-shadow(0 0 20px rgba(168,85,247,0.2)); transform: scale(1); }
        }
        @keyframes glass-shine {
          0%   { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(400%) skewX(-15deg); opacity: 0; }
        }
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(30px, -20px) scale(1.05); }
          66%  { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(-25px, 20px) scale(1.04); }
          66%  { transform: translate(20px, -15px) scale(0.98); }
        }
        @keyframes countdown-tick {
          0%   { transform: scale(1); }
          15%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes badge-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.5); }
          50% { box-shadow: 0 0 0 8px rgba(251,191,36,0); }
        }
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 35px rgba(139,92,246,0.8), 0 0 70px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2); }
        }
      `}</style>

      {/* Deep space background */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, #1a0a3e 0%, #0d0820 40%, #060412 100%)",
        }}
      />

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: "600px", height: "600px",
          top: "-200px", left: "-150px",
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          animation: "orb-float 12s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: "500px", height: "500px",
          bottom: "-150px", right: "-100px",
          background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          animation: "orb-float-2 15s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: "300px", height: "300px",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Glass sweep */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 48%, rgba(139,92,246,0.06) 50%, rgba(255,255,255,0.03) 52%, transparent 70%)",
          backgroundSize: "300% 100%",
          animation: "sweep 6s ease-in-out infinite",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent 0%, #7c3aed 20%, #a855f7 40%, #f59e0b 60%, #a855f7 80%, transparent 100%)" }}
      />
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent 0%, #7c3aed 20%, #a855f7 40%, #f59e0b 60%, #a855f7 80%, transparent 100%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Milestone badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-2 mb-8 backdrop-blur-sm"
          style={{ animation: "badge-ring 2.5s ease-in-out infinite" }}
        >
          <Flame className="h-4 w-4 text-amber-400" style={{ animation: "flicker 2.4s ease-in-out infinite" }} />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
            500,000+ Users Milestone
          </span>
          <Sparkles className="h-4 w-4 text-amber-400/70" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
          We&apos;re Celebrating — And You&apos;re Invited
        </h2>
        <p className="text-base sm:text-lg text-white/60 mb-10 max-w-xl mx-auto font-medium">
          For the next 7 days only, get our best deal ever on yearly plans.
        </p>

        {/* Glass card */}
        <div
          className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden mb-10"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(139,92,246,0.08) 50%, rgba(255,255,255,0.04) 100%)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Glass shine sweep */}
          <div
            className="pointer-events-none absolute inset-y-0 w-24"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              animation: "glass-shine 4s ease-in-out infinite",
            }}
          />

          <div className="relative px-8 py-10 sm:px-12 sm:py-12">
            {/* Discount text — heartbeat glow */}
            <div
              className="inline-block mb-2"
              style={{ animation: "heartbeat-glow 1.6s ease-in-out infinite" }}
            >
              <span
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter"
                style={{
                  background: "linear-gradient(135deg, #e9d5ff 0%, #c084fc 30%, #a855f7 60%, #7c3aed 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                50% OFF
              </span>
            </div>

            <p
              className="text-xl sm:text-2xl font-bold mb-1"
              style={{
                background: "linear-gradient(90deg, #f3e8ff, #e9d5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              All Yearly Plans
            </p>
            <p className="text-sm text-white/50 mb-8 font-medium">
              Save up to <span className="text-white/80 font-bold">$120/year</span> · Discount applied automatically at checkout
            </p>

            {/* Countdown */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                ⏳ Offer expires in
              </p>
              <div className="flex items-end gap-2 sm:gap-3">
                {[
                  { val: timeLeft.d, label: "Days" },
                  { val: timeLeft.h, label: "Hours" },
                  { val: timeLeft.m, label: "Mins" },
                  { val: timeLeft.s, label: "Secs" },
                ].map((unit, i) => (
                  <div key={i} className="flex items-end gap-2 sm:gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="flex items-center justify-center rounded-xl text-3xl sm:text-4xl font-black tabular-nums text-white"
                        style={{
                          minWidth: "4rem",
                          minHeight: "4.5rem",
                          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(139,92,246,0.15) 100%)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          backdropFilter: "blur(8px)",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                        }}
                      >
                        {unit.val}
                      </div>
                      <span className="text-[10px] sm:text-xs text-white/40 font-semibold mt-2 uppercase tracking-wider">
                        {unit.label}
                      </span>
                    </div>
                    {i < 3 && (
                      <span className="text-white/30 text-2xl font-bold mb-5">:</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base sm:text-lg font-bold text-white transition-all duration-300 hover:gap-4 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)",
                animation: "cta-pulse 2.5s ease-in-out infinite",
              }}
            >
              <Zap className="h-5 w-5 text-yellow-300" />
              Claim 50% Off — Yearly Plans
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p className="text-xs text-white/30 mt-4 font-medium">
              No credit card required to start · Cancel anytime
            </p>
          </div>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-white/50">
          {[
            { icon: "✓", text: "No hidden fees" },
            { icon: "✓", text: "Cancel anytime" },
            { icon: "✓", text: "Instant access" },
            { icon: "✓", text: "Discount auto-applied" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-violet-400 font-bold">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
