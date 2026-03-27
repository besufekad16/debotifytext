"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Flame, Clock, Sparkles, Zap } from "lucide-react";
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

export default function LargeDiscountBanner() {
  const [timeLeft, setTimeLeft] = useState({ d: "06", h: "23", m: "59", s: "59" });

  useEffect(() => {
    const deadline = getDeadline();

    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: "00", h: "00", m: "00", s: "00" });
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
    <section className="relative w-full py-16 sm:py-20 overflow-hidden">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 30%, #24243e 60%, #0f0c29 100%)",
        }}
      />

      {/* Animated gradient sweep */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(105deg, transparent 35%, rgba(139,92,246,0.12) 50%, transparent 65%)",
          backgroundSize: "250% 100%",
          animation: "sweep 4s ease-in-out infinite",
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, #7c3aed, #f59e0b, #8B6F47, #7c3aed)",
        }}
      />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, #7c3aed, #f59e0b, #8B6F47, #7c3aed)",
        }}
      />

      {/* Decorative straight lines - Top Left */}
      <div className="absolute top-8 left-8 w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute top-12 left-8 w-24 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>
      <div className="absolute top-8 left-8 w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
      <div className="absolute top-8 left-12 w-px h-24 bg-gradient-to-b from-transparent via-purple-400/40 to-transparent"></div>

      {/* Decorative straight lines - Top Right */}
      <div className="absolute top-8 right-8 w-32 h-px bg-gradient-to-l from-transparent via-white/30 to-transparent"></div>
      <div className="absolute top-12 right-8 w-24 h-px bg-gradient-to-l from-transparent via-amber-400/40 to-transparent"></div>
      <div className="absolute top-8 right-8 w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
      <div className="absolute top-8 right-12 w-px h-24 bg-gradient-to-b from-transparent via-purple-400/40 to-transparent"></div>

      {/* Decorative straight lines - Bottom Left */}
      <div className="absolute bottom-8 left-8 w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute bottom-12 left-8 w-24 h-px bg-gradient-to-r from-transparent via-[#8B6F47]/60 to-transparent"></div>
      <div className="absolute bottom-8 left-8 w-px h-32 bg-gradient-to-t from-transparent via-white/30 to-transparent"></div>
      <div className="absolute bottom-8 left-12 w-px h-24 bg-gradient-to-t from-transparent via-purple-400/40 to-transparent"></div>

      {/* Decorative straight lines - Bottom Right */}
      <div className="absolute bottom-8 right-8 w-32 h-px bg-gradient-to-l from-transparent via-white/30 to-transparent"></div>
      <div className="absolute bottom-12 right-8 w-24 h-px bg-gradient-to-l from-transparent via-[#8B6F47]/60 to-transparent"></div>
      <div className="absolute bottom-8 right-8 w-px h-32 bg-gradient-to-t from-transparent via-white/30 to-transparent"></div>
      <div className="absolute bottom-8 right-12 w-px h-24 bg-gradient-to-t from-transparent via-purple-400/40 to-transparent"></div>

      {/* Center decorative lines - Horizontal */}
      <div className="absolute top-1/2 left-0 w-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute top-1/2 right-0 w-20 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>

      {/* Animated scanning lines */}
      <div 
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
        style={{
          top: '30%',
          animation: 'scan-vertical 8s ease-in-out infinite'
        }}
      ></div>
      <div 
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
        style={{
          top: '70%',
          animation: 'scan-vertical 8s ease-in-out infinite reverse'
        }}
      ></div>

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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scan-vertical {
          0%, 100% { top: 20%; opacity: 0; }
          50% { top: 80%; opacity: 1; }
        }
      `}</style>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Milestone badge */}
        <div className="inline-flex items-center gap-2 border border-amber-400/30 bg-amber-400/10 px-4 py-2 mb-6">
          <Flame
            className="h-5 w-5 text-amber-400"
            style={{ animation: "flicker 2.4s ease-in-out infinite" }}
          />
          <span className="text-sm font-bold uppercase tracking-widest text-amber-300">
            500,000+ Users Milestone
          </span>
        </div>

        {/* Main heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
          Celebrate With Us!
        </h2>

        {/* Discount highlight */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div
            className="inline-flex items-center gap-3 px-8 py-4 text-5xl sm:text-6xl lg:text-7xl font-black"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              color: "#fff",
              boxShadow: "0 0 40px rgba(139,92,246,0.6)",
              animation: "float 3s ease-in-out infinite"
            }}
          >
            <Sparkles className="h-10 w-10 sm:h-12 sm:w-12" />
            50% OFF
            <Sparkles className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <p className="text-xl sm:text-2xl text-white/90 font-semibold">
            All Yearly Plans
          </p>
        </div>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-white/70 mb-8 max-w-2xl mx-auto">
          Join 500,000+ writers who trust us. Save up to <span className="text-white font-bold">$120/year</span> on our premium plans.
        </p>

        {/* Countdown timer */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="flex items-center gap-2 text-white/60">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Limited Time Offer Ends In</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {[
              { val: timeLeft.d, label: "Days" },
              { val: timeLeft.h, label: "Hours" },
              { val: timeLeft.m, label: "Minutes" },
              { val: timeLeft.s, label: "Seconds" },
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center bg-white/10 border-2 border-white/20 px-4 sm:px-6 py-3 sm:py-4 text-3xl sm:text-4xl font-bold tabular-nums text-white backdrop-blur-sm"
                  style={{ minWidth: "4rem", minHeight: "4rem" }}
                >
                  {unit.val}
                </div>
                <span className="text-xs sm:text-sm text-white/50 font-medium mt-2 uppercase tracking-wide">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/pricing"
          className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:gap-4 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
            boxShadow: "0 0 30px rgba(139,92,246,0.5)",
          }}
        >
          <Zap className="h-6 w-6" />
          Claim Your 50% Discount Now
          <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/60">
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-[#8B6F47]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No hidden fees
          </span>
          <span className="text-white/30">·</span>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-[#8B6F47]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Cancel anytime
          </span>
          <span className="text-white/30">·</span>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-[#8B6F47]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Instant access
          </span>
        </div>
      </div>
    </section>
  );
}
