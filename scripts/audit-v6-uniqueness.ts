/**
 * Full field-level uniqueness + template-skeleton audit for every v6 page.
 *
 * Exact uniqueness is easy (the keyword is interpolated into every field).
 * The number that actually matters for Google is SKELETON repetition:
 * strip the keyword/entity tokens and see how many pages collapse to the
 * same sentence structure. High skeleton repetition = "scaled content"
 * risk, even when raw strings differ.
 */
import { getAllV6Entries } from "../src/lib/pseo-data-v6";
import { generateV6Content } from "../src/lib/content/v6-content";

const all = getAllV6Entries();

const exact: Record<string, Map<string, number>> = {
  metaTitle: new Map(),
  metaDescription: new Map(),
  h1: new Map(),
  directAnswer: new Map(),
  body: new Map(),
  faq: new Map(),
};
const skeleton: Record<string, Map<string, number>> = {
  metaTitle: new Map(),
  h1: new Map(),
  directAnswer: new Map(),
  body: new Map(),
};

function bump(m: Map<string, number>, k: string) {
  m.set(k, (m.get(k) ?? 0) + 1);
}

function skeletonize(text: string, keyword: string, entity: string): string {
  let t = text.toLowerCase();
  // remove the page-specific tokens so only the template shell remains
  for (const tok of [keyword.toLowerCase(), entity.toLowerCase(), "humanifylab"]) {
    if (tok) t = t.split(tok).join("§");
  }
  // strip the seed-unique note number
  t = t.replace(/seed-unique note \d+/g, "seed-unique note §");
  return t.replace(/\s+/g, " ").trim();
}

for (const e of all) {
  const d = generateV6Content(e);
  bump(exact.metaTitle!, d.metaTitle);
  bump(exact.metaDescription!, d.metaDescription);
  bump(exact.h1!, d.h1);
  bump(exact.directAnswer!, d.directAnswer);
  const body = d.paragraphs.map((p) => p.heading + "|" + p.body).join("||");
  bump(exact.body!, body);
  const faq = d.faqs.map((f) => f.q + "|" + f.a).join("||");
  bump(exact.faq!, faq);

  bump(skeleton.metaTitle!, skeletonize(d.metaTitle, e.keyword, e.entity));
  bump(skeleton.h1!, skeletonize(d.h1, e.keyword, e.entity));
  bump(skeleton.directAnswer!, skeletonize(d.directAnswer, e.keyword, e.entity));
  bump(skeleton.body!, skeletonize(body, e.keyword, e.entity));
}

const total = all.length;
function report(label: string, m: Map<string, number>) {
  const unique = m.size;
  let dupPages = 0;
  let maxShare = 0;
  for (const c of m.values()) {
    if (c > 1) dupPages += c;
    if (c > maxShare) maxShare = c;
  }
  const pct = ((unique / total) * 100).toFixed(3);
  console.log(
    `  ${label.padEnd(16)} unique=${unique}/${total} (${pct}%)  exact-dupe pages=${dupPages}  largest cluster=${maxShare}`,
  );
}

console.log(`v6 total pages: ${total}\n`);
console.log("EXACT string uniqueness (per field):");
for (const k of Object.keys(exact)) report(k, exact[k]!);
console.log("\nSKELETON uniqueness (keyword/entity removed = template variety):");
for (const k of Object.keys(skeleton)) report(k, skeleton[k]!);
