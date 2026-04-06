"use client";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import type { CompetitorContentData } from "~/lib/content/competitor-content";

export default function CompetitorTemplate({ data }: { data: CompetitorContentData }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#0f1419] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#8b6f47] mb-4">Comparison</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{data.h1}</h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">{data.intro}</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#8b6f47] hover:bg-[#7a6040] text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm">
            Try HumanifyLab Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0f1419] text-white">
                  <th className="text-left px-6 py-4 font-semibold">Feature</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-400">Competitor</th>
                  <th className="text-center px-6 py-4 font-semibold text-[#8b6f47]">HumanifyLab ✦</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-medium text-gray-700">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{row.competitor}</td>
                    <td className="px-6 py-4 text-center font-semibold text-[#5e3d2a]">{row.humanifylab}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Switch */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Switch to HumanifyLab?</h2>
          <div className="space-y-4">
            {data.whySwitchPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-[#faf7f4] rounded-xl border border-[#e8ddd5]">
                <Check className="w-5 h-5 text-[#5e3d2a] flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#0f1419] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{data.cta}</h2>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#8b6f47] hover:bg-[#7a6040] text-white font-semibold px-8 py-4 rounded-xl transition-colors">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
