const fs = require('fs');
let lines = fs.readFileSync('src/app/UnifiedHomePage.tsx', 'utf8').split('\n');

const replacement = `        {/* Powerful Humanization Features */}
        <section className="py-24 bg-white opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards] relative overflow-hidden">
          {/* Subtle dot background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle at center, #15803d 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-green-50 border border-green-200 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-4">
                Core Technology
              </span>
              <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                How our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">AI humanizer works</span>
              </h2>
              <p className="text-base text-slate-500 tracking-wide max-w-xl mx-auto">
                Under the hood, a purpose-built rewriting engine — not a generic LLM wrapper — handles every nuance of natural language.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, title: "Undetectable output", desc: "Rewrites pass GPTZero, Turnitin, and Originality.ai. The result reads like a person — because it's engineered to." },
                { icon: FileText, title: "Meaning preserved", desc: "Your facts, arguments, and structure stay intact. Only the phrasing changes — nothing gets lost in translation." },
                { icon: Zap, title: "Fast at any scale", desc: "5,000 words processed in under 3 seconds. No queue, no wait — just instant results on demand." },
                { icon: Lock, title: "Private by design", desc: "Your content is never stored, logged, or used for training. What you paste stays yours — full stop." },
                { icon: Languages, title: "50+ languages", desc: "English, Spanish, French, German, Chinese, Japanese, and more — all with the same quality and naturalness." },
                { icon: CheckCircle2, title: "No friction to start", desc: "Paste and go. No account required to try it — sign up only when you're ready for more." }
              ].map((feature, idx) => (
                <div key={idx} className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(34,197,94,0.15)] hover:-translate-y-1 hover:border-green-200 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                    <feature.icon className="w-24 h-24 text-green-700" />
                  </div>
                  
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>`;

// Lines 1477 to 1567 (0-indexed: 1476 to 1566)
lines.splice(1476, 1566 - 1476 + 1, replacement);

fs.writeFileSync('src/app/UnifiedHomePage.tsx', lines.join('\n'), 'utf8');
console.log("Successfully replaced Features section.");
