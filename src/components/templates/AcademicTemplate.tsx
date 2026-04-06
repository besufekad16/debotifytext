"use client";
import Link from "next/link";
import { ShieldCheck, ArrowRight, BookOpen } from "lucide-react";
import type { AcademicContentData } from "~/lib/content/academic-content";

export default function AcademicTemplate({ data }: { data: AcademicContentData }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — clean academic blue */}
      <section className="bg-gradient-to-br from-[#1a2744] to-[#2d4a8a] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-300" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">Academic Writing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{data.h1}</h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mb-8">{data.intro}</p>
          <div className="flex flex-wrap gap-3 mb-8">
            {['Turnitin Safe', 'GPTZero Safe', 'Originality.AI Safe', 'Free to Try'].map(badge => (
              <span key={badge} className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5" /> {badge}
              </span>
            ))}
          </div>
          <Link href="/" className="inline-flex items-center gap-2 bg-white text-[#1a2744] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-sm">
            Humanize My Paper <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {data.steps.map((step, i) => (
              <div key={i} className="flex gap-4 p-5 bg-[#f0f4ff] rounded-xl border border-[#d0daf5]">
                <div className="w-8 h-8 rounded-full bg-[#2d4a8a] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{step.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Points */}
      <section className="py-16 px-4 bg-[#f8faff]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Academics Trust HumanifyLab</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.trustPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#d0daf5]">
                <ShieldCheck className="w-4 h-4 text-[#2d4a8a] flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Academic FAQ</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="border-l-4 border-[#2d4a8a] pl-5 py-2">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#1a2744] to-[#2d4a8a] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{data.cta}</h2>
          <Link href="/" className="inline-flex items-center gap-2 bg-white text-[#1a2744] font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors">
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
