import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import { BASE_URL, CLUSTER_META, CLUSTER_ORDER, getClusterSize, getTotalPseoCount } from "~/lib/pseo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "All Guides — AI Humanizer, Detectors & Academic Writing | HumanifyLab" },
  description: "Browse 40,000 HumanifyLab guides across eight topics: AI humanizer tools, detector bypass, essays, AI detectors, writing workflows, how-tos, comparisons, and regional use cases.",
  alternates: { canonical: `${BASE_URL}/topics` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "All Guides | HumanifyLab",
    description: "Eight topic hubs into HumanifyLab’s AI humanizer and detector guides.",
    url: `${BASE_URL}/topics`,
    siteName: "HumanifyLab",
    type: "website",
  },
};

const GROUP_ORDER = ["Detection", "Writing", "People"] as const;

export default function TopicsPage() {
  const totalCount = getTotalPseoCount();
  const groups = GROUP_ORDER.map((group) => ({
    group,
    clusters: CLUSTER_ORDER.filter((key) => CLUSTER_META[key].group === group),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/topics#collection`,
    name: "All Guides & Topics",
    url: `${BASE_URL}/topics`,
    isPartOf: { "@type": "WebSite", "@id": `${BASE_URL}/#website` },
    hasPart: CLUSTER_ORDER.map((key) => ({
      "@type": "CollectionPage",
      name: CLUSTER_META[key].label,
      url: `${BASE_URL}/topics/${key}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--hl-cream)]">
      <PageNavbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="border-b border-black/5 bg-white/80 px-4 py-2.5">
        <ol className="mx-auto flex max-w-6xl items-center gap-1 text-xs text-black/50 sm:text-sm">
          <li><Link href="/" className="hover:text-[var(--hl-mint-deep)]">HumanifyLab</Link></li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-[var(--hl-ink)]" aria-current="page">Guides</li>
        </ol>
      </nav>

      <section className="bg-[var(--hl-ink)] px-4 py-14 text-white sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--hl-mint-bright)]">
            {totalCount.toLocaleString()} guides · 8 topics
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Every HumanifyLab guide, in eight topics
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
            Humanizer tools, detector explainers, academic writing, comparisons, and regional workflows — each page is its own search query, not a spun copy of the homepage.
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-14">
          {groups.map(({ group, clusters }) => (
            <div key={group}>
              <h2 className="mb-6 border-b border-black/10 pb-3 text-xl font-semibold">{group}</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {clusters.map((key) => {
                  const meta = CLUSTER_META[key];
                  const count = getClusterSize(key);
                  return (
                    <Link
                      key={key}
                      href={`/topics/${key}`}
                      className="group block rounded-2xl border border-black/5 bg-white p-6 hover:border-[var(--hl-mint-deep)]"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="font-semibold group-hover:text-[var(--hl-mint-deep)]">{meta.label}</h3>
                        <ArrowRight className="h-4 w-4 shrink-0 text-black/30 group-hover:text-[var(--hl-mint-deep)]" />
                      </div>
                      <p className="mb-3 text-sm leading-relaxed text-black/60">{meta.description}</p>
                      <span className="text-xs font-medium text-[var(--hl-mint-deep)]">{count.toLocaleString()} guides</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-black/5 px-4 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold">Try the humanizer</h2>
          <p className="mt-3 text-black/60">Paste a draft on the homepage. Free plan, no sign-up required.</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--hl-mint-deep)] px-8 py-4 text-sm font-semibold text-white hover:bg-[var(--hl-mint)]">
            Open HumanifyLab <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
