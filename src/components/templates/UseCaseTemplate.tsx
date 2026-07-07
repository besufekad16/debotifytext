"use client";

import Link from "next/link";
import { GraduationCap, Briefcase, PenTool, ArrowRight, CheckCircle2, Star, Users, Zap, Shield } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { UseCasePageData } from "~/lib/content/usecase-content";

interface Props { data: UseCasePageData; }

const audienceIcons: Record<string, React.ReactNode> = {
  student: <GraduationCap className="h-8 w-8" />,
  business: <Briefcase className="h-8 w-8" />,
  writer: <PenTool className="h-8 w-8" />,
  default: <Users className="h-8 w-8" />,
};

export default function UseCaseTemplate({ data }: Props) {
  const icon = audienceIcons[data.audienceType] ?? audienceIcons.default;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f4ef] via-white to-white">

      {/* Hero — audience-specific, empathetic */}
      <section className="border-b px-4 py-8 sm:py-12 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B6F47] to-[#c9a96e] text-white shadow-lg">
            {icon}
          </div>
          <div className="mb-4 inline-block rounded-full bg-[#8B6F47]/10 px-4 py-1.5 text-sm font-semibold text-[#6D5635]">
            Built for {data.audienceLabel}
          </div>
          <h1 className="mb-5 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
            {data.h1}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 leading-relaxed sm:text-xl">
            {data.heroSubtitle}
          </p>

          {/* Pain points addressed */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {data.painPointBadges.map((p, i) => (
              <span key={i} className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm">
                ✓ {p}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button size="lg" className="min-h-[44px] w-full rounded-full bg-gradient-to-r from-[#8B6F47] to-[#6D5635] px-8 py-3 text-base font-bold text-white hover:opacity-90 shadow-lg sm:w-auto sm:py-6 sm:text-lg">
                Start Free — Made for {data.audienceLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="min-h-[44px] w-full rounded-full border-2 border-[#6D5635] px-8 py-3 text-base font-semibold text-[#6D5635] hover:bg-[#6D5635] hover:text-white sm:w-auto sm:py-6 sm:text-lg">
                See Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The problem this audience faces */}
      <section className="border-b bg-white px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{data.problemTitle}</h2>
          <p className="mb-10 text-center text-base text-gray-500">{data.problemIntro}</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.problems.map((p, i) => (
              <div key={i} className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <div className="mb-3 text-2xl">{p.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{p.title}</h3>
                <p className="text-base text-gray-500">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The solution */}
      <section className="border-b bg-[#f8f4ef] px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{data.solutionTitle}</h2>
          <p className="mb-10 text-center text-base text-gray-500">{data.solutionIntro}</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.solutions.map((s, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl border border-[#8B6F47]/20 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B6F47]/10 to-[#6D5635]/10 text-xl">
                  {s.icon}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-base text-gray-500">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specific use case workflow */}
      <section className="border-b bg-white px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{data.workflowTitle}</h2>
          <div className="space-y-6">
            {data.workflowSteps.map((step, i) => (
              <div key={i} className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B6F47] to-[#c9a96e] text-sm font-black text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-base text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials from this audience */}
      <section className="border-b bg-[#f8f4ef] px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{data.testimonialsTitle}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-[#8B6F47]/10 bg-white p-6 shadow-sm">
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

      {/* Pricing callout */}
      <section className="border-b bg-white px-4 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">{data.pricingTitle}</h2>
          <p className="mb-8 text-base text-gray-500">{data.pricingSubtitle}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {data.pricingTiers.map((tier, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${i === 1 ? 'border-[#8B6F47] bg-gradient-to-b from-[#8B6F47]/5 to-white shadow-lg' : 'border-gray-100 bg-white shadow-sm'}`}>
                {i === 1 && <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6D5635]">Most Popular</div>}
                <div className="mb-1 text-2xl font-black text-gray-900">{tier.price}</div>
                <div className="mb-4 text-sm text-gray-500">{tier.name}</div>
                <ul className="space-y-2 text-base text-gray-600">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/pricing" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="min-h-[44px] w-full rounded-full bg-[#6D5635] px-8 py-3 font-bold text-white hover:bg-[#8B6F47] sm:w-auto sm:py-5">
                View All Plans
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b bg-[#f8f4ef] px-4 py-8 sm:py-12 lg:py-16">
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

      {/* Final CTA */}
      <section className="px-4 py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B6F47] to-[#c9a96e] text-white shadow-lg">
            {icon}
          </div>
          <h2 className="mb-4 text-3xl font-black text-gray-900 sm:text-4xl">{data.finalCtaTitle}</h2>
          <p className="mb-8 text-base text-gray-500">{data.finalCtaSubtitle}</p>
          <Link href="/" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="min-h-[44px] w-full rounded-full bg-gradient-to-r from-[#8B6F47] to-[#6D5635] px-10 py-4 text-lg font-black text-white hover:opacity-90 shadow-xl sm:w-auto sm:py-6 sm:text-xl">
              Get Started Free — For {data.audienceLabel}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
