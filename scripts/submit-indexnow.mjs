/**
 * IndexNow URL Submission Script
 * Submits all HumanifyLab SEO pages to Bing + Yandex via IndexNow.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *
 * Submits up to 10,000 URLs per batch. Handles all v1 + v2 slugs automatically.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HOST        = 'www.humanifylab.com';
const BASE_URL    = `https://${HOST}`;
const INDEX_NOW_KEY = 'cae535bda6cc4564a9c5dda38f8236eb';
const KEY_LOCATION  = `${BASE_URL}/${INDEX_NOW_KEY}.txt`;
const BATCH_SIZE    = 9000; // stay under 10k limit

// ── Slug extraction ──────────────────────────────────────────────────────────

function toSlug(k) {
  return k.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function extractStringsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.match(/"([^"]{5,120})"/g) ?? [];
  return matches
    .map(s => s.replace(/"/g, '').trim())
    .filter(s => !s.includes('\\') && !s.includes('/') && !s.startsWith('http') && !s.includes('@'));
}

function getSlugsFromDataFile(filePath) {
  const strings = extractStringsFromFile(filePath);
  const seen = new Set();
  const slugs = [];
  for (const s of strings) {
    const slug = toSlug(s);
    if (slug.length > 3 && slug.length < 100 && !seen.has(slug)) {
      seen.add(slug);
      slugs.push(slug);
    }
  }
  return slugs;
}

// ── Static pages ─────────────────────────────────────────────────────────────

const STATIC_PAGES = [
  '/',
  '/pricing',
  '/affiliate',
  '/faq',
  '/contact',
  '/responsible-use',
  '/terms',
  '/privacy',
].map(p => `${BASE_URL}${p}`);

// ── Collect all keyword slugs ─────────────────────────────────────────────────

const v1Path = path.join(__dirname, '..', 'src', 'lib', 'pseo-data.ts');
const v2Path = path.join(__dirname, '..', 'src', 'lib', 'pseo-data-v2.ts');

console.log('Reading v1 slugs...');
const v1Slugs = getSlugsFromDataFile(v1Path);

console.log('Reading v2 slugs...');
const v2Slugs = getSlugsFromDataFile(v2Path);

// Deduplicate across both
const allSlugsSet = new Set([...v1Slugs, ...v2Slugs]);
const keywordUrls = [...allSlugsSet].map(slug => `${BASE_URL}/${slug}`);

const allUrls = [...STATIC_PAGES, ...keywordUrls];

console.log(`\nTotal URLs to submit: ${allUrls.length}`);
console.log(`  Static pages: ${STATIC_PAGES.length}`);
console.log(`  V1 keyword pages: ${v1Slugs.length}`);
console.log(`  V2 keyword pages: ${v2Slugs.length}`);
console.log(`  Unique keyword pages: ${allSlugsSet.size}`);

// ── Batch and submit ──────────────────────────────────────────────────────────

function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function submitBatch(urls, batchNum, total) {
  const body = JSON.stringify({
    host: HOST,
    key: INDEX_NOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  });

  console.log(`\nSubmitting batch ${batchNum}/${total} (${urls.length} URLs)...`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });

  if (res.ok || res.status === 200 || res.status === 202) {
    console.log(`  ✓ Batch ${batchNum} accepted (HTTP ${res.status})`);
    return true;
  } else {
    const text = await res.text().catch(() => '');
    console.error(`  ✗ Batch ${batchNum} failed (HTTP ${res.status}): ${text.substring(0, 200)}`);
    return false;
  }
}

async function main() {
  const batches = chunk(allUrls, BATCH_SIZE);
  console.log(`\nSplitting into ${batches.length} batch(es) of up to ${BATCH_SIZE} URLs each.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < batches.length; i++) {
    const success = await submitBatch(batches[i], i + 1, batches.length);
    if (success) successCount++;
    else failCount++;

    // Small delay between batches to be polite
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Submission complete.`);
  console.log(`  ✓ Successful batches: ${successCount}/${batches.length}`);
  if (failCount > 0) console.log(`  ✗ Failed batches: ${failCount}`);
  console.log(`\nBing and Yandex will start crawling your pages shortly.`);
  console.log(`Check status at: https://www.bing.com/webmasters/`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
