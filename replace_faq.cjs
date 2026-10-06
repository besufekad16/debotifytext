const fs = require('fs');
let lines = fs.readFileSync('src/app/UnifiedHomePage.tsx', 'utf8').split('\n');

const replacement = `        {/* FAQ Section */}
        <section id="faq" className="relative py-24 bg-gradient-to-b from-white to-green-50/30 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.4s_forwards] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-400/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-green-50 border border-green-200 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-4">
                FAQ
              </span>
              <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Frequently asked questions about our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">AI humanizer</span>
              </h2>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => {
                const isOpen = faqOpen === item.id;
                return (
                  <div
                    key={item.id}
                    className={\`group rounded-[1.5rem] border transition-all duration-300 overflow-hidden \${
                      isOpen
                        ? "border-green-200 bg-white shadow-[0_8px_30px_-10px_rgba(34,197,94,0.12)] -translate-y-0.5"
                        : "border-slate-100 bg-white hover:border-green-100 hover:shadow-sm"
                    }\`}
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpen(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between py-6 text-left px-6 sm:px-8"
                    >
                      <span className={\`text-[16px] sm:text-[17px] font-bold pr-8 transition-colors \${isOpen ? "text-green-950" : "text-slate-800"}\`}>
                        {item.question}
                      </span>
                      <span className={\`flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300 \${isOpen ? "bg-green-100 text-green-700 rotate-180 shadow-inner" : "bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-green-600"}\`}>
                        <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
                      </span>
                    </button>
                    <div 
                      className={\`overflow-hidden transition-all duration-300 ease-in-out \${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}\`}
                    >
                      <div className="px-6 sm:px-8 pb-7 text-[14.5px] leading-relaxed text-slate-500">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>`;

// Target lines: 1631 to 1682 (0-indexed: 1630 to 1681)
lines.splice(1630, 1681 - 1630 + 1, replacement);

fs.writeFileSync('src/app/UnifiedHomePage.tsx', lines.join('\n'), 'utf8');
console.log("Successfully replaced FAQ section.");
