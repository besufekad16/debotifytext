import Link from "next/link";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import { buildRelatedLinks } from "~/lib/related-links";

interface SEOPageWrapperProps {
  keyword: string;
  cluster: string;
  /**
   * Kept for backwards compatibility with existing callers and for the
   * structured-data (JSON-LD) dates built in the page itself. Neither the
   * breadcrumb nor a Published/Updated bar is rendered on the frontend —
   * by design, per product decision — so these are intentionally unused here.
   */
  publishDate?: string;
  updatedDate?: string;
  readTime?: number;
  children: React.ReactNode;
}

export default function SEOPageWrapper({ keyword, cluster, children }: SEOPageWrapperProps) {
  const relatedLinks = buildRelatedLinks(cluster, keyword);

  return (
    <article className="min-h-screen">
      <PageNavbar />

      {/* Page content */}
      <div>{children}</div>

      {/* Internal links footer — improves crawl depth and topical authority */}
      <aside className="border-t border-gray-200 bg-[#faf7f4] px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6f47]">Related Guides</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg border border-transparent px-2 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#8b6f47]/30 hover:bg-white hover:text-[#5e3d2a]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <SiteFooter />
    </article>
  );
}
