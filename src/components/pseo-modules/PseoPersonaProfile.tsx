"use client";

import React from "react";
import { UserCheck, Target, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PseoPersonaProfileProps {
  keyword: string;
  profile?: {
    name?: string;
    role?: string;
    quote?: string;
    challenges?: string[];
    benefits?: string[];
    idealUser?: string;
    coreIntent?: string;
  };
}

export function PseoPersonaProfile({ keyword, profile }: PseoPersonaProfileProps) {
  if (!profile) return null;

  const audience = profile.idealUser || profile.role || "College Students & Content Writers";
  const intent = profile.coreIntent || `Master ${keyword.toLowerCase()} with undetectable, natural prose.`;

  const checklistItems = [
    "Restructures predictable sentence cadences into natural burstiness",
    "Preserves citations, data points, and specialized vocabulary",
    "Eliminates AI hallmarks and overused filler words",
    "Calibrated specifically for university submission integrity"
  ];

  return (
    <section className="my-24 w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row bg-white/90 backdrop-blur-2xl rounded-3xl border border-emerald-500/15 shadow-[0_12px_45px_-10px_rgba(5,150,105,0.08)] overflow-hidden">
        {/* Left Column: Target Audience Persona */}
        <div className="lg:w-2/5 p-8 sm:p-12 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-100/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-6">
              <UserCheck className="h-4 w-4 text-emerald-700" />
              <span>Target Persona & Intent</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
              Built Specifically For
            </h3>
            <p className="text-lg font-bold text-emerald-700 mb-6">
              {audience}
            </p>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>Primary Search Intent</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                "{intent}"
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/50 text-xs text-slate-400">
            <span className="font-semibold text-slate-600">Verification Benchmark:</span> Designed to meet the stringent submission guidelines of universities and academic publishers.
          </div>
        </div>

        {/* Right Column: Execution Blueprint & Benefits */}
        <div className="lg:w-3/5 p-8 sm:p-12 bg-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 tracking-tight">
              Why DebotifyText Excels at <span className="text-emerald-600 capitalize">{keyword}</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8">
              Standard paraphrasers merely swap synonyms using basic dictionaries, which AI detectors catch instantly by analyzing token n-grams. DebotifyText reconstructs the foundational syntax, introducing natural human variance.
            </p>

            <div className="space-y-4 mb-8">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="p-1 rounded-full bg-emerald-100/60 text-emerald-700 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Zero login required for free preview
            </span>
            <Link
              href="/ai-humanizer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Launch Humanizer App
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
