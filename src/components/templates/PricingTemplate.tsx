"use client";
import Link from "next/link";
import { Check, ArrowRight, Star } from "lucide-react";
import type { PricingPageData } from "~/lib/content/pricing-content";

export default function PricingTemplate({ data }: { data: PricingPageData }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#0f1419] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--hl-mint-deep)] mb-4">{data.badge}</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{data.h1}</h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">{data.heroSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {data.stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-extrabold text-[var(--hl-mint-deep)]">{s.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
          <Link href="/" className="inline-flex items-center gap-2 bg-[var(--hl-mint-deep)] hover:bg-[var(--hl-mint)] text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm">
            Start Free — No Credit Card <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">{data.plansTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.plans.map((plan, i) => (
              <div key={i} className={`rounded-2xl border p-6 flex flex-col ${plan.highlighted ? "border-[var(--hl-mint-deep)] bg-[#0f1419] text-white shadow-xl" : "border-gray-200 bg-white"}`}>
                {plan.highlighted && <div className="text-xs font-bold uppercase tracking-widest text-[var(--hl-mint-deep)] mb-2">Most Popular</div>}
                <div className="text-xl font-bold mb-1">{plan.name}</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl font-extrabold">{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-gray-400" : "text-gray-500"}`}>{plan.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-[var(--hl-mint-deep)]" : "text-[var(--hl-mint)]"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/" className={`text-center font-semibold px-6 py-3 rounded-xl transition-colors text-sm ${plan.highlighted ? "bg-[var(--hl-mint-deep)] hover:bg-[var(--hl-mint)] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">{data.valueTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.valueProps.map((v, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-[#faf6f1] rounded-xl border border-[rgba(94,61,42,0.18)]">
                <span className="mt-1.5 block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--hl-mint-deep)]" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{v.title}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{data.comparisonTitle}</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0f1419] text-white">
                  <th className="text-left px-6 py-4 font-semibold">Feature</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-400">Others</th>
                  <th className="text-center px-6 py-4 font-semibold text-[var(--hl-mint-deep)]">HumanifyLab ✦</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-medium text-gray-700">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{row.others}</td>
                    <td className="px-6 py-4 text-center font-semibold text-[var(--hl-mint-deep)]">{row.humanifylab}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* Final CTA */}
      <section className="py-16 px-4 bg-[#0f1419] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[var(--hl-mint-deep)] text-[var(--hl-mint-deep)]" />)}
          </div>
          <h2 className="text-2xl font-bold mb-3">{data.finalCtaTitle}</h2>
          <p className="text-gray-400 mb-6">{data.finalCtaSubtitle}</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[var(--hl-mint-deep)] hover:bg-[var(--hl-mint)] text-white font-semibold px-8 py-4 rounded-xl transition-colors">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
