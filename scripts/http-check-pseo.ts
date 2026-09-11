/**
 * HTTP-check sitemap PSEO URLs against a running server.
 * Default: http://localhost:3050
 *
 * Samples first/mid/last of every cluster sitemap, hubs, flagships, and
 * a few sitemap-main product pages. Full 40k coverage is scripts/verify-sitemap-pages.ts
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { CLUSTER_KEYS, BASE_URL } from "../src/lib/pseo/types";
import { getKeywordBySlug } from "../src/lib/pseo/keywords";
import { clusterPageCount, hubPath } from "../src/lib/pseo/hubs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(ROOT, "../public");
const ORIGIN = process.env.CHECK_ORIGIN ?? "http://localhost:3050";

function locs(file: string): string[] {
  const xml = readFileSync(join(PUBLIC_DIR, file), "utf8");
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]!);
}

function toLocal(url: string): string {
  return url.replace(BASE_URL, ORIGIN);
}

type Result = { url: string; ok: boolean; detail: string };

async function checkHtml(url: string, expect: { slug?: string; status?: number; location?: string }): Promise<Result> {
  const statusWant = expect.status ?? 200;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 180000);
  try {
    const res = await fetch(url, { redirect: "manual", signal: ac.signal, headers: { "user-agent": "HumanifyLab-PSEO-Check/1.0" } });
    if (res.status !== statusWant) {
      return { url, ok: false, detail: `status ${res.status} expected ${statusWant}` };
    }
    if (statusWant !== 200) {
      if (expect.location) {
        const loc = res.headers.get("location") ?? "";
        if (!loc.includes(expect.location)) {
          return { url, ok: false, detail: `location ${loc} expected ${expect.location}` };
        }
        return { url, ok: true, detail: `redirect ${res.status} -> ${loc}` };
      }
      return { url, ok: true, detail: `status ${res.status}` };
    }
    const html = await res.text();
    if (html.length < 1500) return { url, ok: false, detail: `thin html ${html.length} bytes` };
    if (/noindex/i.test(html) && !url.includes("/sign-")) {
      return { url, ok: false, detail: "noindex" };
    }
    if (!/<h1[\s>]/i.test(html)) return { url, ok: false, detail: "missing h1" };
    if (expect.slug) {
      const path = `/${expect.slug}`;
      const canon = `${BASE_URL}${path}`;
      if (!html.includes(canon) && !html.includes(`href="${path}"`) && !html.includes(path)) {
        return { url, ok: false, detail: `missing canonical/path ${path}` };
      }
      const entry = getKeywordBySlug(expect.slug);
      if (entry && !html.toLowerCase().includes(entry.keyword.toLowerCase().slice(0, 18))) {
        return { url, ok: false, detail: `keyword not in html: ${entry.keyword}` };
      }
    }
    return { url, ok: true, detail: `200 ${html.length}b` };
  } catch (err) {
    return { url, ok: false, detail: err instanceof Error ? err.message : String(err) };
  } finally {
    clearTimeout(t);
  }
}

function sample<T>(arr: T[]): T[] {
  if (arr.length === 0) return [];
  const idx = [0, Math.floor(arr.length / 4), Math.floor(arr.length / 2), Math.floor((arr.length * 3) / 4), arr.length - 1];
  return [...new Set(idx)].map((i) => arr[i]!);
}

const jobs: Array<() => Promise<Result>> = [];

for (const cluster of CLUSTER_KEYS) {
  const urls = locs(`sitemap-${cluster}.xml`);
  for (const loc of sample(urls)) {
    const slug = loc.slice(`${BASE_URL}/`.length);
    jobs.push(() => checkHtml(toLocal(loc), { slug }));
  }
}

jobs.push(() => checkHtml(`${ORIGIN}/topics`, {}));
for (const cluster of CLUSTER_KEYS) {
  jobs.push(() => checkHtml(`${ORIGIN}${hubPath(cluster, 1)}`, {}));
  const last = clusterPageCount(cluster);
  if (last > 1) jobs.push(() => checkHtml(`${ORIGIN}${hubPath(cluster, last)}`, {}));
}

const flagships = [
  "free-ai-humanizer",
  "best-ai-humanizer",
  "bypass-turnitin-ai-detection",
  "does-turnitin-detect-chatgpt",
  "chatgpt-humanizer",
  "chatgpt-essay-humanizer",
];
for (const slug of flagships) {
  jobs.push(() => checkHtml(`${ORIGIN}/${slug}`, { slug }));
}

jobs.push(() => checkHtml(`${ORIGIN}/guides/free-ai-humanizer`, { status: 308, location: "/free-ai-humanizer" }));
jobs.push(() => checkHtml(`${ORIGIN}/free-ai-humanizer`, { slug: "free-ai-humanizer" }));
jobs.push(() => checkHtml(`${ORIGIN}/this-old-pseo-slug-should-404-xyz`, { status: 404 }));

for (const loc of sample(locs("sitemap-main.xml")).slice(0, 8)) {
  const path = loc.replace(BASE_URL, "") || "/";
  if (!path || path === "/" || path === "/pricing" || path === "/llms.txt") continue;
  jobs.push(() => checkHtml(toLocal(loc), {}));
}

for (const file of ["sitemap.xml", "sitemap-main.xml", ...CLUSTER_KEYS.map((k) => `sitemap-${k}.xml`)]) {
  jobs.push(async () => {
    const url = `${ORIGIN}/${file}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      const body = await res.text();
      if (res.status !== 200) return { url, ok: false, detail: `xml status ${res.status}` };
      if (!body.includes("<loc>")) return { url, ok: false, detail: "xml missing loc" };
      if (file.startsWith("sitemap-") && file !== "sitemap-main.xml") {
        if (body.includes(`${BASE_URL}/guides/`)) {
          return { url, ok: false, detail: "cluster sitemap still has /guides/" };
        }
        if (!/<loc>https:\/\/www\.humanifylab\.com\/[a-z0-9-]+<\/loc>/.test(body)) {
          return { url, ok: false, detail: "cluster sitemap missing root /{keyword} locs" };
        }
      }
      return { url, ok: true, detail: `xml ${body.length}b` };
    } catch (err) {
      return { url, ok: false, detail: err instanceof Error ? err.message : String(err) };
    }
  });
}

const results: Result[] = [];
for (const job of jobs) {
  const r = await job();
  results.push(r);
  console.log(r.ok ? "OK  " : "FAIL", r.url.replace(ORIGIN, ""), r.detail);
}
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} HTTP checks passed`);
if (failed.length) {
  console.error("FAILED", failed.length);
  process.exit(1);
}
console.log("HTTP SAMPLE OK");
