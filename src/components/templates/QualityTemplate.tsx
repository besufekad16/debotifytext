"use client";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { QualityContentData } from "~/lib/content/quality-content";

export default function QualityTemplate({ data }: { data: QualityContentData }) {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#0f1419] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#8b6f47] mb-4">{data.badge}</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{data.h1}</h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">{data.heroSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {data.stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-extrabold text-[#8b6f47]">{s.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#8b6f47] hover:bg-[#7a6040] text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm">
            Try Free — No Sign-up <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.qualityPoints.map((p, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                <span className="text-2xl mb-3 block">{p.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">{data.stepsTitle}</h2>
          <div className="space-y-6">
            {data.steps.map((step, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-[#8b6f47] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{step.number}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{data.beforeAfterTitle}</h2>
          <div className="space-y-6">
            {data.beforeAfter.map((ba, i) => (
              <div key={i}>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{ba.label}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="text-xs font-bold text-red-500 mb-2">Before — AI Detected</div>
                    <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{ba.before}&rdquo;</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <div className="text-xs font-bold text-green-600 mb-2">After — 0% AI Score</div>
                    <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{ba.after}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{data.faqTitle}</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#0f1419] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#8b6f47] text-[#8b6f47]" />)}
          </div>
          <h2 className="text-2xl font-bold mb-3">{data.finalCtaTitle}</h2>
          <p className="text-gray-400 mb-6">{data.finalCtaSubtitle}</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#8b6f47] hover:bg-[#7a6040] text-white font-semibold px-8 py-4 rounded-xl transition-colors">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
