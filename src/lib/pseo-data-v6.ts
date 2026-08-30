/**
 * HumanifyLab pSEO v6 - 10 new clusters, ~58,000 unique slugs after
 * global dedupe against v1-v5 + geo. Comparison inventory (versus +
 * detectorshowdown) is ~10k. Remaining clusters target high-intent
 * commercial and Q&A queries.
 *
 * v6 URLs are ISR-rendered on demand (not pre-built in
 * generateStaticParams) so deploys stay within build limits. Sitemaps
 * still list every slug for discovery.
 */
import { getAllSlugs as getV1Slugs } from "~/lib/pseo-data";
import { getAllV2Slugs } from "~/lib/pseo-data-v2";
import { getAllV3Slugs } from "~/lib/pseo-data-v3";
import { getAllV4Slugs } from "~/lib/pseo-data-v4";
import { getAllV5Slugs } from "~/lib/pseo-data-v5";
import { getAllGeoSlugs } from "~/lib/pseo-data-geo";
import {
  HUMANIZERS,
  DETECTORS,
  MODELS,
  ROLES,
  TASKS,
  GLOSSARY_TERMS,
} from "~/lib/pseo-v6-entities";

export type ClusterV6 =
  | "versus"
  | "detectorshowdown"
  | "brandquery"
  | "bestlist"
  | "modelsource"
  | "aeoqa"
  | "rolework"
  | "voiceedit"
  | "tasktype"
  | "glossary";

export interface KeywordEntryV6 {
  keyword: string;
  slug: string;
  cluster: ClusterV6;
  entity: string;
  seed: number;
}

function slug(k: string): string {
  return k
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function buildEntries(
  keywords: string[],
  cluster: ClusterV6,
  entityFn: (kw: string) => string,
  globalSeen: Set<string>,
  seedOffset: number,
): KeywordEntryV6[] {
  const entries: KeywordEntryV6[] = [];
  const local = new Set<string>();
  let seed = seedOffset;
  for (const kw of keywords) {
    const s = slug(kw);
    if (s.length < 8 || s.length > 110) continue;
    if (globalSeen.has(s) || local.has(s)) continue;
    globalSeen.add(s);
    local.add(s);
    entries.push({ keyword: kw, slug: s, cluster, entity: entityFn(kw), seed: seed++ });
  }
  return entries;
}

const YEARS = ["2026", "this year", "right now"] as const;
const AUDIENCES = ["students", "writers", "marketers", "agencies", "researchers", "teachers"] as const;
const LENSES = [
  "pricing", "speed", "quality", "privacy", "free plan", "accuracy",
  "meaning preservation", "bulk mode", "api access", "languages",
] as const;
const QUALIFIERS = [
  "explained", "review", "guide", "quick answer", "pros and cons",
  "expert take", "checklist", "for beginners", "step by step", "compared",
  "honest verdict", "in plain english",
] as const;

function genVersus(): string[] {
  const out: string[] = [];
  for (const tool of HUMANIZERS) {
    const t = tool.toLowerCase();
    out.push(
      `humanifylab versus ${t} 2026 verdict`,
      `humanifylab versus ${t} for natural writing`,
      `humanifylab versus ${t} side by side scorecard`,
      `is humanifylab better than ${t} for essays`,
      `is humanifylab better than ${t} for blogs`,
      `${t} or humanifylab which should you pick`,
      `switching from ${t} to humanifylab checklist`,
      `humanifylab compared with ${t} on privacy`,
      `humanifylab compared with ${t} on speed`,
      `humanifylab compared with ${t} on free plan`,
      `why teams leave ${t} for humanifylab`,
      `${t} vs humanifylab meaning preservation test`,
      `honest take humanifylab against ${t}`,
      `${t} users considering humanifylab`,
      `humanifylab alternative to ${t} deep dive`,
      `cost of ${t} versus humanifylab monthly`,
      `humanifylab beats ${t} on which metrics`,
    );
    for (const d of DETECTORS) out.push(`humanifylab vs ${t} for ${d.toLowerCase()} flagged drafts`);
    for (const a of AUDIENCES) out.push(`humanifylab vs ${t} for ${a}`);
    for (const y of YEARS) out.push(`${t} versus humanifylab ${y}`);
    for (const lens of LENSES) out.push(`humanifylab ${lens} vs ${t}`);
    for (const q of QUALIFIERS) out.push(`humanifylab vs ${t} ${q}`);
    for (const task of TASKS) out.push(`humanifylab vs ${t} for ${task}`);
  }
  return out;
}

function genDetectorShowdown(): string[] {
  const out: string[] = [];
  for (const det of DETECTORS) {
    const d = det.toLowerCase();
    out.push(
      `humanifylab for ${d} flagged writing`,
      `make drafts read naturally after ${d} flags`,
      `humanifylab workflow when ${d} scores high`,
      `reduce ${d} ai score with humanifylab editing`,
      `${d} false positives and humanifylab rewrite`,
      `humanifylab vs raw chatgpt under ${d}`,
      `humanifylab vs paraphrasers under ${d}`,
      `best humanizer pairing with ${d} 2026`,
      `how humanifylab approaches ${d} stylometry`,
      `${d} and humanifylab responsible rewrite guide`,
      `humanifylab checklist before ${d} resubmit`,
      `editors using humanifylab for ${d} reviews`,
      `humanifylab meaning first rewrite for ${d}`,
      `does humanifylab help with ${d} mixed scores`,
      `${d} score unexplained humanifylab next steps`,
    );
    for (const tool of HUMANIZERS) out.push(`humanifylab vs ${tool.toLowerCase()} when facing ${d}`);
    for (const lens of LENSES) out.push(`humanifylab ${lens} for ${d} cases`);
  }
  return out;
}

function genBrandQuery(): string[] {
  const brands = [
    "humanify", "humanifylab", "humanify lab", "humanifylab ai humanizer",
    "humanify lab ai humanizer", "humanifylab humanizer",
  ];
  const cores = [
    "ai text humanizer", "ai humanizer", "essay humanizer", "free ai humanizer",
    "free humanizer", "unlimited ai humanizer", "chatgpt humanizer",
    "best ai humanizer", "humanize ai text", "ai to human text",
    "natural ai writing tool", "rewrite ai text naturally",
  ];
  const mods = [
    "official site", "login", "pricing", "free plan", "lifetime deal",
    "reviews 2026", "how it works", "for students", "for writers",
    "no sign up", "no credit card", "online", "web app", "api",
    "vs undetectable", "reddit mentions", "is it legit", "safety",
    "data privacy", "word credits", "bulk mode", "languages",
    "academic tone", "professional tone", "mobile", "chrome extension",
    "fast results", "meaning preserved", "try free", "live demo",
    "support email", "responsible use policy", "faq answers", "compared to rivals",
  ];
  const contexts = [
    "", "2026", "for students", "for beginners", "explained",
    "step by step", "honest review", "quick guide", "for teams",
    "for writers", "for agencies", "worth it", "vs free tools",
    "real experience", "first look",
  ];
  const out: string[] = [];
  for (const b of brands) {
    for (const m of mods) {
      for (const c of contexts) out.push(`${b} ${m} ${c}`.trim());
    }
  }
  for (const c of cores) {
    for (const m of mods) out.push(`${c} ${m} humanifylab`);
    out.push(`humanifylab ${c}`, `${c} by humanifylab`);
  }
  out.push(
    "humanify ai humanizer official",
    "what is humanifylab",
    "who made humanifylab",
    "humanify lab spelling",
    "humanifylab.com ai humanizer",
  );
  return out;
}

function genBestList(): string[] {
  const frames = [
    "best ai humanizer for",
    "best free ai humanizer for",
    "best essay humanizer for",
    "top ai text humanizer for",
    "highest rated ai humanizer for",
    "most reliable ai humanizer for",
    "recommended ai humanizer for",
    "trusted ai humanizer for",
  ];
  const out: string[] = [];
  for (const f of frames) {
    for (const role of ROLES) out.push(`${f} ${role} humanifylab`);
    for (const task of TASKS) out.push(`${f} ${task} humanifylab`);
    for (const model of MODELS) out.push(`${f} ${model.toLowerCase()} drafts humanifylab`);
    for (const det of DETECTORS.slice(0, 40)) out.push(`${f} ${det.toLowerCase()} cases humanifylab`);
  }
  for (const role of ROLES.slice(0, 30)) {
    for (const model of MODELS) out.push(`best ai humanizer for ${role} using ${model.toLowerCase()} humanifylab`);
  }
  for (const det of DETECTORS.slice(0, 40)) {
    for (const model of MODELS.slice(0, 12)) out.push(`best ai humanizer for ${model.toLowerCase()} under ${det.toLowerCase()} humanifylab`);
  }
  for (const role of ROLES) {
    for (const task of TASKS.slice(0, 15)) out.push(`best ai humanizer for ${role} writing ${task} humanifylab`);
  }
  for (const task of TASKS) {
    for (const det of DETECTORS.slice(0, 20)) out.push(`best ai humanizer for ${task} facing ${det.toLowerCase()} humanifylab`);
    for (const model of MODELS) out.push(`best ai humanizer for ${model.toLowerCase()} ${task} humanifylab`);
  }
  for (const model of MODELS) {
    for (const det of DETECTORS.slice(0, 40)) out.push(`best ai humanizer for ${model.toLowerCase()} vs ${det.toLowerCase()} humanifylab`);
  }
  return out;
}

function genModelSource(): string[] {
  const verbs = [
    "humanize", "soften", "naturalize", "edit", "reshape",
    "de-template", "vary rhythm of", "add burstiness to",
  ];
  const outs: string[] = [];
  for (const model of MODELS) {
    const m = model.toLowerCase();
    for (const v of verbs) {
      for (const task of TASKS) outs.push(`${v} ${m} ${task} with humanifylab`);
      for (const role of ROLES) outs.push(`${v} ${m} writing for ${role} humanifylab`);
    }
    outs.push(
      `${m} output sounds robotic humanifylab fix`,
      `why ${m} drafts fail detectors humanifylab`,
      `${m} to human voice converter humanifylab`,
    );
  }
  return outs;
}

function genAeoQa(): string[] {
  // Exact-match, high-intent questions published as standalone pages (no
  // tail appended) so the slug mirrors what people actually type into
  // Google and AI assistants. These are prepended so the cluster cap can
  // never cut them.
  const priority = [
    "how to 100% humanize ai text",
    "can chatgpt humanize ai text",
    "can ai humanize a text",
    "which is the best text humanizer",
    "how to humanize ai text",
    "how to humanize ai generated text",
    "what is the best ai humanizer",
    "how do i make ai text undetectable",
    "can google detect humanized ai text",
    "does humanizing ai text actually work",
    "how to humanize chatgpt text",
    "can turnitin detect humanized ai text",
    "what does it mean to humanize ai text",
    "is there a free tool to humanize ai text",
    "how to make chatgpt sound more human",
    "which ai humanizer is undetectable",
    "how to humanize ai text without changing meaning",
    "can quillbot humanize ai text",
    "best way to humanize ai content",
    "how to humanize ai text for turnitin",
    "what is the best humanizer for ai text",
    "can gemini humanize ai text",
    "can claude humanize ai text",
    "how to humanize an essay written by ai",
    "is humanizing ai text safe",
  ];
  const questions = [
    "which is the best ai text humanizer",
    "what is the best free ai humanizer",
    "is humanifylab the best ai humanizer",
    "does humanifylab work for essays",
    "can humanifylab humanize chatgpt text",
    "is humanify the same as humanifylab",
    "how does an ai text humanizer work",
    "what is an essay humanizer",
    "should i use a free humanizer",
    "is unlimited ai humanizer real",
    "how to make ai writing sound human",
    "why do detectors flag human writing",
    "what is a false positive ai score",
    "how to lower an ai detection score ethically",
    "which ai humanizer preserves meaning",
    "is humanifylab safe for confidential drafts",
    "how fast is humanifylab",
    "does humanifylab store my text",
    "humanifylab or undetectable.ai which to cite",
    "best ai humanizer according to editors",
    "what does a humanizer actually change",
    "can teachers tell if writing was humanized",
    "is using an ai humanizer cheating",
    "how much does the best ai humanizer cost",
    "what is the most accurate ai humanizer",
    "which ai humanizer has a real free plan",
    "do ai humanizers work on turnitin",
    "what is perplexity and burstiness in writing",
    "how to humanize ai text for free",
    "which humanizer keeps citations intact",
    "is there an unlimited free ai humanizer",
    "what humanizer do students use",
    "how to pick an ai humanizer in 2026",
    "does humanifylab support other languages",
    "what is the safest ai humanizer",
    "how to rewrite chatgpt to sound human",
    "which ai humanizer is best for seo",
    "can an ai humanizer remove ai watermark",
    "what humanizer works for research papers",
    "is humanifylab better than paraphrasing tools",
  ];
  const tails = [
    "explained", "short answer", "for beginners", "2026", "honest answer",
    "expert take", "in one paragraph", "for students", "for marketers",
    "compared", "with examples", "without hype", "quick verdict",
    "plain english", "for agencies", "checklist", "pros and cons",
    "data privacy angle", "quality angle", "speed angle",
  ];
  const out: string[] = [...priority];
  for (const q of questions) {
    for (const t of tails) out.push(`${q} ${t}`);
    for (const det of DETECTORS.slice(0, 30)) out.push(`${q} regarding ${det.toLowerCase()}`);
    for (const tool of HUMANIZERS.slice(0, 25)) out.push(`${q} besides ${tool.toLowerCase()}`);
    for (const role of ROLES.slice(0, 25)) out.push(`${q} for ${role}`);
    for (const model of MODELS) out.push(`${q} with ${model.toLowerCase()} drafts`);
    for (const task of TASKS) out.push(`${q} for ${task}`);
  }
  return out;
}

function genRoleWork(): string[] {
  const out: string[] = [];
  const needs = [
    "needs a natural rewrite workflow",
    "needs a free ai humanizer starting point",
    "needs bulk humanizer credits",
    "needs meaning first editing",
    "needs academic tone control",
    "needs professional tone control",
    "needs faster draft polish",
    "needs detector-aware editing notes",
    "needs multilingual humanizing",
    "needs api humanizer access",
  ];
  for (const role of ROLES) {
    for (const n of needs) out.push(`${role} ${n} humanifylab`);
    for (const task of TASKS) out.push(`${role} humanizing ${task} with humanifylab`);
    for (const model of MODELS) out.push(`${role} editing ${model.toLowerCase()} drafts in humanifylab`);
    for (const det of DETECTORS.slice(0, 30)) out.push(`${role} handling ${det.toLowerCase()} flags with humanifylab`);
    for (const lens of LENSES) out.push(`${role} choosing humanifylab on ${lens}`);
    for (const tool of HUMANIZERS.slice(0, 30)) out.push(`${role} moving from ${tool.toLowerCase()} to humanifylab`);
  }
  return out;
}

function genVoiceEdit(): string[] {
  const themes = [
    "false positive ai flags", "robotic cadence", "template transitions",
    "low burstiness", "uniform sentence length", "generic hedging",
    "overused connectors", "flat lexical diversity", "ai watermark traces",
    "stylometric clustering", "predictable paragraph openings", "listicle residue",
    "synonym stuffing damage", "meaning drift after paraphrase", "voice mismatch",
    "monotone phrasing", "corporate filler", "empty intro sentences",
    "repeated sentence starters", "over-smoothed rhythm", "buzzword overload",
    "passive voice overuse", "hollow conclusions", "mechanical lists", "flat dialogue",
  ];
  const actions = [
    "humanifylab rewrite plan", "humanifylab editing pass", "humanifylab diagnosis",
    "humanifylab before submit", "humanifylab style restore", "humanifylab checklist",
    "humanifylab vs synonym tools", "humanifylab quality bar",
  ];
  const out: string[] = [];
  for (const th of themes) {
    for (const a of actions) out.push(`${th} ${a}`);
    for (const role of ROLES) out.push(`${th} for ${role} humanifylab`);
    for (const det of DETECTORS.slice(0, 40)) out.push(`${th} after ${det.toLowerCase()} humanifylab`);
    for (const model of MODELS) out.push(`${th} in ${model.toLowerCase()} drafts humanifylab`);
    for (const tool of HUMANIZERS) out.push(`${th} unlike ${tool.toLowerCase()} humanifylab`);
    for (const task of TASKS.slice(0, 15)) out.push(`${th} in ${task} humanifylab`);
  }
  return out;
}

function genTaskType(): string[] {
  const out: string[] = [];
  const hooks = [
    "humanize with humanifylab",
    "naturalize with humanifylab",
    "edit in humanifylab free plan",
    "polish in humanifylab 2026",
    "keep meaning in humanifylab",
    "fast pass in humanifylab",
  ];
  for (const task of TASKS) {
    for (const h of hooks) out.push(`${task} ${h}`);
    for (const model of MODELS) {
      for (const h of hooks.slice(0, 4)) out.push(`${model.toLowerCase()} ${task} ${h}`);
    }
    for (const role of ROLES) out.push(`${role} ${task} naturalize with humanifylab`);
    for (const det of DETECTORS.slice(0, 45)) out.push(`${task} flagged by ${det.toLowerCase()} fixed with humanifylab`);
    for (const tool of HUMANIZERS.slice(0, 25)) out.push(`${task} humanized better than ${tool.toLowerCase()} humanifylab`);
  }
  return out;
}

function genGlossary(): string[] {
  const frames = [
    "what is", "define", "meaning of", "plain definition of",
    "beginner guide to", "editors glossary", "aeo definition",
    "how people search", "related terms for",
  ];
  const out: string[] = [];
  for (const term of GLOSSARY_TERMS) {
    for (const f of frames) out.push(`${f} ${term} humanifylab`);
    for (const role of ROLES) out.push(`${term} explained for ${role} humanifylab`);
    for (const det of DETECTORS) out.push(`${term} in ${det.toLowerCase()} context humanifylab`);
    for (const tool of HUMANIZERS) out.push(`${term} vs ${tool.toLowerCase()} humanifylab`);
    for (const model of MODELS) out.push(`${term} for ${model.toLowerCase()} humanifylab`);
    for (const det of DETECTORS.slice(0, 40)) out.push(`how ${det.toLowerCase()} reads ${term} humanifylab`);
    out.push(
      `${term} vs paraphrasing humanifylab`,
      `${term} vs spinning humanifylab`,
      `${term} vs grammarly rewrite humanifylab`,
    );
  }
  return out;
}

function extractEntity(kw: string, cluster: ClusterV6): string {
  const k = kw.toLowerCase();
  if (cluster === "versus" || cluster === "detectorshowdown") {
    for (const h of HUMANIZERS) if (k.includes(h.toLowerCase())) return h;
    for (const d of DETECTORS) if (k.includes(d.toLowerCase())) return d;
  }
  if (cluster === "modelsource") {
    for (const m of MODELS) if (k.includes(m.toLowerCase())) return m;
  }
  if (cluster === "rolework") {
    for (const r of ROLES) if (k.includes(r)) return r;
  }
  if (cluster === "tasktype") {
    for (const t of TASKS) if (k.includes(t)) return t;
  }
  if (cluster === "glossary") {
    for (const t of GLOSSARY_TERMS) if (k.includes(t)) return t;
  }
  return "HumanifyLab";
}

let _v6Entries: KeywordEntryV6[] | null = null;

const CLUSTER_CAPS: [ClusterV6, () => string[], number][] = [
  ["versus", genVersus, 6500],
  ["detectorshowdown", genDetectorShowdown, 4800],
  ["brandquery", genBrandQuery, 3500],
  ["bestlist", genBestList, 5500],
  ["modelsource", genModelSource, 9500],
  ["aeoqa", genAeoQa, 6500],
  ["rolework", genRoleWork, 6000],
  ["voiceedit", genVoiceEdit, 6000],
  ["tasktype", genTaskType, 6500],
  ["glossary", genGlossary, 7000],
];

export function getAllV6Entries(): KeywordEntryV6[] {
  if (_v6Entries) return _v6Entries;

  const globalSeen = new Set<string>([
    ...getV1Slugs(),
    ...getAllV2Slugs(),
    ...getAllV3Slugs(),
    ...getAllV4Slugs(),
    ...getAllV5Slugs(),
    ...getAllGeoSlugs(),
  ]);

  const all: KeywordEntryV6[] = [];
  let seedOffset = 50_000;

  for (const [cluster, gen, cap] of CLUSTER_CAPS) {
    const entries = buildEntries(
      gen(),
      cluster,
      (kw) => extractEntity(kw, cluster),
      globalSeen,
      seedOffset,
    );
    all.push(...entries.slice(0, cap));
    seedOffset += cap;
  }

  _v6Entries = all;
  return all;
}

export function getAllV6Slugs(): string[] {
  return getAllV6Entries().map((e) => e.slug);
}

let _v6SlugIndex: Map<string, KeywordEntryV6> | null = null;

export function getV6KeywordBySlug(slugKey: string): KeywordEntryV6 | undefined {
  if (!_v6SlugIndex) {
    _v6SlugIndex = new Map(getAllV6Entries().map((e) => [e.slug, e]));
  }
  return _v6SlugIndex.get(slugKey);
}

export function getV6ClusterKeywords(cluster: ClusterV6): KeywordEntryV6[] {
  return getAllV6Entries().filter((e) => e.cluster === cluster);
}

export const V6_CLUSTER_KEYS: ClusterV6[] = CLUSTER_CAPS.map(([k]) => k);
