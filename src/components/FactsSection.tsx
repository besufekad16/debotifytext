"use client";

import { Zap, ShieldCheck, Fingerprint } from "lucide-react";

export default function FactsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50/30 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
            Why It Works
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Our AI engine doesn't just swap words. It rewrites entire structures to mimic natural human writing patterns.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-green-400 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Professional-Grade Quality</h3>
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">100%</span>
              <span className="text-sm text-slate-500 font-medium ml-2">Human Score</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              We ensure your writing meets the highest professional standards with natural, authentic human tone and style.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-green-400 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Fingerprint className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Natural Flow</h3>
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">0%</span>
              <span className="text-sm text-slate-500 font-medium ml-2">Plagiarism</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Maintains your original meaning and tone while ensuring the text reads completely naturally.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-green-400 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">&lt;10s</span>
              <span className="text-sm text-slate-500 font-medium ml-2">Processing</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Get humanized results instantly. No waiting in queues, perfect for deadlines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

