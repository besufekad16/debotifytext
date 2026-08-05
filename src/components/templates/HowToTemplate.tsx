"use client";

import Link from "next/link";
import { BookOpen, Clock, ArrowRight, CheckCircle2, Info, Lightbulb, AlertCircle, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { HowToPageData } from "~/lib/content/howto-content";

interface Props { data: HowToPageData; }

export default function HowToTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-white">

      {/* Article header */}
      <header className="border-b bg-gradient-to-b from-[#f8f4ef] to-white px-4 py-8 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="rounded-full bg-[var(--hl-mint-deep)]/10 px-3 py-1 font-medium text-[var(--hl-mint)]">{data.category}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {data.readTime} min read</span>
            <span>Updated {data.updatedDate}</span>
          </div>
          <h1 className="mb-5 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.h1}
          </h1>
          <p className="mb-6 text-base text-gray-600 leading-relaxed sm:text-lg">{data.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="min-h-[44px] w-full rounded-full bg-[var(--hl-mint)] px-6 py-2.5 font-semibold text-white hover:bg-[var(--hl-mint-deep)] sm:w-auto">
                Try HumanifyLab Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Table of contents */}
      <div className="border-b bg-[#fafaf8] px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-[var(--hl-mint-deep)]/20 bg-white p-6">
            <div className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <BookOpen className="h-5 w-5 text-[var(--hl-mint)]" />
              Table of Contents
            </div>
            <ol className="space-y-2 text-sm">
              {data.tocItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[var(--hl-mint)] hover:underline cursor-pointer">
                  <span className="font-mono text-xs text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Main article content */}
      <article className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-12">

          {/* Key takeaways */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <div className="mb-3 flex items-center gap-2 font-semibold text-blue-800">
              <Info className="h-5 w-5" />
              Key Takeaways
            </div>
            <ul className="space-y-2">
              {data.keyTakeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-base text-blue-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-step guide */}
          <div>
            <h2 className="mb-8 text-xl font-bold text-gray-900 sm:text-2xl">{data.stepsTitle}</h2>
            <div className="space-y-8">
              {data.steps.map((step, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--hl-mint-deep)] to-[#a67c52] text-sm font-black text-white">
                      {i + 1}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 sm:text-lg">{step.title}</h3>
                  </div>
                  <p className="mb-4 text-base text-gray-600 leading-relaxed">{step.description}</p>
                  {step.tip && (
                    <div className="flex items-start gap-2 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
                      <span><strong>Pro tip:</strong> {step.tip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Warning / important note */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">
            <div className="mb-3 flex items-center gap-2 font-semibold text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Important Note
            </div>
            <p className="text-base text-orange-700 leading-relaxed">{data.importantNote}</p>
          </div>

          {/* Why HumanifyLab */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">{data.whyHumanifyLabTitle}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.whyPoints.map((p, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--hl-mint)]" />
                  <div>
                    <p className="font-semibold text-gray-900">{p.title}</p>
                    <p className="text-base text-gray-500">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-[var(--hl-mint-deep)] to-[var(--hl-mint)] p-6 text-center text-white sm:p-8">
            <h3 className="mb-3 text-xl font-bold sm:text-2xl">{data.inlineCtaTitle}</h3>
            <p className="mb-6 text-base text-white/80">{data.inlineCtaSubtitle}</p>
            <Link href="/" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="min-h-[44px] w-full rounded-full bg-white px-8 py-3 font-bold text-[var(--hl-mint)] hover:bg-gray-100 sm:w-auto sm:py-5">
                Try HumanifyLab Free Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">{data.faqTitle}</h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <details key={i} className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between font-semibold text-gray-900">
                    {faq.q}
                    <span className="ml-4 text-[var(--hl-mint)] transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-4 text-base leading-relaxed text-gray-500">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Related guides */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Related Guides</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.relatedGuides.map((g, i) => (
                <Link key={i} href={`/${g.slug}`} className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-[var(--hl-mint-deep)]/30 hover:shadow-md">
                  <p className="font-semibold text-gray-900 group-hover:text-[var(--hl-mint)]">{g.title}</p>
                  <p className="mt-1 text-xs text-gray-400">{g.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
