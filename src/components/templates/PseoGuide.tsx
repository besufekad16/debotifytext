import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Clock, CalendarSync, Sparkles, BookOpen } from "lucide-react";
import type { KeywordEntry, PseoPageData } from "~/lib/pseo/types";
import { CLUSTER_META } from "~/lib/pseo/clusters";

interface Props {
  entry: KeywordEntry;
  data: PseoPageData;
}

export default function PseoGuide({ entry, data }: Props) {
  const cluster = CLUSTER_META[entry.cluster];

  return (
    <main className="bg-[var(--hl-cream)] text-[var(--hl-ink)]">
      <nav aria-label="Breadcrumb" className="border-b border-black/5 bg-white/80 px-4 py-2.5 backdrop-blur">
        <ol className="mx-auto flex max-w-3xl flex-wrap items-center gap-1 text-xs text-black/50 sm:text-sm">
          <li><Link href="/" className="hover:text-[var(--hl-mint-deep)]">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/topics" className="hover:text-[var(--hl-mint-deep)]">Guides</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href={`/topics/${entry.cluster}`} className="hover:text-[var(--hl-mint-deep)]">{cluster.label}</Link></li>
          <li aria-hidden="true">/</li>
          <li className="max-w-[60%] truncate font-medium text-[var(--hl-ink)]" aria-current="page">{data.h1}</li>
        </ol>
      </nav>

      <header className="bg-[var(--hl-ink)] px-4 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--hl-mint-bright)]">
            {data.eyebrow}
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.6rem]">
            {data.h1}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/60 sm:text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarSync className="h-4 w-4" /> Updated: {new Date(data.updatedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {data.readTime} min read
            </span>
          </div>
          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">{data.heroSubtitle}</p>
          <p id="direct-answer" className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/90 sm:text-base">
            {data.directAnswer}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 px-3 py-3">
                <p className="text-sm font-semibold text-white">{s.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--hl-mint-deep)] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[var(--hl-mint)]"
            >
              Try free on HumanifyLab <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3.5 text-sm font-medium text-white/80 hover:border-white/40"
            >
              View plans
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <section className="rounded-2xl border border-black/5 bg-white p-5 sm:p-7">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-[var(--hl-mint-deep)]" /> Key takeaways
          </h2>
          <ul className="mt-4 space-y-3">
            {data.takeaways.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-black/70 sm:text-base">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hl-mint-deep)]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {data.sections.map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-black/70">{section.body}</p>
          </section>
        ))}

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">How to do this in HumanifyLab</h2>
          <ol className="mt-6 space-y-4">
            {data.steps.map((step) => (
              <li key={step.number} className="flex gap-4 rounded-2xl border border-black/5 bg-white p-4 sm:p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--hl-ink)] text-sm font-semibold text-white">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-black/65 sm:text-base">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 overflow-x-auto rounded-2xl border border-black/5 bg-white">
          <h2 className="px-5 pt-5 text-xl font-semibold tracking-tight sm:px-6">Page snapshot</h2>
          <table className="mt-3 min-w-full text-left text-sm">
            <tbody>
              {data.table.map((row) => (
                <tr key={row.label} className="border-t border-black/5">
                  <th className="whitespace-nowrap px-5 py-3 font-medium text-black/50 sm:px-6">{row.label}</th>
                  <td className="px-5 py-3 text-[var(--hl-ink)] sm:px-6">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-10 rounded-2xl border border-black/5 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-semibold tracking-tight">{data.exampleTitle}</h2>
          <p className="mt-3 text-base leading-relaxed text-black/70">{data.exampleBody}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Mistakes that still get flagged</h2>
          <ul className="mt-4 space-y-3">
            {data.mistakes.map((m) => (
              <li key={m} className="flex gap-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-black/70 sm:text-base">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hl-mint)]" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
            {data.faqs.map((faq) => (
              <details key={faq.q} className="group px-5 py-4 sm:px-6">
                <summary className="cursor-pointer list-none font-medium leading-snug [&::-webkit-details-marker]:hidden">
                  {faq.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-black/65 sm:text-base">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-[var(--hl-mint-deep)]/20 bg-[var(--hl-mint-deep)]/5 p-5 sm:p-7">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-[var(--hl-ink)]">
            <BookOpen className="h-5 w-5 text-[var(--hl-mint-deep)]" /> Related Guides
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between rounded-xl bg-white p-4 text-sm font-medium text-[var(--hl-ink)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="line-clamp-1">{link.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-black/20 transition-transform group-hover:translate-x-1 group-hover:text-[var(--hl-mint-deep)]" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-[var(--hl-ink)] px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight">{data.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">{data.ctaSubtitle}</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--hl-mint-deep)] px-6 py-3.5 text-sm font-semibold hover:bg-[var(--hl-mint)]"
          >
            Open the humanizer <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs text-white/40">
            <Link href="/responsible-use" className="underline-offset-2 hover:underline">Responsible use</Link>
            {" · "}
            <Link href="/pricing" className="underline-offset-2 hover:underline">Pricing</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
