import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, CalendarSync, Clock, BookOpen } from "lucide-react";
import type { KeywordEntry, PseoPageData } from "~/lib/pseo/types";
import { CLUSTER_META } from "~/lib/pseo/clusters";

interface Props {
  entry: KeywordEntry;
  data: PseoPageData;
}

export default function PseoGuideListicle({ entry, data }: Props) {
  const cluster = CLUSTER_META[entry.cluster];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      <nav aria-label="Breadcrumb" className="bg-white px-4 py-3 shadow-sm">
        <ol className="mx-auto flex max-w-4xl flex-wrap items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-slate-800">Home</Link></li>
          <li aria-hidden="true">&gt;</li>
          <li><Link href="/topics" className="hover:text-slate-800">Guides</Link></li>
          <li aria-hidden="true">&gt;</li>
          <li><Link href={`/topics/${entry.cluster}`} className="hover:text-slate-800">{cluster.label}</Link></li>
        </ol>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <header className="mb-12 border-b border-slate-200 pb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-600">
            {data.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {data.h1}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarSync className="h-4 w-4" /> Updated: {new Date(data.updatedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {data.readTime} min read
            </span>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">{data.heroSubtitle}</p>
          
          <div className="mt-8 rounded-xl bg-slate-100 p-6 text-slate-700">
            <p id="direct-answer" className="text-base font-medium leading-relaxed">
              {data.directAnswer}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Start Humanizing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <article className="space-y-12">
              {data.sections.map((section, idx) => (
                <section key={section.title} className="scroll-mt-8" id={`section-${idx}`}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-black text-slate-200">{idx + 1}</span>
                    <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                  </div>
                  <p className="mt-4 text-lg leading-relaxed text-slate-700">{section.body}</p>
                </section>
              ))}

              <hr className="border-slate-200" />

              <section>
                <h2 className="text-2xl font-bold">{data.exampleTitle}</h2>
                <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-lg leading-relaxed text-slate-700">{data.exampleBody}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <div className="mt-6 space-y-6">
                  {data.faqs.map((faq) => (
                    <div key={faq.q} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                      <h3 className="font-bold text-slate-900">{faq.q}</h3>
                      <p className="mt-3 text-slate-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <BookOpen className="h-5 w-5 text-emerald-600" /> Related Guides
                </h2>
                <div className="mt-4 space-y-3">
                  {data.relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      <span className="line-clamp-1">{link.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
                    </Link>
                  ))}
                </div>
              </section>
            </article>
          </div>

          <aside className="space-y-8 lg:col-span-1">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-bold uppercase tracking-wider text-slate-900 text-sm">Key Takeaways</h3>
              <ul className="mt-4 space-y-4">
                {data.takeaways.map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-rose-50 p-6 ring-1 ring-rose-100">
              <h3 className="font-bold text-rose-900 text-sm uppercase tracking-wider">Common Mistakes</h3>
              <ul className="mt-4 space-y-4">
                {data.mistakes.map((m) => (
                  <li key={m} className="flex gap-3 text-sm text-rose-700">
                    <CircleAlert className="h-5 w-5 shrink-0 text-rose-500" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6 text-white text-center">
              <h3 className="font-bold text-lg">{data.ctaTitle}</h3>
              <p className="mt-2 text-sm text-slate-300">{data.ctaSubtitle}</p>
              <Link
                href="/"
                className="mt-6 block rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                Try it now
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
