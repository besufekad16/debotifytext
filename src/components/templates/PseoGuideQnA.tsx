import Link from "next/link";
import { ArrowRight, ChevronRight, HelpCircle, AlertOctagon, CalendarSync, Clock, BookOpen } from "lucide-react";
import type { KeywordEntry, PseoPageData } from "~/lib/pseo/types";
import { CLUSTER_META } from "~/lib/pseo/clusters";

interface Props {
  entry: KeywordEntry;
  data: PseoPageData;
}

export default function PseoGuideQnA({ entry, data }: Props) {
  const cluster = CLUSTER_META[entry.cluster];

  return (
    <div className="bg-[#FAF9F6] text-[#2C3E50] min-h-screen font-sans">
      <nav aria-label="Breadcrumb" className="px-6 py-4 border-b border-[#EAE6DF]">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-[#7F8C8D]">
          <li><Link href="/" className="hover:text-[#2980B9]">Home</Link></li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li><Link href="/topics" className="hover:text-[#2980B9]">Guides</Link></li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li><Link href={`/topics/${entry.cluster}`} className="hover:text-[#2980B9]">{cluster.label}</Link></li>
        </ol>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <header className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-[#E8F8F5] text-[#1ABC9C] text-xs font-bold tracking-widest uppercase mb-6">
            {data.eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-[#2C3E50]">
            {data.h1}
          </h1>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-[#7F8C8D]">
            <span className="flex items-center gap-1.5">
              <CalendarSync className="h-4 w-4" /> Updated: {new Date(data.updatedDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {data.readTime} min read
            </span>
          </div>
          <p className="text-xl text-[#34495E] font-light leading-relaxed mb-8">
            {data.heroSubtitle}
          </p>
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#EAE6DF] text-left">
            <h2 className="flex items-center gap-2 text-lg font-bold mb-3 text-[#2C3E50]">
              <HelpCircle className="w-5 h-5 text-[#2980B9]" /> Quick Answer
            </h2>
            <p id="direct-answer" className="text-lg leading-relaxed text-[#34495E]">
              {data.directAnswer}
            </p>
          </div>
        </header>

        <div className="space-y-12">
          {data.sections.map((section, i) => (
            <section key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-[#EAE6DF]">
              <h2 className="text-2xl font-bold mb-4 text-[#2C3E50]">Q: {section.title}</h2>
              <p className="text-lg leading-relaxed text-[#566573]">A: {section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 bg-[#FDFEFE] rounded-2xl p-8 border border-[#EAE6DF]">
          <h2 className="text-3xl font-bold mb-8 text-[#2C3E50]">Essential Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#2C3E50]">Do's</h3>
              <ul className="space-y-3">
                {data.takeaways.map(t => (
                  <li key={t} className="flex gap-3 text-[#566573]">
                    <span className="text-[#1ABC9C] font-bold">✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#2C3E50]">Don'ts</h3>
              <ul className="space-y-3">
                {data.mistakes.map(m => (
                  <li key={m} className="flex gap-3 text-[#566573]">
                    <AlertOctagon className="w-5 h-5 shrink-0 text-[#E74C3C]" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-16 bg-white rounded-2xl p-8 border border-[#EAE6DF]">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-bold mb-6 text-[#2C3E50]">
            <BookOpen className="w-6 h-6 text-[#2980B9]" /> Related Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#2980B9] transition-colors"
              >
                <span className="font-medium text-[#34495E] group-hover:text-[#2980B9] line-clamp-1">
                  {link.label}
                </span>
                <ChevronRight className="w-5 h-5 text-[#BDC3C7] group-hover:text-[#2980B9] transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold mb-6 text-[#2C3E50]">{data.ctaTitle}</h2>
          <p className="text-xl mb-8 text-[#566573]">{data.ctaSubtitle}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#2980B9] hover:bg-[#2471A3] text-white px-8 py-4 rounded-xl font-bold transition-colors text-lg"
          >
            Go to HumanifyLab <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
