const fs = require('fs');
let lines = fs.readFileSync('src/app/UnifiedHomePage.tsx', 'utf8').split('\n');

const replacement = `        {/* How It Works Section */}
        <section className="py-24 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards] relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-400/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-green-50 border border-green-200 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-4">
                Workflow
              </span>
              <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">bypass AI detection</span>
              </h2>
              <p className="text-base text-slate-500 tracking-wide max-w-xl mx-auto">Three simple steps to transform robotic AI generation into natural, undetectable human writing.</p>
            </div>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-[88px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-green-100 via-green-400 to-green-100 hidden lg:block opacity-50" />
              
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {[
                  { n: "1", title: "Paste your text", desc: "Drop in content from ChatGPT, Claude, Gemini, or any AI tool. Supports plain text, .docx, and .pdf." },
                  { n: "2", title: "Hit Humanize", desc: "Our engine rewrites for natural flow, varied sentence rhythm, and authentic tone — while keeping your meaning." },
                  { n: "3", title: "Copy and use", desc: "Download as .txt or .docx, or copy directly. Ready for submission, publication, or wherever you need it." },
                ].map((step, idx) => (
                  <div key={step.n} className="group relative text-center rounded-[2rem] bg-white border border-slate-100 p-10 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] hover:border-green-200 transition-all duration-500 overflow-hidden">
                    {/* Background Number */}
                    <div className="absolute -top-6 -right-6 text-[180px] font-black text-slate-50/80 leading-none select-none z-0 group-hover:text-green-50/50 transition-colors duration-500">
                      {step.n}
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-green-500/20 group-hover:border-green-200 transition-all duration-500">
                        {idx === 0 && <FileText className="w-7 h-7 text-green-600" />}
                        {idx === 1 && <Sparkles className="w-7 h-7 text-green-600" />}
                        {idx === 2 && <Copy className="w-7 h-7 text-green-600" />}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                      <p className="text-[14px] text-slate-500 leading-relaxed max-w-[260px]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>`;

// Target lines: 1404 to 1448 (0-indexed: 1403 to 1447)
lines.splice(1403, 1448 - 1404 + 1, replacement);

fs.writeFileSync('src/app/UnifiedHomePage.tsx', lines.join('\n'), 'utf8');
console.log("Successfully replaced How It Works section.");
