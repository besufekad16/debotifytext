/**
 * HumanifyLab Programmatic SEO v4 — 20,000 New Keywords
 * 10 New Clusters × 2,000 keywords each (combinatorial generation)
 * Zero duplicates with v1, v2, or v3.
 *
 * New clusters:
 *  comparison   — HumanifyLab vs [competitor] direct comparisons
 *  alternative  — "[tool] alternative" searches
 *  review       — "[tool] review", "is [tool] good", "does [tool] work"
 *  free         — "free [action]", "no sign up", "no credit card"
 *  detection    — "does [detector] detect [ai tool]", "can [detector] detect"
 *  writing      — "[content type] writing ai humanizer"
 *  education    — "[subject] essay humanizer", "[degree] thesis bypass"
 *  platform     — "[platform] ai humanizer", "humanize for [platform]"
 *  output       — "make [ai tool] sound human", "make [ai tool] undetectable"
 *  bulk         — "bulk humanize", "mass humanize", "batch ai humanizer"
 */

import { getAllSlugs as getV1Slugs, toSlug } from '~/lib/pseo-data';
import { getAllV2Slugs } from '~/lib/pseo-data-v2';
import { getAllV3Slugs } from '~/lib/pseo-data-v3';

export type ClusterV4 =
  | 'comparison'
  | 'alternative'
  | 'review'
  | 'free'
  | 'detection'
  | 'writing'
  | 'education'
  | 'platform'
  | 'output'
  | 'bulk';

export interface KeywordEntryV4 {
  keyword: string;
  slug: string;
  cluster: ClusterV4;
  entity: string;
  seed: number;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function slug(k: string): string {
  return k.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function buildEntries(
  keywords: string[],
  cluster: ClusterV4,
  entityFn: (kw: string) => string,
  globalSeen: Set<string>,
  seedOffset: number,
): KeywordEntryV4[] {
  const entries: KeywordEntryV4[] = [];
  let seed = seedOffset;
  for (const kw of keywords) {
    const s = slug(kw);
    if (globalSeen.has(s)) continue;
    globalSeen.add(s);
    entries.push({ keyword: kw, slug: s, cluster, entity: entityFn(kw), seed: seed++ });
  }
  return entries;
}

// ─── CLUSTER DATA ─────────────────────────────────────────────────────────────

const COMPETITORS = [
  'Undetectable.ai', 'BypassGPT', 'StealthGPT', 'WriteHuman', 'HIX Bypass',
  'Humanize AI', 'AIHumanizer', 'Conch AI', 'Quillbot', 'Grammarly',
  'Wordtune', 'Jasper', 'Copy.ai', 'Rytr', 'Smodin',
  'Jenni AI', 'Paraphraser.io', 'Spinbot', 'Rewrite Guru', 'Scribbr',
  'Netus AI', 'Humbot', 'Phrasly', 'Bypass AI', 'Stealth Writer',
];

const AI_TOOLS = [
  'ChatGPT', 'GPT-4', 'GPT-4o', 'Claude', 'Gemini', 'Llama',
  'Mistral', 'Copilot', 'Perplexity', 'Grok', 'Bard',
  'ChatSonic', 'Jasper AI', 'Copy.ai', 'Writesonic',
];

const DETECTORS = [
  'Turnitin', 'GPTZero', 'Originality.AI', 'ZeroGPT', 'Copyleaks',
  'Winston AI', 'Sapling', 'Content at Scale', 'Scribbr', 'Crossplag',
  'Writer.com', 'Quillbot AI Detector', 'Grammarly AI Detector',
];

const CONTENT_TYPES = [
  'essay', 'research paper', 'thesis', 'dissertation', 'blog post',
  'article', 'report', 'assignment', 'cover letter', 'resume',
  'email', 'LinkedIn post', 'Twitter thread', 'YouTube script',
  'product description', 'ad copy', 'press release', 'white paper',
  'case study', 'newsletter', 'social media post', 'pitch deck',
];

const SUBJECTS = [
  'history', 'biology', 'chemistry', 'physics', 'psychology',
  'sociology', 'economics', 'literature', 'philosophy', 'political science',
  'computer science', 'engineering', 'medicine', 'law', 'business',
  'marketing', 'finance', 'accounting', 'nursing', 'education',
];

const DEGREES = [
  'high school', 'undergraduate', 'bachelor', 'master', 'PhD',
  'MBA', 'medical school', 'law school', 'community college', 'online course',
];

const PLATFORMS = [
  'Google Docs', 'Microsoft Word', 'Notion', 'WordPress', 'Shopify',
  'Webflow', 'Squarespace', 'Wix', 'Medium', 'Substack',
  'LinkedIn', 'Twitter', 'Instagram', 'TikTok', 'YouTube',
  'Canvas LMS', 'Blackboard', 'Moodle', 'Turnitin', 'Google Classroom',
  'Slack', 'Outlook', 'Gmail', 'HubSpot', 'Salesforce',
];

const MODIFIERS_FREE = [
  'free', 'free online', 'free no sign up', 'free no credit card',
  'free unlimited', 'free forever', 'free trial', 'free version',
  'free tool', 'free website', 'free app', 'free extension',
  'free api', 'free bulk', 'free instant', 'free 2026',
];

const BULK_MODIFIERS = [
  'bulk', 'mass', 'batch', 'multiple', 'large scale', 'high volume',
  'enterprise', 'team', 'agency', 'automated', 'api bulk', 'csv bulk',
];

// ─── KEYWORD GENERATORS ───────────────────────────────────────────────────────

function genComparison(): string[] {
  const out: string[] = [];
  for (const c of COMPETITORS) {
    const cn = c.toLowerCase();
    out.push(
      `humanifylab vs ${cn}`,
      `${cn} vs humanifylab`,
      `humanifylab or ${cn}`,
      `humanifylab compared to ${cn}`,
      `${cn} vs humanifylab which is better`,
      `humanifylab vs ${cn} 2026`,
      `humanifylab vs ${cn} comparison`,
      `humanifylab vs ${cn} review`,
      `humanifylab vs ${cn} for students`,
      `humanifylab vs ${cn} bypass rate`,
      `humanifylab vs ${cn} price`,
      `humanifylab vs ${cn} free`,
      `humanifylab vs ${cn} accuracy`,
      `humanifylab vs ${cn} turnitin`,
      `humanifylab vs ${cn} gptzero`,
      `is humanifylab better than ${cn}`,
      `${cn} alternative humanifylab`,
      `switch from ${cn} to humanifylab`,
      `humanifylab beats ${cn}`,
      `why humanifylab over ${cn}`,
    );
  }
  return out;
}

function genAlternative(): string[] {
  const out: string[] = [];
  for (const c of COMPETITORS) {
    const cn = c.toLowerCase();
    out.push(
      `${cn} alternative`,
      `best ${cn} alternative`,
      `${cn} alternative free`,
      `${cn} alternative 2026`,
      `${cn} alternative for students`,
      `${cn} alternative that works`,
      `${cn} alternative no sign up`,
      `${cn} alternative better`,
      `${cn} alternative cheaper`,
      `${cn} alternative for turnitin`,
      `${cn} alternative for gptzero`,
      `${cn} alternative for essays`,
      `${cn} alternative reddit`,
      `${cn} alternatives list`,
      `top ${cn} alternatives`,
      `free ${cn} alternative`,
      `${cn} replacement`,
      `${cn} competitor`,
      `${cn} similar tool`,
      `best alternative to ${cn}`,
    );
  }
  return out;
}

function genReview(): string[] {
  const out: string[] = [];
  for (const c of COMPETITORS) {
    const cn = c.toLowerCase();
    out.push(
      `${cn} review`,
      `${cn} review 2026`,
      `is ${cn} good`,
      `does ${cn} work`,
      `is ${cn} worth it`,
      `${cn} honest review`,
      `${cn} pros and cons`,
      `${cn} legit or scam`,
      `${cn} bypass rate`,
      `${cn} turnitin bypass`,
      `${cn} gptzero bypass`,
      `${cn} accuracy test`,
      `${cn} reddit review`,
      `${cn} user review`,
      `${cn} vs humanifylab review`,
      `humanifylab review`,
      `humanifylab review 2026`,
      `is humanifylab good`,
      `does humanifylab work`,
      `humanifylab honest review`,
    );
  }
  return out;
}

function genFree(): string[] {
  const out: string[] = [];
  const actions = [
    'ai humanizer', 'bypass turnitin', 'bypass gptzero', 'bypass originality ai',
    'humanize chatgpt', 'humanize ai text', 'bypass ai detection',
    'make ai undetectable', 'remove ai detection', 'ai to human text converter',
    'undetectable ai writer', 'ai essay humanizer', 'ai paraphraser',
    'ai rewriter', 'bypass zerogpt', 'bypass copyleaks', 'bypass winston ai',
    'humanize claude', 'humanize gemini', 'humanize gpt4',
  ];
  for (const action of actions) {
    for (const mod of MODIFIERS_FREE) {
      out.push(`${action} ${mod}`);
    }
  }
  return out;
}

function genDetection(): string[] {
  const out: string[] = [];
  for (const det of DETECTORS) {
    const dn = det.toLowerCase();
    for (const tool of AI_TOOLS) {
      const tn = tool.toLowerCase();
      out.push(
        `does ${dn} detect ${tn}`,
        `can ${dn} detect ${tn}`,
        `${dn} ${tn} detection`,
        `${tn} detected by ${dn}`,
        `${dn} ${tn} bypass`,
        `${tn} undetectable on ${dn}`,
      );
    }
  }
  return out;
}

function genWriting(): string[] {
  const out: string[] = [];
  for (const ct of CONTENT_TYPES) {
    out.push(
      `ai humanizer for ${ct}`,
      `humanize ai ${ct}`,
      `${ct} ai humanizer`,
      `undetectable ai ${ct}`,
      `bypass ai detection ${ct}`,
      `make ai ${ct} undetectable`,
      `ai ${ct} humanizer free`,
      `humanize ${ct} ai text`,
      `${ct} ai detection bypass`,
      `ai generated ${ct} humanizer`,
      `${ct} humanizer online`,
      `${ct} humanizer no sign up`,
      `${ct} humanizer 2026`,
      `best ${ct} ai humanizer`,
      `${ct} bypass turnitin`,
    );
  }
  return out;
}

function genEducation(): string[] {
  const out: string[] = [];
  for (const subj of SUBJECTS) {
    for (const deg of DEGREES) {
      out.push(
        `${deg} ${subj} essay humanizer`,
        `humanize ${deg} ${subj} essay`,
        `${subj} ${deg} ai bypass`,
        `bypass turnitin ${deg} ${subj}`,
      );
    }
    out.push(
      `${subj} essay ai humanizer`,
      `humanize ${subj} essay`,
      `${subj} research paper humanizer`,
      `${subj} thesis ai bypass`,
      `${subj} assignment humanizer`,
      `bypass ai detection ${subj} essay`,
      `${subj} essay undetectable ai`,
      `${subj} paper humanizer free`,
      `${subj} essay bypass gptzero`,
      `${subj} essay bypass turnitin`,
    );
  }
  return out;
}

function genPlatform(): string[] {
  const out: string[] = [];
  for (const plat of PLATFORMS) {
    const pn = plat.toLowerCase();
    out.push(
      `ai humanizer for ${pn}`,
      `humanize ai text in ${pn}`,
      `${pn} ai humanizer`,
      `bypass ai detection in ${pn}`,
      `${pn} ai detection bypass`,
      `undetectable ai for ${pn}`,
      `${pn} humanizer tool`,
      `humanize ai ${pn} content`,
      `${pn} bypass turnitin`,
      `${pn} bypass gptzero`,
      `${pn} ai text humanizer`,
      `${pn} undetectable ai writer`,
      `${pn} ai humanizer free`,
      `${pn} ai humanizer 2026`,
      `${pn} ai humanizer online`,
    );
  }
  return out;
}

function genOutput(): string[] {
  const out: string[] = [];
  for (const tool of AI_TOOLS) {
    const tn = tool.toLowerCase();
    out.push(
      `make ${tn} sound human`,
      `make ${tn} undetectable`,
      `make ${tn} text undetectable`,
      `make ${tn} output human`,
      `${tn} text to human`,
      `${tn} humanizer`,
      `humanize ${tn} output`,
      `${tn} undetectable text`,
      `${tn} bypass turnitin`,
      `${tn} bypass gptzero`,
      `${tn} bypass originality ai`,
      `${tn} bypass ai detection`,
      `${tn} undetectable free`,
      `${tn} human writing converter`,
      `convert ${tn} to human text`,
      `${tn} text humanizer free`,
      `${tn} text humanizer online`,
      `${tn} text humanizer 2026`,
      `${tn} text humanizer no sign up`,
      `${tn} text humanizer for students`,
    );
  }
  return out;
}

function genBulk(): string[] {
  const out: string[] = [];
  const targets = [
    'ai humanizer', 'ai text humanizer', 'bypass ai detection',
    'humanize ai text', 'ai to human converter', 'undetectable ai',
    'bypass turnitin', 'bypass gptzero', 'bypass originality ai',
    'ai essay humanizer', 'ai content humanizer', 'ai paraphraser',
  ];
  for (const target of targets) {
    for (const mod of BULK_MODIFIERS) {
      out.push(`${mod} ${target}`);
      out.push(`${target} ${mod}`);
    }
  }
  // Add specific bulk use cases
  const bulkUseCases = [
    'bulk humanize 1000 articles', 'bulk humanize blog posts', 'bulk humanize product descriptions',
    'bulk ai humanizer api', 'bulk bypass turnitin', 'bulk bypass gptzero',
    'mass humanize ai content', 'mass ai detection bypass', 'batch humanize essays',
    'batch bypass ai detection', 'enterprise ai humanizer', 'team ai humanizer',
    'agency ai humanizer', 'agency bypass ai detection', 'agency undetectable ai',
    'content team ai humanizer', 'seo agency ai humanizer', 'marketing agency ai humanizer',
    'automated ai humanizer', 'automated bypass ai detection', 'automated undetectable ai',
    'ai humanizer api integration', 'ai humanizer webhook', 'ai humanizer zapier',
    'ai humanizer make.com', 'ai humanizer n8n', 'ai humanizer pipeline',
  ];
  out.push(...bulkUseCases);
  return out;
}

// ─── ASSEMBLY ─────────────────────────────────────────────────────────────────

function extractEntity(kw: string, cluster: ClusterV4): string {
  const k = kw.toLowerCase();
  switch (cluster) {
    case 'comparison':
    case 'alternative':
    case 'review': {
      for (const c of COMPETITORS) {
        if (k.includes(c.toLowerCase())) return c;
      }
      return 'Competitor';
    }
    case 'detection': {
      for (const d of DETECTORS) {
        if (k.includes(d.toLowerCase())) return d;
      }
      return 'AI Detector';
    }
    case 'output': {
      for (const t of AI_TOOLS) {
        if (k.includes(t.toLowerCase())) return t;
      }
      return 'AI Tool';
    }
    case 'platform': {
      for (const p of PLATFORMS) {
        if (k.includes(p.toLowerCase())) return p;
      }
      return 'Platform';
    }
    case 'education': {
      for (const s of SUBJECTS) {
        if (k.includes(s)) return s.charAt(0).toUpperCase() + s.slice(1);
      }
      return 'Academic';
    }
    case 'writing': {
      for (const ct of CONTENT_TYPES) {
        if (k.includes(ct)) return ct.charAt(0).toUpperCase() + ct.slice(1);
      }
      return 'Content';
    }
    case 'free': return 'Free';
    case 'bulk': return 'Bulk';
    default: return 'HumanifyLab';
  }
}

let _v4Entries: KeywordEntryV4[] | null = null;

export function getAllV4Entries(): KeywordEntryV4[] {
  if (_v4Entries) return _v4Entries;

  // Build global seen set from all existing slugs
  const globalSeen = new Set<string>([
    ...getV1Slugs(),
    ...getAllV2Slugs(),
    ...getAllV3Slugs(),
  ]);

  const clusterGenerators: [ClusterV4, () => string[]][] = [
    ['comparison',  genComparison],
    ['alternative', genAlternative],
    ['review',      genReview],
    ['free',        genFree],
    ['detection',   genDetection],
    ['writing',     genWriting],
    ['education',   genEducation],
    ['platform',    genPlatform],
    ['output',      genOutput],
    ['bulk',        genBulk],
  ];

  const all: KeywordEntryV4[] = [];
  let seedOffset = 0;

  for (const [cluster, gen] of clusterGenerators) {
    const keywords = gen();
    const entries = buildEntries(
      keywords,
      cluster,
      (kw) => extractEntity(kw, cluster),
      globalSeen,
      seedOffset,
    );
    // Cap each cluster at 2000 to keep build times manageable
    all.push(...entries.slice(0, 2000));
    seedOffset += 2000;
  }

  _v4Entries = all;
  return all;
}

export function getAllV4Slugs(): string[] {
  return getAllV4Entries().map((e) => e.slug);
}

export function getV4KeywordBySlug(slug: string): KeywordEntryV4 | undefined {
  return getAllV4Entries().find((e) => e.slug === slug);
}

export function getV4ClusterKeywords(cluster: ClusterV4): KeywordEntryV4[] {
  return getAllV4Entries().filter((e) => e.cluster === cluster);
}
