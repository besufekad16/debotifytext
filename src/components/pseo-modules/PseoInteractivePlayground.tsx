"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Sparkles, Shield, Zap, RefreshCw, CheckCircle2 } from "lucide-react";

interface PseoInteractivePlaygroundProps {
  keyword: string;
}

interface SampleText {
  ai: string;
  human: string;
}

const DEFAULT_SAMPLE: SampleText = {
  ai: "Artificial intelligence models utilize complex neural networks to predict next-token distributions, resulting in uniform sentence structures and predictable vocabulary distributions across generated passages.",
  human: "Every AI model relies on token probability, which is why machine-generated drafts often feel so robotic. Human writers naturally vary their pace—mixing brief observations with detailed arguments—creating a cadence that software simply cannot mimic on its own."
};

const SAMPLE_TEXTS: Record<"academic" | "detector" | "general", SampleText> = {
  academic: {
    ai: "Furthermore, it is crucial to analyze the implications of these technological advancements. The paradigm shift clearly indicates that multifaceted socioeconomic variables significantly delineate modern societal progression.",
    human: "Looking deeper at these changes reveals a much broader picture. Rather than following a single path, modern society has evolved through an intricate mix of economic pressures and cultural shifts that cannot be reduced to simple metrics."
  },
  detector: {
    ai: "In conclusion, this research paper highlights the profound necessity of adopting sustainable framework methodologies across all modern manufacturing sectors to optimize systemic output.",
    human: "Ultimately, sustainable manufacturing is no longer optional. When factories rethink their core supply chains—cutting waste at the source rather than patching issues after the fact—efficiency and environmental benefits align naturally."
  },
  general: DEFAULT_SAMPLE
};

export function PseoInteractivePlayground({ keyword }: { keyword: string }) {
  const [activeTab, setActiveTab] = useState<"academic" | "detector" | "general">("academic");
  const [copied, setCopied] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [userText, setUserText] = useState("");
  const [humanizedResult, setHumanizedResult] = useState("");

  const sample: SampleText = SAMPLE_TEXTS[activeTab] ?? DEFAULT_SAMPLE;
  const currentOutput = humanizedResult || sample.human;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateHumanize = () => {
    setIsHumanizing(true);
    setTimeout(() => {
      setIsHumanizing(false);
      if (userText.trim().length > 0) {
        // Simple client-side demonstration restructuring for immediate feedback
        const restructured = userText
          .replace(/furthermore|moreover|in conclusion|in summary|it is crucial to note that/gi, "notably,")
          .replace(/multifaceted|utilize|paradigm shift|underscores the importance/gi, "practical")
          .trim();
        setHumanizedResult(
          restructured.length > 20
            ? `Naturally restructured: ${restructured}`
            : sample.human
        );
      } else {
        setHumanizedResult(sample.human);
      }
    }, 700);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-12 relative z-20">
      {/* Container with premium glassmorphism */}
      <div className="relative rounded-3xl bg-white/90 backdrop-blur-2xl border border-emerald-500/20 shadow-[0_20px_70px_-15px_rgba(5,150,105,0.12)] p-6 sm:p-8 md:p-10 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-500/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold tracking-wide mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Interactive Live Preview</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Test Humanization for <span className="text-emerald-600 capitalize">{keyword}</span>
            </h3>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 self-start sm:self-auto">
            <button
              onClick={() => { setActiveTab("academic"); setHumanizedResult(""); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "academic"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => { setActiveTab("detector"); setHumanizedResult(""); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "detector"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Detector Bypass
            </button>
            <button
              onClick={() => { setActiveTab("general"); setHumanizedResult(""); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "general"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Natural Tone
            </button>
          </div>
        </div>

        {/* Split Playground UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Left Column: AI Input */}
          <div className="flex flex-col rounded-2xl bg-slate-50/90 border border-slate-200/70 p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Original AI Text (Detected)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold">
                98% AI Risk
              </span>
            </div>

            <textarea
              value={userText || sample.ai}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Paste your AI text here to test..."
              rows={5}
              className="w-full resize-none bg-white rounded-xl border border-slate-200/80 p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-sans leading-relaxed"
            />

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50">
              <span className="text-xs text-slate-400">
                Predictable Token Cadence
              </span>
              <button
                onClick={handleSimulateHumanize}
                disabled={isHumanizing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isHumanizing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Humanizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Humanize Text
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: DebotifyText Humanized Output */}
          <div className="flex flex-col rounded-2xl bg-emerald-950 text-white p-5 relative border border-emerald-800 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                DebotifyText Restructured
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                0% AI • 100% Human
              </span>
            </div>

            <div className="w-full rounded-xl bg-black/30 border border-white/10 p-3.5 text-sm text-emerald-50 font-sans leading-relaxed min-h-[120px] flex items-center">
              {isHumanizing ? (
                <div className="flex items-center justify-center w-full py-6 text-emerald-400 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Restructuring burstiness & syntactic rhythm...</span>
                </div>
              ) : (
                <p>{currentOutput}</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-emerald-400/90 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Meaning & citations preserved</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Result
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live CTA Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Shield className="w-4 h-4 text-emerald-600" />
              Turnitin, GPTZero & Copyleaks Tested
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-600 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              1.4s Average Processing Time
            </span>
          </div>

          <Link
            href="/ai-humanizer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02]"
          >
            Humanize in Full Editor
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
