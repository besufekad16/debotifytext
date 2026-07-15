import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import type { GeoContentData } from "~/lib/content/geo-content";

/**
 * Geo landing page template. Intentionally renders no emoji icons (the data
 * layer still carries them for backwards compatibility) — visual accents are
 * proper vector icons and typographic hierarchy instead.
 */
export default function GeoTemplate({ data }: { data: GeoContentData }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#0f1419] px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#8b6f47]/40 bg-[#8b6f47]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#c9a97f]">
            <MapPin className="h-3.5 w-3.5" />
            {data.badge}
          </span>
          <h1 className="mb-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {data.h1}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            {data.heroSubtitle}
          </p>
          <div className="mb-10 flex flex-wrap justify-center gap-x-10 gap-y-6">
            {data.stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold tracking-tight text-[#c9a97f] sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#8b6f47] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#7a6040]"
          >
            Try Free — No Sign-up
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* Why */}
      <section className="bg-[#faf7f4] px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {data.whyTitle}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {data.whyPoints.map((p, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 hover-lift">
                <div className="mb-3 h-1 w-8 rounded-full bg-[#8b6f47]" />
                <h3 className="mb-2 font-semibold text-gray-900">{p.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="bg-white px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {data.audienceTitle}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.audiencePoints.map((p, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-[#faf7f4] p-6 text-center">
                <h3 className="mb-2 font-semibold text-gray-900">{p.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detectors */}
      <section className="bg-[#faf7f4] px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {data.detectorsTitle}
          </h2>
          <div className="space-y-3">
            {data.detectors.map((d, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#8b6f47]" />
                <div>
                  <span className="font-semibold text-gray-900">{d.name}</span>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{d.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {data.stepsTitle}
          </h2>
          <div className="space-y-8">
            {data.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#5e3d2a] text-sm font-bold text-white">
                  {step.number}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-gray-500">{data.pricingNote}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#faf7f4] px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            {data.faqTitle}
          </h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="mb-2 font-semibold text-gray-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0f1419] px-5 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">{data.finalCtaTitle}</h2>
          <p className="mb-8 leading-relaxed text-gray-400">{data.finalCtaSubtitle}</p>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#8b6f47] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#7a6040]"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
