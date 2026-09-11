/** PSEO lives at `/{slug}` so public URLs match https://www.humanifylab.com/{keyword}. */
export const PSEO_PREFIX = "";

export function pseoPath(slug: string): string {
  return `/${slug}`;
}
