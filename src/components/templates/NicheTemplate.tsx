"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { NicheContentData } from "~/lib/content/niche-content";

export default function NicheTemplate({ data }: { data: NicheContentData }) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero — clean minimal card */}
      <section className="py-16 px-4 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-200 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Specialized Use Case
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{data.h1}</h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto mb-8">{data.intro}</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm">
            Try Free Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Use case points — card grid */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">Why It Works for This Use Case</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.useCasePoints.map((point, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 text-sm font-bold flex items-center justify-center mb-3">{i + 1}</div>
                <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">FAQ</h2>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">{data.cta}</h2>
          <Link href="/" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-4 rounded-xl transition-colors">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
