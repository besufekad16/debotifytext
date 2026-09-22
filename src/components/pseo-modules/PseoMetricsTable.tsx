"use client";
import { ShieldCheck, TrendingDown, ArrowUpRight, Zap, Target } from "~/components/LucideIcons";

export function PseoMetricsTable({ keyword, metrics }: { keyword: string; metrics?: { initialDetectionRisk: number, postHumanizationOriginality: number, semanticPreservationScore: number, tokensProcessedAvg: number } }) {
  if (!metrics) return null;

  return (
    <section className="my-32 w-full max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 shadow-sm mx-auto mb-6">
          <ShieldCheck className="h-4 w-4 text-[var(--hl-mint-deep)]" />
          <span>Real-time Telemetry</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 capitalize">
          Performance Metrics for {keyword}
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Proprietary data aggregated from real-world usage patterns across all primary detection algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="group relative overflow-hidden p-8 bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-rose-50 rounded-2xl">
              <Target className="h-6 w-6 text-rose-500" />
            </div>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md">Critical</span>
          </div>
          <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Initial Risk</div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">{metrics.initialDetectionRisk}%</div>
          <div className="mt-6 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-1000 ease-out origin-left" style={{ width: `${metrics.initialDetectionRisk}%` }} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden p-8 bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <TrendingDown className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Target</span>
          </div>
          <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Humanization</div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">{metrics.postHumanizationOriginality}%</div>
          <div className="mt-6 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out origin-left" style={{ width: `${metrics.postHumanizationOriginality}%` }} />
          </div>
        </div>

        {/* Card 3 (Highlight) */}
        <div className="group relative overflow-hidden p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--hl-mint-deep)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <ArrowUpRight className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-bold text-white bg-white/20 px-2 py-1 rounded-md backdrop-blur-md">Optimized</span>
          </div>
          <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider relative z-10">Semantic Match</div>
          <div className="text-4xl font-black text-white tracking-tight relative z-10">{metrics.semanticPreservationScore}%</div>
          <div className="mt-6 h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-[var(--hl-mint-bright)] transition-all duration-1000 ease-out origin-left shadow-[0_0_10px_var(--hl-mint-bright)]" style={{ width: `${metrics.semanticPreservationScore}%` }} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative overflow-hidden p-8 bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Scale</span>
          </div>
          <div className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Tokens Processed</div>
          <div className="text-4xl font-black text-slate-900 tracking-tight">{(metrics.tokensProcessedAvg / 1000).toFixed(0)}k+</div>
          <div className="mt-6 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000 ease-out origin-left w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
