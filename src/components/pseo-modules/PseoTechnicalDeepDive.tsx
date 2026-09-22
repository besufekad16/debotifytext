"use client";
import { Cpu } from "~/components/LucideIcons";

export function PseoTechnicalDeepDive({ keyword, content }: { keyword: string; content?: string }) {
  if (!content || typeof content !== "string") return null;

  return (
    <section className="my-32 w-full max-w-6xl mx-auto px-6">
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 shadow-2xl relative overflow-hidden border border-slate-800">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[var(--hl-mint-deep)]/20 via-blue-500/10 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik02MCAwaC02MHY2MEg2MFYweiIvPjwvZz48L3N2Zz4=')] opacity-20 -z-10" />

        <div className="flex flex-col md:flex-row gap-16 md:gap-24 relative z-10">
          {/* Header Column */}
          <div className="md:w-1/3 shrink-0">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shadow-inner mb-8">
              <Cpu className="h-8 w-8 text-[var(--hl-mint-bright)] drop-shadow-[0_0_15px_rgba(var(--hl-mint-bright-rgb),0.5)]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white capitalize tracking-tight leading-tight mb-4">
              Technical Architecture
            </h2>
            <p className="text-[var(--hl-mint-bright)] font-bold tracking-widest uppercase text-sm">
              Proprietary Engine
            </p>
          </div>
          
          {/* Content Column */}
          <div className="md:w-2/3">
            <div className="space-y-8">
              {content.split('\n\n').map((paragraph, idx) => (
                <div key={idx} className="relative pl-8 md:pl-10 before:absolute before:left-0 before:top-3 before:w-3 before:h-3 before:bg-white/10 before:border before:border-[var(--hl-mint-bright)]/50 before:rounded-full">
                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
