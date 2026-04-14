"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, Star } from "lucide-react";

// Generic V4 page data — all 10 clusters share this shape
export interface V4PageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  // Optional cluster-specific fields
  competitor?: string;
  subject?: string;
  aiTool?: string;
  detector?: string;
  contentType?: string;
  platform?: string;
  verdict?: string;
  ratingValue?: string;
  ratingCount?: string;
  pros?: string[];
  cons?: string[];
  answer?: string;
  comparisonRows?: { feature: string; humanifylab: string; competitor: string; winner: 'humanifylab' | 'tie' }[];
  whyBetterPoints?: { icon: string; title: string; description: string }[];
  whySwitchPoints?: { icon: string; title: string; description: string }[];
  howItWorks?: { icon: string; title: string; description: string }[];
  features?: { icon: string; title: string; description: string }[];
  steps?: { number: string; title: string; description: string }[];
  stats?: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

interface Props {
  data: V4PageData;
  cluster: string;
}

export default function V4Template({ data, cluster }: Props) {
  const points = data.whyBetterPoints ?? data.whySwitchPoints ?? data.howItWorks ?? data.features ?? [];
  const steps = data.steps ?? [];
  const stats = data.stats ?? [];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-950 to-gray-900 text-white py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-full px-3 py-1 mb-4">
            {data.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
            {data.h1}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            {data.heroSubtitle}
          </p>

          {/* Answer pill for detection cluster */}
          {data.answer && (
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
              <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span className="text-green-300 text-sm font-medium">{data.answer}</span>
            </div>
          )}

          {/* Stats row */}
          {stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-6 py-3 text-sm font-bold text-white transition-all"
            >
              Try Free — No Sign-Up <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-white/40 px-6 py-3 text-sm font-medium text-white/80 transition-all"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Review rating for review cluster */}
      {data.ratingValue && data.ratingCount && (
        <section className="bg-amber-50 border-b border-amber-100 py-6 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`h-5 w-5 ${parseFloat(data.ratingValue!) >= i ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">{data.ratingValue}</span>
              <span className="text-gray-500 text-sm ml-2">/ 5 · {parseInt(data.ratingCount!).toLocaleString()} reviews</span>
            </div>
            {data.verdict && (
              <p className="text-sm text-gray-600 max-w-md italic">"{data.verdict}"</p>
            )}
          </div>
        </section>
      )}

      {/* Pros & Cons for review cluster */}
      {data.pros && data.cons && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-green-200 p-6">
              <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-4">✓ Pros</h3>
              <ul className="space-y-2">
                {data.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-red-200 p-6">
              <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-4">✗ Cons</h3>
              <ul className="space-y-2">
                {data.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">×</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Comparison table for comparison cluster */}
      {data.comparisonRows && data.comparisonRows.length > 0 && (
        <section className="py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              HumanifyLab vs {data.competitor}: Side-by-Side
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">Every metric that matters</p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Feature</th>
                    <th className="text-center px-4 py-3 font-semibold text-violet-700">HumanifyLab</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-500">{data.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparisonRows.map((row, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3 text-gray-700 font-medium">{row.feature}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {row.humanifylab}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500">{row.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Why better / why switch / how it works / features */}
      {points.length > 0 && (
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {cluster === 'comparison' ? `Why HumanifyLab Beats ${data.competitor}` :
               cluster === 'alternative' ? `Why Switch to HumanifyLab` :
               cluster === 'detection' ? 'How AI Detection Works — And How HumanifyLab Beats It' :
               'Why HumanifyLab'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {points.map((p, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                  <span className="text-2xl flex-shrink-0">{p.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <section className="py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-black text-lg flex items-center justify-center mx-auto mb-3">
                    {s.number}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{data.faqTitle}</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 to-purple-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <Shield className="h-10 w-10 mx-auto mb-4 text-white/70" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">{data.finalCtaTitle}</h2>
          <p className="text-white/80 mb-6 text-sm">{data.finalCtaSubtitle}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-violet-700 hover:bg-violet-50 px-8 py-3 text-sm font-bold transition-all"
          >
            <Zap className="h-4 w-4" />
            Start Free — No Sign-Up Required
          </Link>
        </div>
      </section>
    </main>
  );
}
