"use client";
import { BookOpen } from "~/components/LucideIcons";

export function PseoGlossary({ keyword, glossary = [] }: { keyword: string; glossary?: Array<{term: string, definition: string}> }) {
  if (!glossary || !Array.isArray(glossary) || glossary.length === 0) return null;

  return (
    <section className="my-32 w-full max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 shadow-sm mx-auto mb-6">
          <BookOpen className="h-4 w-4 text-[var(--hl-mint-deep)]" />
          <span>Core Concepts</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 capitalize">
          {keyword} Terminology
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Essential vocabulary and technical terms you need to master AI detection bypass.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {glossary.map((item, idx) => (
          <div key={idx} className="group relative bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--hl-mint)]/10 to-transparent rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-150" />
            
            <h3 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100 group-hover:border-[var(--hl-mint-deep)]/20 transition-colors duration-300 relative inline-block">
              {item.term}
              <div className="absolute bottom-[-1px] left-0 w-0 h-0.5 bg-[var(--hl-mint-deep)] transition-all duration-300 group-hover:w-full" />
            </h3>
            
            <p className="text-slate-500 leading-relaxed font-medium">
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
