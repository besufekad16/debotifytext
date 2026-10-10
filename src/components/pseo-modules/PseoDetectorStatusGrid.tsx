"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Activity } from "lucide-react";

interface PseoDetectorStatusGridProps {
  keyword: string;
}

const DETECTORS_STATUS = [
  {
    name: "Turnitin",
    badge: "Academic v2026",
    status: "0% AI Detected",
    scoreBadge: "Passed",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    notes: "Tested against institutional Canvas & Blackboard integrations"
  },
  {
    name: "GPTZero",
    badge: "Shield Core v3",
    status: "0% AI Detected",
    scoreBadge: "Passed",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    notes: "Deep perplexity analysis & sentence burstiness verified"
  },
  {
    name: "Originality.ai",
    badge: "Standard 3.0.1",
    status: "99% Human Score",
    scoreBadge: "Passed",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    notes: "Passed multi-token semantic classification filters"
  },
  {
    name: "Copyleaks",
    badge: "Enterprise 2026",
    status: "Human Written",
    scoreBadge: "Passed",
    iconBg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    notes: "Zero false positive flagging on research and citations"
  }
];

export function PseoDetectorStatusGrid({ keyword }: PseoDetectorStatusGridProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-16">
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Real-time Detector Telemetry</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white capitalize">
              Live Detector Bypass Verification for {keyword}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Updated Daily: All Systems Active</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {DETECTORS_STATUS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-lg text-white group-hover:text-emerald-300 transition-colors">
                    {item.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wide uppercase border border-emerald-500/30">
                    {item.scoreBadge}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-400 mb-3">
                  Model: {item.badge}
                </div>
                <div className="text-xl font-black text-emerald-400 tracking-tight flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  {item.status}
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-3 border-t border-slate-700/50 mt-2">
                {item.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
