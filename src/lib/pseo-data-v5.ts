/**
 * HumanifyLab Programmatic SEO v5 — ~20,000 New Keywords
 * 5 New Clusters (combinatorial generation), zero AI-API cost, zero
 * duplicates with v1, v2, v3, v4, or geo.
 *
 * Why these 5 clusters specifically: v1-v4 already densely cover
 * competitor/tool/detector/subject/platform/audience angles (see
 * pseo-clusters.ts for the full existing map). These 5 target genuinely
 * uncovered search intent instead of re-slicing the same angles:
 *
 *  city      — hyperlocal "ai humanizer in {city}" (existing `geo` cluster
 *              is country/region-level only — 7 pages. This is city-level.)
 *  question  — natural-language Q&A ("is X safe", "does X work") for
 *              featured-snippet / voice-search intent. `howto` (v1) is
 *              imperative ("how to X"); this is interrogative.
 *  feature   — specific product-capability commercial intent ("ai
 *              humanizer with bulk processing"). Distinct from `quality`
 *              (output-quality claims) and `tool` (specific app integration).
 *  length    — word-count-specific humanizing intent ("humanize a 2000
 *              word essay"). Not covered anywhere in v1-v4.
 *  scenario  — first-person, pre-submission anxiety/reassurance queries
 *              ("my professor said my essay sounds like ai"). Distinct
 *              from v3 `problem`, which is strictly post-flag ("turnitin
 *              caught my chatgpt, how do I fix it").
 *
 * Each cluster is capped after global-slug dedupe against v1+v2+v3+v4+geo
 * (and against itself) — see getAllV5Entries(). Actual yield is reported
 * by scripts/verify-v5-dedup.ts; the caps below are upper bounds, not
 * guarantees, exactly like v3/v4's existing caps.
 */

import { getAllSlugs as getV1Slugs } from '~/lib/pseo-data';
import { getAllV2Slugs } from '~/lib/pseo-data-v2';
import { getAllV3Slugs } from '~/lib/pseo-data-v3';
import { getAllV4Slugs } from '~/lib/pseo-data-v4';
import { getAllGeoSlugs } from '~/lib/pseo-data-geo';

export type ClusterV5 = 'city' | 'question' | 'feature' | 'length' | 'scenario';

export interface KeywordEntryV5 {
  keyword: string;
  slug: string;
  cluster: ClusterV5;
  entity: string;
  seed: number;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function slug(k: string): string {
  return k.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function buildEntries(
  keywords: string[],
  cluster: ClusterV5,
  entityFn: (kw: string) => string,
  globalSeen: Set<string>,
  seedOffset: number,
): KeywordEntryV5[] {
  const entries: KeywordEntryV5[] = [];
  const localSeen = new Set<string>();
  let seed = seedOffset;
  for (const kw of keywords) {
    const s = slug(kw);
    if (globalSeen.has(s) || localSeen.has(s)) continue;
    globalSeen.add(s);
    localSeen.add(s);
    entries.push({ keyword: kw, slug: s, cluster, entity: entityFn(kw), seed: seed++ });
  }
  return entries;
}

// ─── CITY DATA ────────────────────────────────────────────────────────────────

const CITIES = [
  // United States
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'Austin', 'Boston', 'Seattle',
  'Denver', 'Atlanta', 'Miami', 'San Francisco', 'Washington DC', 'Las Vegas',
  'Portland', 'Nashville', 'Detroit', 'Minneapolis', 'New Orleans', 'Orlando',
  'Sacramento', 'Pittsburgh', 'Cincinnati', 'Cleveland', 'Kansas City',
  'Columbus', 'Charlotte', 'Indianapolis', 'San Jose', 'Baltimore',
  'Milwaukee', 'Tampa', 'Raleigh', 'St Louis', 'Salt Lake City', 'Richmond',
  'Buffalo', 'Albany', 'Providence', 'Hartford', 'Jacksonville', 'Memphis',
  'Louisville', 'Oklahoma City', 'Tucson', 'Fresno', 'Albuquerque', 'Omaha',
  // United Kingdom
  'London', 'Manchester', 'Birmingham UK', 'Leeds', 'Glasgow', 'Liverpool',
  'Edinburgh', 'Bristol', 'Sheffield', 'Newcastle', 'Nottingham', 'Cardiff',
  'Belfast', 'Oxford', 'Cambridge UK', 'Southampton', 'Leicester', 'Coventry',
  'Aberdeen', 'Brighton',
  // Canada
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton',
  'Winnipeg', 'Quebec City', 'Hamilton Canada', 'Victoria Canada',
  // Australia
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra',
  'Gold Coast', 'Newcastle Australia', 'Hobart', 'Darwin',
  // India
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Surat', 'Indore',
  // Nigeria
  'Lagos', 'Abuja', 'Ibadan', 'Port Harcourt', 'Kano',
  // Philippines
  'Manila', 'Quezon City', 'Cebu', 'Davao',
  // South Africa
  'Johannesburg', 'Cape Town', 'Pretoria', 'Durban',
  // Pakistan
  'Karachi', 'Lahore', 'Islamabad',
  // Kenya / Ghana
  'Nairobi', 'Mombasa', 'Accra', 'Kumasi',
  // Ireland / New Zealand
  'Dublin', 'Cork', 'Auckland', 'Wellington',
  // Middle East / Asia
  'Dubai', 'Abu Dhabi', 'Singapore', 'Kuala Lumpur', 'Manama', 'Doha', 'Riyadh',
  // Europe
  'Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Paris', 'Lyon', 'Amsterdam',
  'Rotterdam', 'Zurich', 'Geneva', 'Stockholm', 'Copenhagen', 'Oslo',
  'Helsinki', 'Warsaw', 'Vienna', 'Brussels', 'Lisbon', 'Madrid', 'Barcelona',
  'Rome', 'Milan',
];

const CITY_TEMPLATES = [
  (c: string) => `ai humanizer in ${c}`,
  (c: string) => `best ai humanizer ${c}`,
  (c: string) => `ai humanizer ${c} students`,
  (c: string) => `free ai humanizer ${c}`,
  (c: string) => `ai text humanizer ${c}`,
  (c: string) => `bypass ai detection ${c}`,
  (c: string) => `undetectable ai ${c}`,
  (c: string) => `humanize ai text ${c}`,
  (c: string) => `ai detector bypass ${c}`,
  (c: string) => `ai writing tool ${c}`,
  (c: string) => `ai humanizer near ${c}`,
  (c: string) => `${c} ai humanizer for students`,
  (c: string) => `${c} ai humanizer for writers`,
  (c: string) => `${c} ai humanizer for content creators`,
  (c: string) => `ai humanizer service ${c}`,
  (c: string) => `online ai humanizer ${c}`,
  (c: string) => `ai humanizer app ${c}`,
  (c: string) => `chatgpt humanizer ${c}`,
  (c: string) => `ai essay humanizer ${c}`,
  (c: string) => `ai humanizer for university students ${c}`,
  (c: string) => `ai humanizer for freelancers ${c}`,
  (c: string) => `top ai humanizer ${c}`,
  (c: string) => `ai humanizer reviews ${c}`,
  (c: string) => `ai humanizer 2026 ${c}`,
  (c: string) => `humanize chatgpt text ${c}`,
  (c: string) => `ai detection bypass tool ${c}`,
  (c: string) => `ai humanizer for bloggers ${c}`,
  (c: string) => `ai humanizer for marketers ${c}`,
];

function genCity(): string[] {
  const out: string[] = [];
  for (const city of CITIES) {
    const cn = city.replace(/ (UK|Canada|Australia)$/, '').toLowerCase();
    for (const tpl of CITY_TEMPLATES) out.push(tpl(cn));
  }
  return out;
}

// ─── QUESTION DATA ────────────────────────────────────────────────────────────

const QUESTION_TOPICS = [
  'ai humanizer', 'chatgpt humanizer', 'claude humanizer', 'gemini humanizer',
  'ai text humanizer', 'ai paraphrasing tool', 'ai detector', 'turnitin ai detection',
  'gptzero', 'originality ai', 'copyleaks', 'zerogpt', 'winston ai',
  'sapling ai detector', 'grammarly ai detector', 'quillbot ai detector',
  'ai humanizer for essays', 'ai humanizer for students', 'bypass ai detection',
  'undetectable ai writing', 'ai content detector', 'ai writing tools',
  'chatgpt for essays', 'ai generated content', 'ai humanizer safety',
  'ai humanizer accuracy', 'ai humanizer plagiarism', 'using ai to write essays',
  'ai humanizer for business', 'ai humanizer for marketing', 'ai humanizer for resumes',
  'ai humanizer api', 'ai humanizer subscription', 'ai humanizer free trial',
  'ai humanizer vs paraphrasing tool', 'ai humanizer legality', 'ai detection technology',
  'ai writing detection accuracy', 'turnitin ai score', 'gptzero accuracy',
  'ai humanizer for teachers', 'ai humanizer ethics', 'ai humanizer for professionals',
  'humanized ai text', 'ai humanizer word limit', 'ai humanizer languages',
  'ai humanizer mobile app', 'ai humanizer chrome extension', 'ai humanizer for word documents',
  'ai humanizer for google docs', 'ai humanizer for thesis', 'ai humanizer for dissertations',
  'ai humanizer for cover letters', 'ai humanizer for linkedin', 'ai detection in schools',
  'ai detection in universities', 'ai detection policy', 'academic integrity and ai',
  'ai writing in journalism', 'ai writing for seo', 'ai content ranking on google',
  'google penalizing ai content', 'ai content and search rankings', 'ai humanizer for blogs',
  'ai humanizer for ebooks', 'ai humanizer for scripts', 'ai humanizer for social media',
  'humanizing ai for emails', 'ai humanizer output quality', 'ai humanizer meaning preservation',
  'ai humanizer speed', 'ai humanizer for bulk content', 'ai humanizer team plans',
  'ai humanizer enterprise plans', 'ai humanizer data privacy', 'ai humanizer gdpr compliance',
  'is chatgpt content detectable', 'is claude content detectable', 'is gemini content detectable',
  'ai detectors accuracy 2026', 'false positives in ai detection', 'ai detection reliability',
  'turnitin false positive rate', 'gptzero false positive rate', 'ai humanizer refund policy',
  'ai humanizer customer support', 'ai humanizer for nonprofit', 'ai humanizer student discount',
  'ai humanizer vs human editor', 'ai humanizer vs ghostwriter', 'ai humanizer for translation',
  'ai humanizer multilingual accuracy', 'ai humanizer for spanish text', 'ai humanizer for french text',
  'ai humanizer for german text', 'ai humanizer browser compatibility', 'ai humanizer offline use',
  'ai humanizer file upload', 'ai humanizer pdf support', 'ai humanizer docx support',
  'ai humanizer character limit', 'ai humanizer daily limit', 'ai humanizer history log',
  'ai humanizer version control', 'ai humanizer collaboration features', 'ai humanizer for agencies',
  'ai humanizer for consultants', 'ai humanizer for researchers', 'ai humanizer for journalists',
  'ai humanizer for authors', 'ai humanizer for copywriters', 'ai humanizer for grant writers',
  'ai humanizer trustworthiness', 'best ai humanizer 2026', 'top rated ai humanizer',
  'ai humanizer comparison 2026', 'new ai detectors 2026', 'future of ai detection',
  'ai writing detection lawsuits', 'ai content disclosure rules', 'ai humanizer terms of service',
  'ai humanizer money back guarantee', 'ai humanizer for k12 schools', 'ai humanizer for esl writers',
  'ai humanizer for non native speakers', 'ai humanizer for dyslexia', 'ai humanizer accessibility',
  'ai humanizer word count accuracy', 'ai humanizer tone options', 'ai humanizer formatting preservation',
  'ai humanizer citation preservation', 'ai humanizer for apa format', 'ai humanizer for mla format',
];

const QUESTION_STEMS: ((t: string) => string)[] = [
  (t) => `is ${t} safe`,
  (t) => `is ${t} worth it`,
  (t) => `does ${t} work`,
  (t) => `how does ${t} work`,
  (t) => `how accurate is ${t}`,
  (t) => `can teachers tell if you use ${t}`,
  (t) => `can professors detect ${t}`,
  (t) => `will ${t} get me caught`,
  (t) => `is ${t} detectable`,
  (t) => `is ${t} legal`,
  (t) => `is using ${t} cheating`,
  (t) => `how good is ${t}`,
  (t) => `why does ${t} matter`,
  (t) => `what is ${t}`,
  (t) => `what does ${t} do`,
  (t) => `how reliable is ${t}`,
  (t) => `how do i use ${t}`,
  (t) => `when should i use ${t}`,
  (t) => `where can i find ${t}`,
  (t) => `which ${t} is best`,
  (t) => `who uses ${t}`,
  (t) => `can ${t} be trusted`,
  (t) => `is ${t} free`,
  (t) => `is ${t} worth paying for`,
  (t) => `does ${t} really work`,
  (t) => `how fast is ${t}`,
  (t) => `is ${t} accurate in 2026`,
  (t) => `can ${t} be detected`,
  (t) => `should i use ${t}`,
  (t) => `is ${t} against academic integrity policy`,
  (t) => `how many people use ${t}`,
  (t) => `is ${t} better than paraphrasing`,
  (t) => `does ${t} preserve meaning`,
  (t) => `is ${t} good for seo`,
  (t) => `can ${t} be traced`,
];

function genQuestion(): string[] {
  const out: string[] = [];
  for (const topic of QUESTION_TOPICS) {
    for (const stem of QUESTION_STEMS) out.push(stem(topic));
  }
  return out;
}

// ─── FEATURE DATA ─────────────────────────────────────────────────────────────

const FEATURES = [
  'unlimited words', 'bulk processing', 'api access', 'plagiarism checker',
  'grammar checker', 'team accounts', 'browser extension', 'mobile app',
  'dark mode', 'multiple tone presets', 'academic tone', 'professional tone',
  'casual tone', 'slang removal', 'citation preservation', 'formatting preservation',
  'table support', 'code block support', 'markdown support', 'pdf export',
  'docx export', 'google docs integration', 'microsoft word integration',
  'notion integration', 'wordpress plugin', 'zapier integration', 'make integration',
  'n8n integration', 'rest api', 'webhook support', 'batch upload', 'csv upload',
  'folder upload', 'history log', 'version history', 'undo redo',
  'real time preview', 'side by side comparison', 'readability score',
  'plagiarism score', 'ai score meter', 'word count tracker', 'character limit increase',
  'unlimited runs', 'no daily limit', 'priority processing', 'faster processing speed',
  'offline mode', 'chrome extension', 'safari extension', 'firefox extension',
  'edge extension', 'ios app', 'android app', 'team collaboration',
  'shared workspace', 'admin dashboard', 'usage analytics', 'custom branding',
  'white label option', 'sso login', 'two factor authentication', 'gdpr compliance',
  'data encryption', 'no data storage', 'auto delete history', 'multilingual support',
  '50 plus languages', 'spanish language support', 'french language support',
  'german language support', 'custom tone builder', 'brand voice matching',
  'style guide matching', 'sentence length control', 'vocabulary level control',
  'reading level control', 'plagiarism free guarantee', 'money back guarantee',
  'free trial', 'no credit card signup', 'pay as you go pricing', 'student discount',
  'nonprofit discount', 'annual plan discount', 'referral program', 'affiliate program',
  '24 7 support', 'live chat support', 'email support', 'help center',
  'video tutorials', 'onboarding guide', 'instant word count', 'auto save',
  'draft history', 'export to email', 'export to clipboard', 'keyboard shortcuts',
  'custom dictionary', 'synonym suggestions', 'tone consistency check',
  'plagiarism comparison report', 'ai detection preview', 'multi detector testing',
  'bulk export', 'scheduled processing', 'queue management', 'priority queue for pro users',
  'custom word replacement', 'sentence restructuring control', 'paragraph reordering',
  'passive voice detection', 'readability grade level report', 'export to google sheets',
  'integration with slack', 'integration with trello', 'integration with asana',
  'api rate limit increase', 'dedicated account manager', 'custom onboarding',
  'sla uptime guarantee', 'audit log', 'role based permissions', 'single sign on',
  'saml authentication', 'ip whitelisting', 'custom data retention policy',
  'export usage reports', 'monthly usage summary', 'invoice history',
  'multiple payment methods', 'annual billing discount', 'volume pricing',
  'custom enterprise pricing', 'dedicated support channel', 'priority feature requests',
  'beta feature access', 'early access program', 'community forum access',
  'template library', 'saved presets', 'custom preset sharing', 'team preset sharing',
  'usage limit alerts', 'low balance notifications', 'auto top up', 'usage based billing',
  'flat rate billing', 'per word pricing', 'per document pricing', 'unlimited plan option',
  'trial extension option', 'cancel anytime policy', 'no lock in contract',
  'export to notion', 'export to airtable', 'browser sync', 'cross device sync',
  'cloud backup', 'local storage option', 'incognito mode', 'guest mode without login',
  'multi language ui', 'accessibility screen reader support', 'high contrast mode',
];

const FEATURE_TEMPLATES: ((f: string) => string)[] = [
  (f) => `ai humanizer with ${f}`,
  (f) => `best ai humanizer with ${f}`,
  (f) => `ai humanizer that has ${f}`,
  (f) => `ai text humanizer ${f}`,
  (f) => `which ai humanizer has ${f}`,
  (f) => `ai humanizer supporting ${f}`,
  (f) => `ai humanizer plus ${f}`,
  (f) => `ai humanizer including ${f}`,
  (f) => `ai humanizer featuring ${f}`,
  (f) => `top ai humanizer with ${f}`,
  (f) => `free ai humanizer with ${f}`,
  (f) => `ai humanizer with ${f} for students`,
  (f) => `ai humanizer with ${f} for teams`,
  (f) => `ai humanizer with ${f} 2026`,
  (f) => `cheap ai humanizer with ${f}`,
  (f) => `ai humanizer offering ${f}`,
  (f) => `ai humanizer known for ${f}`,
  (f) => `ai humanizer built for ${f}`,
  (f) => `ai humanizer designed for ${f}`,
  (f) => `does humanifylab have ${f}`,
  (f) => `ai humanizer with ${f} free trial`,
  (f) => `ai humanizer with ${f} for agencies`,
  (f) => `ai humanizer with ${f} for enterprise`,
  (f) => `ai humanizer with ${f} for freelancers`,
];

function genFeature(): string[] {
  const out: string[] = [];
  for (const feature of FEATURES) {
    for (const tpl of FEATURE_TEMPLATES) out.push(tpl(feature));
  }
  return out;
}

// ─── LENGTH DATA ──────────────────────────────────────────────────────────────

const WORD_COUNTS = [
  '250', '500', '750', '1000', '1250', '1500', '2000', '2500', '3000', '3500',
  '4000', '5000', '6000', '7500', '10000', '15000', '20000', '25000', '50000', '100000',
];

const LENGTH_CONTENT_TYPES = [
  'essay', 'blog post', 'article', 'report', 'thesis', 'dissertation', 'research paper',
  'story', 'novel chapter', 'book chapter', 'cover letter', 'resume', 'email',
  'product description', 'white paper', 'case study', 'press release', 'newsletter',
  'ebook', 'script', 'grant proposal', 'business plan', 'marketing copy', 'ad copy',
  'landing page', 'social media caption', 'linkedin post', 'speech', 'memoir',
  'personal statement', 'literature review', 'lab report', 'case brief', 'term paper',
  'capstone project',
];

const LENGTH_MODIFIERS = [
  (n: string, c: string) => `humanize a ${n} word ${c}`,
  (n: string, c: string) => `ai humanizer for a ${n} word ${c}`,
  (n: string, c: string) => `bypass ai detection for a ${n} word ${c}`,
  (n: string, c: string) => `undetectable ai for a ${n} word ${c}`,
  (n: string, c: string) => `ai text humanizer for a ${n} word ${c}`,
  (n: string, c: string) => `ai humanizer ${n} word limit ${c}`,
];

function genLength(): string[] {
  const out: string[] = [];
  for (const n of WORD_COUNTS) {
    for (const c of LENGTH_CONTENT_TYPES) {
      for (const mod of LENGTH_MODIFIERS) out.push(mod(n, c));
    }
  }
  return out;
}

// ─── SCENARIO DATA ────────────────────────────────────────────────────────────

const SCENARIO_CONTEXTS = [
  'professor', 'teacher', 'boss', 'editor', 'client', 'admissions officer',
  'hiring manager', 'thesis committee', 'dissertation advisor', 'peer reviewer',
  'journal editor', 'grant committee', 'scholarship committee', 'hr department',
  'recruiter', 'editor in chief', 'blog readers', 'marketing director',
  'content manager', 'university committee', 'exam board', 'accreditation board',
  'conference committee', 'book editor', 'ghostwriting client', 'freelance client',
  'upwork client', 'fiverr client', 'literary agent', 'publisher', 'academic advisor',
  'department head', 'lab supervisor', 'research supervisor', 'phd committee',
  'masters committee', 'internship supervisor', 'team lead', 'project manager',
  'quality assurance team', 'compliance officer', 'legal reviewer', 'media outlet',
  'newsroom editor', 'seo team', 'content team', 'writing tutor', 'writing center staff',
  'academic integrity office', 'plagiarism review board', 'style guide reviewer',
  'proofreader', 'copy editor', 'technical reviewer', 'grant reviewer',
  'conference reviewer', 'peer review panel', 'ethics committee', 'review board',
  'curriculum committee', 'school administration', 'college admissions team',
  'graduate admissions committee', 'mba admissions committee', 'law school committee',
  'medical school committee', 'residency program director', 'fellowship committee',
  'business partner', 'investor', 'board of directors', 'stakeholders', 'shareholders',
  'clients agency', 'ad agency', 'pr firm', 'brand manager', 'creative director',
  'social media manager', 'newsletter subscribers', 'podcast audience', 'youtube audience',
  'online community', 'reddit community', 'linkedin network', 'twitter followers',
  'facebook group admins', 'discord server moderators', 'forum moderators',
  'course instructor', 'online course platform', 'certification board', 'licensing board',
  'quality reviewer', 'content auditor', 'brand compliance team', 'legal department',
  'hr recruiter', 'talent acquisition team', 'onboarding manager', 'performance reviewer',
  'annual review committee', 'promotion committee', 'tenure committee',
];

const SCENARIO_TEMPLATES: ((ctx: string) => string)[] = [
  (ctx) => `my ${ctx} said my writing sounds like ai`,
  (ctx) => `how do i make sure my ${ctx} does not think i used ai`,
  (ctx) => `i am worried my ${ctx} will flag my writing as ai generated`,
  (ctx) => `what should i do if my ${ctx} thinks i used chatgpt`,
  (ctx) => `how can i prove to my ${ctx} that i did not use ai`,
  (ctx) => `my ${ctx} rejected my work for sounding like ai`,
  (ctx) => `i need my writing to pass my ${ctx} without sounding robotic`,
  (ctx) => `how to write so my ${ctx} does not suspect ai`,
  (ctx) => `my ${ctx} wants me to make this sound more human`,
  (ctx) => `i am scared my ${ctx} will run this through an ai detector`,
  (ctx) => `will my ${ctx} know i used chatgpt`,
  (ctx) => `how do i sound less like ai for my ${ctx}`,
  (ctx) => `my ${ctx} asked me to rewrite this because it sounds ai generated`,
  (ctx) => `what to do before submitting to my ${ctx} if i used ai`,
  (ctx) => `how to humanize my writing before my ${ctx} sees it`,
  (ctx) => `my ${ctx} is strict about ai generated content`,
  (ctx) => `does my ${ctx} check for ai writing`,
  (ctx) => `how to avoid getting flagged by my ${ctx}`,
  (ctx) => `i used chatgpt and now my ${ctx} wants proof it is original`,
  (ctx) => `my ${ctx} said this reads like it was written by ai`,
];

function genScenario(): string[] {
  const out: string[] = [];
  for (const ctx of SCENARIO_CONTEXTS) {
    for (const tpl of SCENARIO_TEMPLATES) out.push(tpl(ctx));
  }
  return out;
}

// ─── ENTITY EXTRACTION ────────────────────────────────────────────────────────

function extractEntity(kw: string, cluster: ClusterV5): string {
  const k = kw.toLowerCase();
  switch (cluster) {
    case 'city': {
      for (const c of CITIES) {
        const cn = c.replace(/ (UK|Canada|Australia)$/, '').toLowerCase();
        if (k.includes(cn)) return c.replace(/ (UK|Canada|Australia)$/, '');
      }
      return 'Your City';
    }
    case 'question': {
      for (const t of QUESTION_TOPICS) {
        if (k.includes(t)) return t.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      return 'AI Humanizer';
    }
    case 'feature': {
      for (const f of FEATURES) {
        if (k.includes(f)) return f.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      return 'Feature';
    }
    case 'length': {
      // Check longest numbers first — "1250 word" contains "250 word" as a
      // trailing substring, so checking shorter counts first would misfire.
      const byLengthDesc = [...WORD_COUNTS].sort((a, b) => b.length - a.length);
      for (const n of byLengthDesc) {
        if (k.includes(`${n} word`)) return `${n} Words`;
      }
      return 'Content Length';
    }
    case 'scenario': {
      for (const c of SCENARIO_CONTEXTS) {
        if (k.includes(c)) return c.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      return 'Reviewer';
    }
    default:
      return 'HumanifyLab';
  }
}

// ─── ASSEMBLY ─────────────────────────────────────────────────────────────────

let _v5Entries: KeywordEntryV5[] | null = null;

export function getAllV5Entries(): KeywordEntryV5[] {
  if (_v5Entries) return _v5Entries;

  const globalSeen = new Set<string>([
    ...getV1Slugs(),
    ...getAllV2Slugs(),
    ...getAllV3Slugs(),
    ...getAllV4Slugs(),
    ...getAllGeoSlugs(),
  ]);

  const clusterGenerators: [ClusterV5, () => string[], number][] = [
    ['city', genCity, 4200],
    ['question', genQuestion, 4500],
    ['feature', genFeature, 4000],
    ['length', genLength, 3500],
    ['scenario', genScenario, 3500],
  ];

  const all: KeywordEntryV5[] = [];
  let seedOffset = 0;

  for (const [cluster, gen, cap] of clusterGenerators) {
    const keywords = gen();
    const entries = buildEntries(
      keywords,
      cluster,
      (kw) => extractEntity(kw, cluster),
      globalSeen,
      seedOffset,
    );
    all.push(...entries.slice(0, cap));
    seedOffset += cap;
  }

  _v5Entries = all;
  return all;
}

export function getAllV5Slugs(): string[] {
  return getAllV5Entries().map((e) => e.slug);
}

let _v5SlugIndex: Map<string, KeywordEntryV5> | null = null;

export function getV5KeywordBySlug(slug: string): KeywordEntryV5 | undefined {
  if (!_v5SlugIndex) {
    _v5SlugIndex = new Map(getAllV5Entries().map((e) => [e.slug, e]));
  }
  return _v5SlugIndex.get(slug);
}

export function getV5ClusterKeywords(cluster: ClusterV5): KeywordEntryV5[] {
  return getAllV5Entries().filter((e) => e.cluster === cluster);
}
