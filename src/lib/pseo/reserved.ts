/** App Router folders and next.config redirects that must never become PSEO slugs. */
export const RESERVED_SLUGS = new Set([
  "",
  "pricing",
  "faq",
  "contact",
  "privacy",
  "terms",
  "team",
  "account",
  "affiliate",
  "sign-in",
  "sign-up",
  "topics",
  "guides",
  "api-keys",
  "api",
  "bypass-ai-detectors",
  "ai-detector",
  "responsible-use",
  "llms-txt",
  "sitemap",
  "sitemap-xml",
  "robots",
  "robots-txt",
  "home",
  "blog",
  "ai-humanizer",
  "sitemaps",
  "opengraph-image",
  "twitter-image",
  "icon",
  "apple-icon",
  "manifest",
]);

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isUsableSlug(slug: string): boolean {
  if (slug.length < 5 || slug.length > 90) return false;
  if (RESERVED_SLUGS.has(slug)) return false;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return false;
  return true;
}
