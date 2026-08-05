"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import type { DetectorContentData } from "~/lib/content/detector-content";

export default function DetectorTemplate({ data }: { data: DetectorContentData }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — technical red/green */}
      <section className="bg-[#1a1a2e] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <AlertTriangle className="w-3.5 h-3.5" /> AI Detection Risk
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{data.h1}</h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">{data.intro}</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[var(--hl-surface)]0 hover:bg-[var(--hl-mint)] text-black font-bold px-8 py-4 rounded-xl transition-colors text-sm">
            Bypass Detection Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Score meters */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Detection Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.detectorStats.map((stat, i) => (
              <div key={i} className={`rounded-xl p-5 text-center border ${i === 1 ? 'bg-[var(--hl-surface)] border-[var(--hl-mint)]/25' : 'bg-white border-gray-200'}`}>
                <div className={`text-2xl font-black mb-1 ${i === 1 ? 'text-[var(--hl-mint-deep)]' : 'text-red-500'}`}>{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How HumanifyLab Bypasses Detection</h2>
          <div className="space-y-4">
            {data.howItWorks.map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-7 h-7 rounded-full bg-[var(--hl-surface)]0 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">FAQ</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#1a1a2e] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <ShieldCheck className="w-10 h-10 text-[var(--hl-mint-bright)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{data.cta}</h2>
          <Link href="/" className="inline-flex items-center gap-2 bg-[var(--hl-surface)]0 hover:bg-[var(--hl-mint)] text-black font-bold px-8 py-4 rounded-xl transition-colors">
            Try Free Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
