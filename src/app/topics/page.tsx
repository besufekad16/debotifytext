import { type Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Feather } from "lucide-react";
import MarketingShell from "~/components/marketing/MarketingShell";
import { getAllApprovedSlugs, getKeywordBySlug, pseoPath } from "~/lib/pseo/keywords";

export const metadata: Metadata = {
  title: "AI Humanizer Guides & Topics | DebotifyText",
  description: "Explore our comprehensive library of guides on bypassing AI detectors, humanizing AI text, and writing naturally with DebotifyText.",
  alternates: {
    canonical: "https://www.debotifytext.com/topics",
  },
};

export default function TopicsPage() {
  const slugs = getAllApprovedSlugs();
  const topics = slugs
    .map((slug) => getKeywordBySlug(slug))
    .filter((contract): contract is NonNullable<typeof contract> => contract !== undefined);

  return (
    <MarketingShell>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-b from-green-50/50 to-white overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-green-100/50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-green-50 rounded-full blur-[80px] opacity-70 translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <span className="inline-block py-1.5 px-3.5 rounded-full bg-green-100/50 border border-green-200/50 text-[11px] font-bold tracking-[0.2em] text-green-700 uppercase mb-6 shadow-sm">
            Knowledge Hub
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
            Master the art of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">AI Humanization</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-slate-500 font-medium">
            Explore our comprehensive library of guides, research, and strategies to successfully bypass Turnitin, GPTZero, and every major AI detector on the market.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="relative py-24 bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(74,222,128,0.03),transparent_70%)] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 shadow-inner">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">All Topics & Guides</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={pseoPath(topic.slug)}
                className="group relative flex flex-col justify-between rounded-[1.5rem] border border-slate-100 bg-white p-7 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-[0_8px_30px_-12px_rgba(34,197,94,0.15)] hover:-translate-y-1"
              >
                <div>
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-slate-50 p-2 transition-colors group-hover:bg-green-50">
                    <Feather className="h-4 w-4 text-slate-400 group-hover:text-green-600" />
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-900 capitalize tracking-tight group-hover:text-green-700 transition-colors">
                    {topic.primaryKeyword}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-slate-500 font-medium line-clamp-3">
                    {topic.content.directAnswer}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[13px] font-bold text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>

          {topics.length === 0 && (
            <div className="text-center py-20 rounded-[2rem] border border-slate-100 bg-slate-50">
              <p className="text-slate-500 font-medium">No guides available at the moment. Please check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="relative px-6 py-24 text-center bg-white border-t border-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-green-50/50 to-white pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
            Ready to humanize your AI text?
          </h2>
          <p className="text-[17px] text-slate-500 mb-10 font-medium">
            Join thousands of professionals using DebotifyText to bypass AI detectors and create flawless, human-like content instantly.
          </p>
          <Link
            href="/ai-humanizer"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-10 py-5 text-[16px] font-bold text-white transition-all hover:bg-green-800 hover:shadow-lg hover:shadow-green-700/20 hover:-translate-y-0.5"
          >
            Get Started For Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
