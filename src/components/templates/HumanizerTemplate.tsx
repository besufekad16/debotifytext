"use client";

import Link from "next/link";
import { Sparkles, Zap, Target, Users, Lock, Star, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { HumanizerPageData } from "~/lib/content/humanizer-content";

interface Props { data: HumanizerPageData; }

export default function HumanizerTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero — clean, bright, product-focused */}
      <section className="border-b bg-gradient-to-br from-[#fefce8] via-white to-[#f0f9ff] px-4 py-8 text-center sm:px-6 sm:py-12 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#8B6F47]/10 px-4 py-1.5 text-sm font-semibold text-[#6D5635]">
            <Sparkles className="h-4 w-4" />
            {data.badgeText}
          </div>
          <h1 className="mb-5 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.h1}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 leading-relaxed sm:text-xl">
            {data.heroSubtitle}
          </p>

          {/* Social proof bar */}
          <div className="mb-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 sm:gap-8">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="font-semibold text-gray-700">4.9/5</span> from 12,000+ reviews
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#6D5635]" />
              <span className="font-semibold text-gray-700">450,000+</span> active users
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-[#6D5635]" />
              <span className="font-semibold text-gray-700">99.9%</span> bypass rate
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="min-h-[44px] w-full rounded-full bg-gradient-to-r from-[#8B6F47] via-[#6D5635] to-[#1d4ed8] px-8 py-3 text-base font-bold text-white hover:opacity-90 shadow-lg sm:w-auto sm:py-6 sm:text-lg">
                Try {data.toolName} Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="min-h-[44px] w-full rounded-full border-2 border-[#6D5635] px-8 py-3 text-base font-semibold text-[#6D5635] hover:bg-[#6D5635] hover:text-white sm:w-auto sm:py-6 sm:text-lg">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What it does — feature grid */}
      <section className="border-b px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{data.featuresTitle}</h2>
          <p className="mb-10 text-center text-base text-gray-500">{data.featuresSubtitle}</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.features.map((f, i) => (
              <div key={i} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#8B6F47]/30 hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B6F47]/10 to-[#6D5635]/10">
                  <span className="block h-2.5 w-2.5 rounded-full bg-[#8b6f47]" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
                <p className="text-base text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported detectors */}
      <section className="border-b bg-gray-50 px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">{data.detectorsTitle}</h2>
          <p className="mb-10 text-base text-gray-500">{data.detectorsSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {data.supportedDetectors.map((d, i) => (
              <div key={i} className="flex min-h-[44px] items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                {d}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{data.howItWorksTitle}</h2>
          <div className="relative space-y-8">
            {data.steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B6F47] to-[#c9a96e] text-sm font-black text-white">
                    {i + 1}
                  </div>
                  {i < data.steps.length - 1 && <div className="mt-2 h-full w-0.5 bg-gray-200" />}
                </div>
                <div className="pb-8">
                  <h3 className="mb-1 font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b bg-gray-50 px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{data.testimonialsTitle}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex gap-1">
                  {[1,2,3,4,5].map(j => <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="mb-4 text-base italic text-gray-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{data.faqTitle}</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
                  {faq.q}
                  <span className="ml-4 text-[#6D5635] transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-base leading-relaxed text-gray-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#8B6F47] via-[#6D5635] to-[#1d4ed8] px-4 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-2xl">
          <TrendingUp className="mx-auto mb-6 h-14 w-14 opacity-80" />
          <h2 className="mb-4 text-3xl font-black sm:text-4xl">{data.finalCtaTitle}</h2>
          <p className="mb-8 text-base text-white/80">{data.finalCtaSubtitle}</p>
          <Link href="/" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="min-h-[44px] w-full rounded-full bg-white px-10 py-4 text-lg font-black text-[#6D5635] hover:bg-gray-100 shadow-xl sm:w-auto sm:py-6 sm:text-xl">
              Start Free — No Credit Card
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
