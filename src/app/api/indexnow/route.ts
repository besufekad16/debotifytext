
import { type NextRequest, NextResponse } from "next/server";
import { getAllSlugs } from "~/lib/pseo/keywords";
import { CLUSTER_ORDER } from "~/lib/pseo/clusters";
import { pseoPath } from "~/lib/pseo/paths";

export const dynamic = "force-dynamic";

const HOST          = "www.humanifylab.com";
const BASE_URL      = `https://${HOST}`;
const INDEX_NOW_KEY = "cae535bda6cc4564a9c5dda38f8236eb";
const KEY_LOCATION  = `${BASE_URL}/${INDEX_NOW_KEY}.txt`;
const BATCH_SIZE    = 9000;

const STATIC_PAGES = [
  "/",
  "/pricing",
  "/faq",
  "/contact",
  "/responsible-use",
  "/terms",
  "/privacy",
  "/bypass-ai-detectors",
  "/ai-detector",
  "/topics",
  ...CLUSTER_ORDER.map((c) => `/topics/${c}`),
];

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

async function submitBatch(urls: string[]): Promise<{ ok: boolean; status: number }> {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: INDEX_NOW_KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });
  return { ok: res.ok || res.status === 202, status: res.status };
}

export async function POST(request: NextRequest) {
  // Protect with CRON_SECRET so only you can trigger it
  const auth = request.headers.get("Authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allUrls = getAllIndexableUrls();

  const batches = chunk(allUrls, BATCH_SIZE);
  const results: { batch: number; status: number; ok: boolean }[] = [];

  for (let i = 0; i < batches.length; i++) {
    const result = await submitBatch(batches[i]!);
    results.push({ batch: i + 1, ...result });
    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  const allOk = results.every(r => r.ok);
  return NextResponse.json({
    submitted: allUrls.length,
    batches: batches.length,
    results,
    success: allOk,
  }, { status: allOk ? 200 : 207 });
}

// All indexable URLs: static pages + every PSEO page at /{keyword}
function getAllIndexableUrls(): string[] {
  const allSlugs = [...new Set(getAllSlugs())];
  return [
    ...STATIC_PAGES.map(p => `${BASE_URL}${p}`),
    ...allSlugs.map(s => `${BASE_URL}${pseoPath(s)}`),
  ];
}

// GET — Vercel cron calls this weekly, also returns key info
export async function GET(request: NextRequest) {
  // Allow Vercel cron (no auth header) OR authenticated requests
  const auth = request.headers.get("Authorization");
  const secret = process.env.CRON_SECRET;
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (secret && auth !== `Bearer ${secret}` && !isVercelCron) {
    // Unauthenticated GET just returns key info (for verification)
    return NextResponse.json({
      key: INDEX_NOW_KEY,
      keyLocation: KEY_LOCATION,
      totalUrls: getAllIndexableUrls().length,
    });
  }

  // Authenticated GET or Vercel cron — run full submission
  const allUrls = getAllIndexableUrls();

  const batches = chunk(allUrls, BATCH_SIZE);
  const results: { batch: number; status: number; ok: boolean }[] = [];

  for (let i = 0; i < batches.length; i++) {
    const result = await submitBatch(batches[i]!);
    results.push({ batch: i + 1, ...result });
    if (i < batches.length - 1) await new Promise(r => setTimeout(r, 500));
  }

  const allOk = results.every(r => r.ok);
  return NextResponse.json({
    submitted: allUrls.length,
    batches: batches.length,
    results,
    success: allOk,
  }, { status: allOk ? 200 : 207 });
}
