import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import { CLUSTER_REGISTRY, type AnyClusterKey } from "~/lib/pseo-clusters";
import { smartTitleCase } from "~/lib/content/content-utils";

const BASE_URL = "https://www.humanifylab.com";

interface PageProps {
  params: Promise<{ cluster: string }>;
}

export async function generateStaticParams() {
  return Object.keys(CLUSTER_REGISTRY).map((cluster) => ({ cluster }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster } = await params;
  const meta = CLUSTER_REGISTRY[cluster as AnyClusterKey];
  if (!meta) return { title: "Not Found" };
  const count = meta.getEntries().length;
  const title = `${meta.label} — ${count} Guides | HumanifyLab`;
  const description = `${meta.description} Browse all ${count} guides in this collection.`;
  const url = `${BASE_URL}/topics/${cluster}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, siteName: "HumanifyLab", type: "website" },
  };
}

export default async function ClusterTopicPage({ params }: PageProps) {
  const { cluster } = await params;
  const meta = CLUSTER_REGISTRY[cluster as AnyClusterKey];
  if (!meta) notFound();

  const entries = meta.getEntries();
  const groupedMap = new Map<string, typeof entries>();
  for (const entry of entries) {
    const arr = groupedMap.get(entry.entity) ?? [];
    arr.push(entry);
    groupedMap.set(entry.entity, arr);
  }
  const grouped = Array.from(groupedMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/topics/${cluster}#collection`,
        name: `${meta.label} — HumanifyLab`,
        description: meta.description,
        url: `${BASE_URL}/topics/${cluster}`,
        isPartOf: { "@type": "WebSite", "@id": `${BASE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE_URL}/topics/${cluster}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Topics", item: `${BASE_URL}/topics` },
          { "@type": "ListItem", position: 3, name: meta.label, item: `${BASE_URL}/topics/${cluster}` },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${BASE_URL}/topics/${cluster}#items`,
        numberOfItems: entries.length,
        itemListElement: entries.slice(0, 200).map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${BASE_URL}/${e.slug}`,
          name: smartTitleCase(e.keyword),
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <PageNavbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <ol className="mx-auto max-w-6xl flex items-center gap-1 text-xs sm:text-sm text-gray-500">
          <li><Link href="/" className="hover:text-[var(--hl-mint-deep)]">HumanifyLab</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/topics" className="hover:text-[var(--hl-mint-deep)]">Topics</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-medium" aria-current="page">{meta.label}</li>
        </ol>
      </nav>

      <section className="bg-[#0f1419] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--hl-mint-deep)] mb-4">
            {entries.length.toLocaleString()} Guides
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">{meta.label}</h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">{meta.description}</p>
        </div>
      </section>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto space-y-10">
          {grouped.map(([entity, items]) => (
            <div key={entity}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{entity}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.slug}`}
                    className="truncate py-1 text-sm text-[var(--hl-mint-deep)] hover:text-[var(--hl-mint)] hover:underline"
                    title={smartTitleCase(item.keyword)}
                  >
                    {smartTitleCase(item.keyword)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 px-4 bg-gray-50 text-center">
        <div className="max-w-2xl mx-auto">
          <Link href="/topics" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--hl-mint-deep)] mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to all topics
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Try HumanifyLab Free</h2>
          <p className="text-gray-600 mb-6">
            Results in under 10 seconds. Free plan, no sign-up required.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[var(--hl-mint-deep)] hover:bg-[var(--hl-mint)] text-white font-semibold px-8 py-4 rounded-xl transition-colors">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
