import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import { BASE_URL, CLUSTER_META, HUB_PAGE_SIZE, type ClusterKey, pseoPath } from "~/lib/pseo";
import { getClusterEntries } from "~/lib/pseo/keywords";
import { clusterPageCount, hubPath } from "~/lib/pseo/hubs";
import { smartTitleCase } from "~/lib/content/content-utils";

export { clusterPageCount, hubPath };

interface Props {
  cluster: ClusterKey;
  page: number;
}

export default function ClusterHub({ cluster, page }: Props) {
  const meta = CLUSTER_META[cluster];
  const entries = getClusterEntries(cluster);
  const totalPages = clusterPageCount(cluster);
  const start = (page - 1) * HUB_PAGE_SIZE;
  const slice = entries.slice(start, start + HUB_PAGE_SIZE);

  const grouped = new Map<string, typeof slice>();
  for (const entry of slice) {
    const arr = grouped.get(entry.entity) ?? [];
    arr.push(entry);
    grouped.set(entry.entity, arr);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BASE_URL}${hubPath(cluster, page)}#collection`,
        name: meta.label,
        description: meta.description,
        url: `${BASE_URL}${hubPath(cluster, page)}`,
        isPartOf: { "@type": "WebSite", "@id": `${BASE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE_URL}/topics` },
          { "@type": "ListItem", position: 3, name: meta.label, item: `${BASE_URL}/topics/${cluster}` },
        ],
      },
      {
        "@type": "ItemList",
        numberOfItems: slice.length,
        itemListElement: slice.map((e, i) => ({
          "@type": "ListItem",
          position: start + i + 1,
          url: `${BASE_URL}${pseoPath(e.slug)}`,
          name: smartTitleCase(e.keyword),
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--hl-cream)]">
      <PageNavbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="border-b border-black/5 bg-white/80 px-4 py-2.5">
        <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 text-xs text-black/50 sm:text-sm">
          <li><Link href="/" className="hover:text-[var(--hl-mint-deep)]">HumanifyLab</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/topics" className="hover:text-[var(--hl-mint-deep)]">Guides</Link></li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-[var(--hl-ink)]" aria-current="page">{meta.label}</li>
        </ol>
      </nav>

      <section className="bg-[var(--hl-ink)] px-4 py-12 text-white sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--hl-mint-bright)]">
            {entries.length.toLocaleString()} guides · page {page} of {totalPages}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{meta.label}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">{meta.description}</p>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-10">
          {Array.from(grouped.entries()).map(([entity, items]) => (
            <div key={entity}>
              <h2 className="mb-4 text-lg font-semibold">{entity}</h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    href={pseoPath(item.slug)}
                    className="truncate py-1 text-sm text-[var(--hl-mint-deep)] hover:underline"
                    title={smartTitleCase(item.keyword)}
                  >
                    {smartTitleCase(item.keyword)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mx-auto mt-12 flex max-w-6xl items-center justify-center gap-3">
            {page > 1 ? (
              <Link href={hubPath(cluster, page - 1)} className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:border-[var(--hl-mint-deep)]">
                <ArrowLeft className="h-4 w-4" /> Previous
              </Link>
            ) : null}
            <span className="text-sm text-black/50">{page} / {totalPages}</span>
            {page < totalPages ? (
              <Link href={hubPath(cluster, page + 1)} className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:border-[var(--hl-mint-deep)]">
                Next <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </nav>
        )}
      </section>

      <section className="border-t border-black/5 px-4 py-12 text-center">
        <Link href="/topics" className="inline-flex items-center gap-2 text-sm text-black/55 hover:text-[var(--hl-mint-deep)]">
          <ArrowLeft className="h-4 w-4" /> All topics
        </Link>
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-[var(--hl-mint-deep)] px-8 py-4 text-sm font-semibold text-white hover:bg-[var(--hl-mint)]">
            Try HumanifyLab free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
