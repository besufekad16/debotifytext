"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, Star } from "lucide-react";

export interface V4PageData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
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
  comparisonRows?: { feature: string; humanifylab: string; competitor: string; winner: "humanifylab" | "tie" }[];
  whyBetterPoints?: { icon: string; title: string; description: string }[];
  whySwitchPoints?: { icon: string; title: string; description: string }[];
  howItWorks?: { icon: string; title: string; description: string }[];
  features?: { icon: string; title: string; description: string }[];
  steps?: { number: string; title: string; description: string }[];
  stats?: { value: string; label: string }[];
  guideIntro?: string;
  guideSections?: { title: string; body: string }[];
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
      <section className="bg-[var(--hl-ink)] px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full border border-[var(--hl-mint-bright)]/30 bg-[var(--hl-mint-bright)]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--hl-mint-bright)]">
            {data.badge}
          </span>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {data.h1}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {data.heroSubtitle}
          </p>

          {data.answer && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--hl-mint-bright)]/30 bg-[var(--hl-mint)]/10 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[var(--hl-mint-bright)]" />
              <span className="text-sm font-medium text-[var(--hl-mint-bright)]">{data.answer}</span>
            </div>
          )}

          {stats.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="mt-0.5 text-xs text-white/45">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--hl-mint-deep)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--hl-mint)]"
            >
              Try Free — No Sign-Up <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing#lifetime"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition-all hover:border-white/40"
            >
              Lifetime Deal
            </Link>
          </div>
        </div>
      </section>

      {/* Deep guide — critical for indexing / ranking */}
      {(data.guideIntro || (data.guideSections && data.guideSections.length > 0)) && (
        <section className="border-b border-black/5 bg-[var(--hl-surface)] px-4 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-[var(--hl-ink)]">
              Complete guide: how to humanize AI text &amp; score 0% AI
            </h2>
            {data.guideIntro && (
              <p className="mb-8 text-base leading-relaxed text-gray-600">{data.guideIntro}</p>
            )}
            <div className="space-y-6">
              {(data.guideSections ?? []).map((section, i) => (
                <article key={i} className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
                  <h3 className="mb-2 text-lg font-semibold text-[var(--hl-ink)]">{section.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-[15px]">{section.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.ratingValue && data.ratingCount && (
        <section className="border-b border-amber-100 bg-amber-50 px-4 py-6">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${parseFloat(data.ratingValue!) >= i ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <div>
              <span className="text-2xl font-black text-gray-900">{data.ratingValue}</span>
              <span className="ml-2 text-sm text-gray-500">
                / 5 · {parseInt(data.ratingCount!).toLocaleString()} reviews
              </span>
            </div>
            {data.verdict && <p className="max-w-md text-sm italic text-gray-600">&quot;{data.verdict}&quot;</p>}
          </div>
        </section>
      )}

      {data.pros && data.cons && (
        <section className="bg-gray-50 px-4 py-12">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--hl-mint)]/25 bg-white p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--hl-mint-deep)]">Pros</h3>
              <ul className="space-y-2">
                {data.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--hl-mint)]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-red-200 bg-white p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-red-600">Cons</h3>
              <ul className="space-y-2">
                {data.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 flex-shrink-0 font-bold text-red-400">×</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {data.comparisonRows && data.comparisonRows.length > 0 && (
        <section className="px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
              HumanifyLab vs {data.competitor}: Side-by-Side
            </h2>
            <p className="mb-8 text-center text-sm text-gray-500">Every metric that matters</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Feature</th>
                    <th className="px-4 py-3 text-center font-semibold text-[var(--hl-mint-deep)]">HumanifyLab</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500">{data.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparisonRows.map((row, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-3 font-medium text-gray-700">{row.feature}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 font-semibold text-[var(--hl-mint-deep)]">
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

      {points.length > 0 && (
        <section className="bg-[var(--hl-surface)] px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
              {cluster === "comparison"
                ? `Why HumanifyLab Beats ${data.competitor}`
                : cluster === "alternative"
                  ? "Why Switch to HumanifyLab"
                  : cluster === "detection"
                    ? "How AI Detection Works — And How HumanifyLab Beats It"
                    : "Why HumanifyLab"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {points.map((p, i) => (
                <div key={i} className="flex gap-4 rounded-2xl border border-black/5 bg-white p-5">
                  <span className="mt-1.5 block h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--hl-mint-deep)]" />
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-900">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {steps.length > 0 && (
        <section className="px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">How It Works</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--hl-mint-deep)]/10 text-lg font-black text-[var(--hl-mint-deep)]">
                    {s.number}
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-xs leading-relaxed text-gray-500">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gray-50 px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">{data.faqTitle}</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--hl-mint-deep)] px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <Shield className="mx-auto mb-4 h-10 w-10 text-white/70" />
          <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">{data.finalCtaTitle}</h2>
          <p className="mb-6 text-sm text-white/80">{data.finalCtaSubtitle}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3 text-sm font-bold text-[var(--hl-mint-deep)] transition-all hover:bg-[var(--hl-surface)]"
          >
            <Zap className="h-4 w-4" />
            Start Free — No Sign-Up Required
          </Link>
        </div>
      </section>
    </main>
  );
}
