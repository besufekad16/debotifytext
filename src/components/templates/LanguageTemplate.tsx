"use client";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import type { LanguageContentData } from "~/lib/content/language-content";

export default function LanguageTemplate({ data }: { data: LanguageContentData }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — colorful international */}
      <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Globe className="w-3.5 h-3.5" /> Multilingual Support
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{data.h1}</h1>
          <p className="text-violet-100 text-base sm:text-lg max-w-2xl mx-auto mb-8">{data.intro}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {data.supportedDetectors.map(d => (
              <span key={d} className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30">{d} ✓</span>
            ))}
          </div>
          <Link href="/" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-xl hover:bg-violet-50 transition-colors text-sm">
            Try in Your Language <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Language features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Language-Specific Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.languageFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
                <span className="text-violet-500 font-bold text-sm flex-shrink-0">✦</span>
                <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
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
      <section className="py-16 px-4 bg-gradient-to-br from-violet-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <Globe className="w-10 h-10 text-violet-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{data.cta}</h2>
          <Link href="/" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-xl hover:bg-violet-50 transition-colors">
            Start Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
