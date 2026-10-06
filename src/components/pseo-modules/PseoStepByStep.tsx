"use client";

export function PseoStepByStep({ keyword, steps = [] }: { keyword: string; steps?: Array<{title: string, description: string}> }) {
  if (!steps || !Array.isArray(steps) || steps.length === 0) return null;

  return (
    <section className="my-32 w-full max-w-6xl mx-auto px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-gradient-to-b from-transparent via-green-600/5 to-transparent blur-3xl -z-10" />

      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 capitalize">
          How to Use DebotifyText for {keyword}
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          A frictionless, three-step automated workflow engineered to bypass all detection.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Desktop horizontal connecting line */}
        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-700/30 to-transparent" />
        
        {/* Mobile vertical connecting line */}
        <div className="md:hidden absolute top-0 left-8 h-full w-0.5 bg-gradient-to-b from-transparent via-green-700/30 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-start md:items-center text-left md:text-center group">
              {/* Number Node */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8 shrink-0 transition-transform duration-500 group-hover:-translate-y-2 group-hover:border-green-700/50 group-hover:shadow-[0_10px_40px_rgba(21,128,61,0.1)] mx-0 md:mx-auto">
                <span className="text-2xl font-black text-green-700">{idx + 1}</span>
                <div className="absolute inset-0 bg-green-700 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500" />
              </div>

              {/* Content Box */}
              <div className="ml-24 md:ml-0 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] w-full transition-all duration-300 group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] group-hover:border-slate-300">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
