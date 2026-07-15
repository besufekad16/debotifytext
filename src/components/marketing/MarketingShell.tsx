import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

/**
 * Standard page frame for every static / content page: sticky navbar at the
 * top, the page's content, then the shared footer. Keeps chrome identical
 * across the whole site so pages read as one product.
 */
export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PageNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
