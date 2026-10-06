"use client";
import { User, Quote, CheckCircle2 } from "~/components/LucideIcons";

export function PseoPersonaProfile({ keyword, profile }: { keyword: string; profile?: { name: string, role: string, quote: string, challenges: string[], benefits: string[] } }) {
  if (!profile) return null;

  return (
    <section className="my-32 w-full max-w-6xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-slate-200/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
        
        {/* Left Pane: Profile Info & Quote */}
        <div className="lg:w-2/5 p-12 md:p-16 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200/60 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] opacity-50 -z-10" />
          
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 shadow-sm mb-10">
              <User className="h-4 w-4 text-green-700" />
              <span>User Success Story</span>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-2">{profile.name}</h3>
            <p className="text-green-700 font-bold tracking-wide uppercase text-sm mb-12">{profile.role}</p>
          </div>

          <div className="relative">
            <Quote className="absolute -top-6 -left-4 h-12 w-12 text-slate-200 -z-10 rotate-180" />
            <p className="text-xl md:text-2xl text-slate-700 font-medium italic leading-relaxed relative z-10">
              "{profile.quote}"
            </p>
          </div>
        </div>

        {/* Right Pane: Challenges & Solutions */}
        <div className="lg:w-3/5 p-12 md:p-16 bg-white">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 tracking-tight">
            How DebotifyText Solves <span className="text-green-700 capitalize">{keyword}</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Challenges */}
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">The Challenges</h4>
              <ul className="space-y-5">
                {profile.challenges?.map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0 shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
                    <span className="text-slate-600 leading-relaxed font-medium">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-6">The Benefits</h4>
              <ul className="space-y-5">
                {profile.benefits?.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-900 font-semibold leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
