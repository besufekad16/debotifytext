import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import { CLUSTER_REGISTRY, CLUSTER_ORDER, getClusterSize, getTotalPseoCount } from "~/lib/pseo-clusters";

const BASE_URL = "https://www.humanifylab.com";

export const metadata: Metadata = {
  title: "All Guides & Topics — AI Humanizer & AI Detection Bypass | HumanifyLab",
  description: "Browse every HumanifyLab guide by topic: AI detector bypass methods, humanizer tools, industries, content formats, pricing, and country-specific guidance.",
  alternates: { canonical: `${BASE_URL}/topics` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "All Guides & Topics | HumanifyLab",
    description: "Browse every HumanifyLab guide by topic — organized so you can find exactly what you need.",
    url: `${BASE_URL}/topics`,
    siteName: "HumanifyLab",
    type: "website",
  },
};

const GROUP_ORDER = ["Bypass & Detection", "Humanizer & Use Cases", "Comparisons & Reviews", "Content & Industry", "Regions"] as const;

export default function TopicsPage() {
  const totalCount = getTotalPseoCount();

  const groups = GROUP_ORDER.map((group) => ({
    group,
    clusters: CLUSTER_ORDER.filter((key) => CLUSTER_REGISTRY[key].group === group),
  })).filter((g) => g.clusters.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/topics#collection`,
    name: "All Guides & Topics",
    url: `${BASE_URL}/topics`,
    isPartOf: { "@type": "WebSite", "@id": `${BASE_URL}/#website` },
    hasPart: CLUSTER_ORDER.map((key) => ({
      "@type": "CollectionPage",
      name: CLUSTER_REGISTRY[key].label,
      url: `${BASE_URL}/topics/${key}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <PageNavbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <ol className="mx-auto max-w-6xl flex items-center gap-1 text-xs sm:text-sm text-gray-500">
          <li><Link href="/" className="hover:text-[var(--hl-mint-deep)]">HumanifyLab</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-medium" aria-current="page">Topics</li>
        </ol>
      </nav>

      <section className="bg-[#0f1419] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--hl-mint-deep)] mb-4">
            {totalCount.toLocaleString()}+ Guides
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Every HumanifyLab Guide, Organized by Topic
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            From beating a specific AI detector to humanizing content for a specific industry or country —
            find the exact guide you need below.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto space-y-14">
          {groups.map(({ group, clusters }) => (
            <div key={group}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">{group}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {clusters.map((key) => {
                  const meta = CLUSTER_REGISTRY[key];
                  const count = getClusterSize(key);
                  return (
                    <Link
                      key={key}
                      href={`/topics/${key}`}
                      className="group block bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-[var(--hl-mint-deep)] p-6 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[var(--hl-mint-deep)] transition-colors">
                          {meta.label}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--hl-mint-deep)] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{meta.description}</p>
                      <span className="text-xs font-medium text-[var(--hl-mint-deep)]">{count.toLocaleString()} guides</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">
            Paste any AI-generated text into HumanifyLab and get a humanized, undetectable version in under 10 seconds — free to try, no sign-up required.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[var(--hl-mint-deep)] hover:bg-[var(--hl-mint)] text-white font-semibold px-8 py-4 rounded-xl transition-colors">
            Try HumanifyLab Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
