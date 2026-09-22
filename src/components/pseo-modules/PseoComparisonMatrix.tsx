"use client";
import { CheckCircle, XCircle } from "~/components/LucideIcons";

export function PseoComparisonMatrix({ keyword }: { keyword: string }) {
  const features = [
    "Bypass Detection Algorithms",
    "Preserve Original Semantic Intent",
    "API Access & Integrations",
    "Custom Tone Modeling",
    "Real-time Scoring Feedback"
  ];

  return (
    <section className="my-32 w-full max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight hl-gradient-text capitalize">
          HumanifyLab vs Alternatives for {keyword}
        </h2>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto">
          See why top professionals and students rely on our proprietary architecture for guaranteed undetectability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[var(--hl-mint)]/10 via-transparent to-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Competitors Card */}
        <div className="flex flex-col bg-slate-50/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 p-10 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Standard Tools</h3>
          <ul className="space-y-6 flex-grow">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <XCircle className="h-6 w-6 text-rose-400 shrink-0" />
                <span className="text-lg text-slate-600 font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* HumanifyLab Card */}
        <div className="flex flex-col bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-[var(--hl-mint-deep)]/20 p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(94,61,42,0.15)] relative overflow-hidden transform md:-translate-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--hl-mint)]/10 rounded-bl-full blur-2xl -z-10 pointer-events-none" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[var(--hl-mint-deep)] to-transparent opacity-50" />
          
          <h3 className="text-2xl font-black text-[var(--hl-mint-deep)] mb-8 text-center flex items-center justify-center gap-3">
            HumanifyLab
            <span className="px-3 py-1 bg-[var(--hl-mint-deep)]/10 text-[var(--hl-mint-deep)] text-xs font-bold uppercase tracking-wider rounded-full">Winner</span>
          </h3>
          
          <ul className="space-y-6 flex-grow">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-4 group">
                <div className="relative">
                  <CheckCircle className="h-7 w-7 text-[var(--hl-mint-deep)] relative z-10 transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[var(--hl-mint)]/40 blur-md rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-lg text-slate-900 font-bold">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
