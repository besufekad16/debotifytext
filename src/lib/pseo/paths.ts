/** New PSEO URL namespace. Old pages were `/{slug}` — those paths must never 200 again. */
export const PSEO_PREFIX = "/guides";

export function pseoPath(slug: string): string {
  return `${PSEO_PREFIX}/${slug}`;
}
