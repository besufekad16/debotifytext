import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Feather, ChevronRight } from "lucide-react";
import MarketingShell from "~/components/marketing/MarketingShell";
import { getAllApprovedSlugs, getKeywordBySlug, pseoPath } from "~/lib/pseo/keywords";

const CLUSTER_MAP: Record<string, { title: string; subtitle: string; filter: (slug: string) => boolean }> = {
  guides: {
    title: "How-To & AI Humanizer Guides",
    subtitle: "Step-by-step walkthroughs, prompt restructuring tutorials, and guides to passing automated checks.",
    filter: (s) => s.includes("how-to") || s.includes("guide") || s.includes("make-ai") || s.includes("tips"),
  },
  detectors: {
    title: "AI Detector Analysis & Mechanics",
    subtitle: "In-depth research on Turnitin, GPTZero, Originality.ai, Copyleaks, Winston AI, and institutional scanners.",
    filter: (s) => s.includes("turnitin") || s.includes("gptzero") || s.includes("originality") || s.includes("copyleaks") || s.includes("detector"),
  },
  bypass: {
    title: "AI Detection Bypass Resources",
    subtitle: "Proven techniques to eliminate robotic watermarks and reduce AI probability scores to 0%.",
    filter: (s) => s.includes("bypass") || s.includes("beat") || s.includes("remove") || s.includes("avoid"),
  },
  humanizer: {
    title: "AI Text Humanizer Tools & Workflows",
    subtitle: "Transforming ChatGPT, Claude, and Gemini text into authentic human prose with natural burstiness.",
    filter: (s) => s.includes("humaniz") || s.includes("rewrite") || s.includes("paraphras") || s.includes("free"),
  },
  usecases: {
    title: "Professional & Academic Use Cases",
    subtitle: "Tailored humanization workflows for university admissions, research projects, marketing, and client work.",
    filter: (s) => s.includes("essay") || s.includes("thesis") || s.includes("admissions") || s.includes("capstone") || s.includes("professional"),
  },
  compare: {
    title: "Comparisons & Alternative Analyses",
    subtitle: "Head-to-head performance benchmarks between DebotifyText, Undetectable AI, QuillBot, and standard rewriters.",
    filter: (s) => s.includes("alternative") || s.includes("vs") || s.includes("compare") || s.includes("best"),
  },
  essay: {
    title: "Student & College Essay Guides",
    subtitle: "Ensuring academic integrity and preventing false AI detection flags on university submissions.",
    filter: (s) => s.includes("essay") || s.includes("college") || s.includes("paper") || s.includes("academic"),
  },
  writing: {
    title: "Content & Copywriting Humanization",
    subtitle: "Optimizing cadence, vocabulary diversity, and sentence entropy for publishing and SEO.",
    filter: (s) => s.includes("writing") || s.includes("content") || s.includes("copy") || s.includes("blog"),
  },
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(CLUSTER_MAP).map((cluster) => ({ cluster }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cluster: string }>;
}): Promise<Metadata> {
  const { cluster } = await params;
  const info = CLUSTER_MAP[cluster];
  if (!info) return { title: "Topic Not Found", robots: { index: false } };

  const url = `https://www.debotifytext.com/topics/${cluster}`;
  return {
    title: `${info.title} | DebotifyText Knowledge Hub`,
    description: info.subtitle,
    alternates: { canonical: url },
    openGraph: {
      title: `${info.title} | DebotifyText`,
      description: info.subtitle,
      url,
      images: [{ url: "https://www.debotifytext.com/forOpenGraph.png", width: 1200, height: 630 }],
    },
  };
}

export default async function TopicClusterPage({
  params,
}: {
  params: Promise<{ cluster: string }>;
}) {
  const { cluster } = await params;
  const info = CLUSTER_MAP[cluster];
  if (!info) notFound();

  const allSlugs = getAllApprovedSlugs();
  const matchedSlugs = allSlugs.filter(info.filter);
  const displaySlugs = matchedSlugs.length >= 6 ? matchedSlugs.slice(0, 36) : allSlugs.slice(0, 24);

  const topics = displaySlugs
    .map((slug) => getKeywordBySlug(slug))
    .filter((contract): contract is NonNullable<typeof contract> => contract !== undefined);

  const url = `https://www.debotifytext.com/topics/${cluster}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: info.title,
        description: info.subtitle,
        isPartOf: { "@type": "WebSite", "@id": "https://www.debotifytext.com/#website" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.debotifytext.com" },
          { "@type": "ListItem", position: 2, name: "Topics", item: "https://www.debotifytext.com/topics" },
          { "@type": "ListItem", position: 3, name: info.title, item: url },
        ],
      },
    ],
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-green-50/50 to-white overflow-hidden border-b border-slate-100">
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center text-xs font-medium text-slate-500 mb-6">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-slate-400" />
            <Link href="/topics" className="hover:text-green-700">Topics</Link>
            <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-slate-400" />
            <span className="text-slate-900 font-bold capitalize">{cluster}</span>
          </nav>
          <span className="inline-block py-1.5 px-3.5 rounded-full bg-green-100/60 border border-green-200/60 text-[11px] font-bold tracking-[0.2em] text-green-700 uppercase mb-4 shadow-sm">
            Topic Hub • {topics.length} Guides
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
            {info.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-slate-500 font-medium">
            {info.subtitle}
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="relative py-16 bg-white min-h-[500px]">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={pseoPath(topic.slug)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-[0_8px_30px_-12px_rgba(34,197,94,0.15)] hover:-translate-y-1"
              >
                <div>
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-slate-50 p-2 transition-colors group-hover:bg-green-50">
                    <Feather className="h-4 w-4 text-slate-400 group-hover:text-green-600" />
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 capitalize tracking-tight group-hover:text-green-700 transition-colors line-clamp-2">
                    {topic.primaryKeyword}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-500 font-medium line-clamp-3">
                    {topic.content.directAnswer}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-[13px] font-bold text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Hub Navigation */}
          <div className="mt-16 border-t border-slate-100 pt-10 text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
              Explore Other Topic Hubs
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {Object.keys(CLUSTER_MAP).map((c) => (
                <Link
                  key={c}
                  href={`/topics/${c}`}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    c === cluster
                      ? "bg-green-700 text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {CLUSTER_MAP[c]!.title.split("&")[0]?.trim()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
