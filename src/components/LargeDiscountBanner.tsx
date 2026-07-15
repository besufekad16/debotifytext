"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Flame, Infinity as InfinityIcon, Zap } from "lucide-react";
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

export default function LargeDiscountBanner() {
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

  useEffect(() => {
    fetch("/api/polar/unlimited-spots")
      .then(r => r.json())
      .then((d: { taken?: number }) => { if (d.taken) setSpotsTaken(d.taken); })
      .catch(() => {});
  }, []);

  const remaining = Math.max(0, MAX_SPOTS - spotsTaken);
  const pctFull = Math.min(100, Math.round((spotsTaken / MAX_SPOTS) * 100));

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden">
      <style>{`
        @keyframes sweep-lg{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes flicker-lg{0%,100%{opacity:1}45%{opacity:.65}50%{opacity:1}55%{opacity:.75}}
        @keyframes heartbeat-lg{
          0%,100%{filter:drop-shadow(0 0 6px rgba(212,168,85,.5)) drop-shadow(0 0 20px rgba(212,168,85,.2));transform:scale(1)}
          14%{filter:drop-shadow(0 0 20px rgba(212,168,85,1)) drop-shadow(0 0 50px rgba(212,168,85,.7));transform:scale(1.06)}
          28%{filter:drop-shadow(0 0 6px rgba(212,168,85,.5));transform:scale(1)}
          42%{filter:drop-shadow(0 0 16px rgba(212,168,85,.9)) drop-shadow(0 0 40px rgba(212,168,85,.6));transform:scale(1.04)}
          70%,100%{filter:drop-shadow(0 0 6px rgba(212,168,85,.5));transform:scale(1)}
        }
        @keyframes glass-shine-lg{
          0%{transform:translateX(-100%) skewX(-15deg);opacity:0}
          20%{opacity:1}80%{opacity:1}
          100%{transform:translateX(400%) skewX(-15deg);opacity:0}
        }
        @keyframes orb-a{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,-18px) scale(1.05)}}
        @keyframes orb-b{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,14px) scale(1.04)}}
        @keyframes cta-gold{
          0%,100%{box-shadow:0 0 20px rgba(212,168,85,.5),0 0 40px rgba(212,168,85,.2),inset 0 1px 0 rgba(255,255,255,.3)}
          50%{box-shadow:0 0 35px rgba(212,168,85,.8),0 0 70px rgba(212,168,85,.4),inset 0 1px 0 rgba(255,255,255,.4)}
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 20% 50%,#1e0f02 0%,#0d0700 40%,#050300 100%)"}} />

      {/* Orbs */}
      <div className="pointer-events-none absolute rounded-full" style={{width:"600px",height:"600px",top:"-200px",left:"-150px",background:"radial-gradient(circle,rgba(212,168,85,.15) 0%,transparent 70%)",animation:"orb-a 12s ease-in-out infinite"}} />
      <div className="pointer-events-none absolute rounded-full" style={{width:"500px",height:"500px",bottom:"-150px",right:"-100px",background:"radial-gradient(circle,rgba(139,111,71,.12) 0%,transparent 70%)",animation:"orb-b 15s ease-in-out infinite"}} />

      {/* Sweep */}
      <div className="pointer-events-none absolute inset-0" style={{background:"linear-gradient(105deg,transparent 30%,rgba(212,168,85,.04) 50%,transparent 70%)",backgroundSize:"300% 100%",animation:"sweep-lg 6s ease-in-out infinite"}} />

      {/* Accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:"linear-gradient(90deg,transparent,#C8922A 20%,#E8B84B 50%,#C8922A 80%,transparent)"}} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{background:"linear-gradient(90deg,transparent,#C8922A 20%,#E8B84B 50%,#C8922A 80%,transparent)"}} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2 mb-8">
          <Flame className="h-4 w-4 text-amber-400" style={{animation:"flicker-lg 2.4s ease-in-out infinite"}} />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
            {remaining} of {MAX_SPOTS} Spots Remaining · 7-Day Offer
          </span>
          <InfinityIcon className="h-4 w-4 text-amber-400/70" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
          Unlimited Words for 2 Full Months
        </h2>
        <p className="text-base sm:text-lg text-white/60 mb-10 max-w-xl mx-auto font-medium">
          Billed every 2 months. No word caps. No daily limits.
          Just pure, unlimited humanization — for 60 days straight.
        </p>

        {/* Glass card */}
        <div
          className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden mb-10"
          style={{
            background:"linear-gradient(135deg,rgba(212,168,85,.08) 0%,rgba(139,111,71,.12) 50%,rgba(212,168,85,.06) 100%)",
            border:"1px solid rgba(212,168,85,.25)",
            backdropFilter:"blur(20px)",
            boxShadow:"0 8px 32px rgba(0,0,0,.5),inset 0 1px 0 rgba(212,168,85,.15)",
          }}
        >
          {/* Shine */}
          <div className="pointer-events-none absolute inset-y-0 w-24" style={{background:"linear-gradient(90deg,transparent,rgba(212,168,85,.06),transparent)",animation:"glass-shine-lg 4s ease-in-out infinite"}} />

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">

            {/* Price */}
            <div className="inline-block mb-1" style={{animation:"heartbeat-lg 1.6s ease-in-out infinite"}}>
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter" style={{
                background:"linear-gradient(135deg,#F5D78A 0%,#E8B84B 40%,#C8922A 100%)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
              }}>
                $100
              </span>
            </div>
            <p className="text-white/50 text-sm mb-1">billed every 2 months · cancel anytime</p>
            <p className="text-amber-400/80 text-xs font-semibold mb-8">Unlimited access for 2 full months per cycle</p>

            {/* Spots progress */}
            <div className="mb-8 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/60 font-medium flex items-center gap-1.5">
                  <Flame className="h-3 w-3 text-amber-400" />
                  {spotsTaken} of {MAX_SPOTS} spots claimed
                </span>
                <span className="text-xs font-bold text-amber-400">{remaining} left</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width:`${pctFull}%`,
                    background: pctFull > 70
                      ? "linear-gradient(90deg,#f97316,#ef4444)"
                      : "linear-gradient(90deg,#C8922A,#E8B84B,#F5D78A)",
                  }}
                />
              </div>
              {pctFull > 50 && (
                <p className="text-[11px] text-amber-300 mt-1.5 font-semibold text-center">
                  More than half the spots are gone — grab yours now
                </p>
              )}
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Offer expires in
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
                          minWidth:"4rem",minHeight:"4.5rem",
                          background:"linear-gradient(135deg,rgba(212,168,85,.12) 0%,rgba(139,111,71,.18) 100%)",
                          border:"1px solid rgba(212,168,85,.2)",
                          backdropFilter:"blur(8px)",
                          boxShadow:"0 4px 16px rgba(0,0,0,.3),inset 0 1px 0 rgba(212,168,85,.15)",
                        }}
                      >
                        {unit.val}
                      </div>
                      <span className="text-[10px] sm:text-xs text-white/40 font-semibold mt-2 uppercase tracking-wider">
                        {unit.label}
                      </span>
                    </div>
                    {i < 3 && <span className="text-white/30 text-2xl font-bold mb-5">:</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base sm:text-lg font-bold text-[#1a0e00] transition-all duration-300 hover:gap-4 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background:"linear-gradient(135deg,#E8B84B 0%,#C8922A 60%,#A87020 100%)",
                animation:"cta-gold 2.5s ease-in-out infinite",
              }}
            >
              <Zap className="h-5 w-5" />
              Claim Your Spot — $100 / 2 Months
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
            { icon: "✓", text: "No subscription" },
            { icon: "✓", text: "No word limits" },
            { icon: "✓", text: "Instant access" },
            { icon: "✓", text: "2 months guaranteed" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
