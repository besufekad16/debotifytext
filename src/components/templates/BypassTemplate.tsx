"use client";

import Link from "next/link";
import { Shield, CheckCircle2, XCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

export interface BypassPageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  detectorName: string;
  stats: { value: string; label: string }[];
  howDetectorWorksTitle: string;
  howDetectorWorksIntro: string;
  detectorMechanisms: { icon: string; title: string; description: string }[];
  beforeAfterTitle: string;
  beforeScore: number;
  afterScore: number;
  beforeText: string;
  afterText: string;
  stepsTitle: string;
  steps: { title: string; description: string }[];
  comparisonTitle: string;
  comparisonRows: { feature: string; humanifylab: string; others: string }[];
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

interface Props { data: BypassPageData; }

export default function BypassTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <PageNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0a0a0f] via-[#12121f] to-[#0a0a0f] px-4 py-8 text-center sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(109,86,53,0.15)_0%,_transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400">
            <AlertTriangle className="h-4 w-4" />
            {data.detectorName} AI Detection Active
          </div>
          <h1 className="mb-6 text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            {data.h1}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            {data.heroSubtitle}
          </p>
          <div className="mb-10 grid grid-cols-2 gap-4 text-sm sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
            {data.stats.map((s: { value: string; label: string }, i: number) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl font-black text-[#c9a96e]">{s.value}</span>
                <span className="text-white/50">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="min-h-[44px] w-full rounded-full bg-gradient-to-r from-[#8B6F47] to-[#c9a96e] px-8 py-3 text-base font-bold text-black hover:opacity-90 sm:w-auto sm:py-6 sm:text-lg">
                Bypass {data.detectorName} Now — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="min-h-[44px] w-full rounded-full border-white/20 px-8 py-3 text-base text-white hover:bg-white/10 sm:w-auto sm:py-6 sm:text-lg">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How the detector works */}
      <section className="border-b border-white/10 bg-[#0d0d18] px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">{data.howDetectorWorksTitle}</h2>
          <p className="mb-10 text-center text-base text-white/60">{data.howDetectorWorksIntro}</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.detectorMechanisms.map((m: { icon: string; title: string; description: string }, i: number) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 text-3xl">{m.icon}</div>
                <h3 className="mb-2 font-semibold text-white">{m.title}</h3>
                <p className="text-base text-white/60">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="border-b border-white/10 px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{data.beforeAfterTitle}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
              <div className="mb-3 flex items-center gap-2 text-red-400">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">Before HumanifyLab</span>
              </div>
              <div className="mb-3 rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-400">
                {data.detectorName} Score: {data.beforeScore}% AI
              </div>
              <p className="text-base italic text-white/50 leading-relaxed">&ldquo;{data.beforeText}&rdquo;</p>
            </div>
            <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6">
              <div className="mb-3 flex items-center gap-2 text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">After HumanifyLab</span>
              </div>
              <div className="mb-3 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-bold text-green-400">
                {data.detectorName} Score: {data.afterScore}% AI
              </div>
              <p className="text-base italic text-white/50 leading-relaxed">&ldquo;{data.afterText}&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-white/10 bg-[#0d0d18] px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{data.stepsTitle}</h2>
          <div className="space-y-6">
            {data.steps.map((step: { title: string; description: string }, i: number) => (
              <div key={i} className="flex gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B6F47] to-[#c9a96e] text-sm font-black text-black">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-white">{step.title}</h3>
                  <p className="text-base text-white/60">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="min-h-[44px] w-full rounded-full bg-gradient-to-r from-[#8B6F47] to-[#c9a96e] px-8 py-3 font-bold text-black hover:opacity-90 sm:w-auto sm:py-5">
                Start Bypassing {data.detectorName} — Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-b border-white/10 px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{data.comparisonTitle}</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold text-white/70 sm:px-5">Feature</th>
                  <th className="px-4 py-4 text-left font-semibold text-[#c9a96e] sm:px-5">HumanifyLab</th>
                  <th className="px-4 py-4 text-left font-semibold text-white/50 sm:px-5">Others</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonRows.map((row: { feature: string; humanifylab: string; others: string }, i: number) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-4 py-4 font-medium text-white sm:px-5">{row.feature}</td>
                    <td className="px-4 py-4 text-green-400 sm:px-5">
                      <CheckCircle2 className="mr-1.5 inline h-4 w-4" />{row.humanifylab}
                    </td>
                    <td className="px-4 py-4 text-white/40 sm:px-5">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-white/10 bg-[#0d0d18] px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{data.faqTitle}</h2>
          <div className="space-y-6">
            {data.faqs.map((faq: { q: string; a: string }, i: number) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 font-semibold text-white">{faq.q}</h3>
                <p className="text-base leading-relaxed text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl">
          <Shield className="mx-auto mb-6 h-16 w-16 text-[#c9a96e]" />
          <h2 className="mb-4 text-3xl font-black sm:text-4xl">{data.finalCtaTitle}</h2>
          <p className="mb-8 text-base text-white/60">{data.finalCtaSubtitle}</p>
          <Link href="/" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="min-h-[44px] w-full rounded-full bg-gradient-to-r from-[#8B6F47] to-[#c9a96e] px-10 py-4 text-lg font-black text-black hover:opacity-90 sm:w-auto sm:py-6 sm:text-xl">
              Bypass {data.detectorName} — Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
