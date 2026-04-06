"use client";
import Link from "next/link";
import { ArrowRight, TrendingUp, Zap, Users } from "lucide-react";
import type { ProfessionalContentData } from "~/lib/content/professional-content";

export default function ProfessionalTemplate({ data }: { data: ProfessionalContentData }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero — dark corporate */}
      <section className="py-20 px-4 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Professional</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">{data.h1}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-10">{data.intro}</p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {data.stats.map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-emerald-400 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <Link href="/" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-xl transition-colors text-sm">
            Start Humanizing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Why Professionals Choose HumanifyLab</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 p-5 bg-white/5 border border-white/10 rounded-xl">
                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">FAQ</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2 text-sm">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-white/10 text-center">
        <div className="max-w-2xl mx-auto">
          <Users className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{data.cta}</h2>
          <Link href="/" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-xl transition-colors">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
