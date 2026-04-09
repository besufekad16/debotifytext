/**
 * HumanifyLab Programmatic SEO v3 — 15,000 New Keywords
 * 10 New Clusters × 1500 keywords each (combinatorial generation)
 * Zero duplicates with v1 or v2.
 */

import { getAllSlugs as getV1Slugs, toSlug } from '~/lib/pseo-data';
import { getAllV2Slugs } from '~/lib/pseo-data-v2';

export type ClusterV3 =
  | 'pricing'
  | 'industry'
  | 'format'
  | 'speed'
  | 'quality'
  | 'tool'
  | 'problem'
  | 'workflow'
  | 'score'
  | 'region';

export interface KeywordEntryV3 {
  keyword: string;
  slug: string;
  cluster: ClusterV3;
  entity: string;
  seed: number;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function buildV3Entries(
  keywords: string[],
  cluster: ClusterV3,
  globalSeen: Set<string>,
  cap = 1500,
): KeywordEntryV3[] {
  const entries: KeywordEntryV3[] = [];
  let seed = 0;
  for (const keyword of keywords) {
    if (entries.length >= cap) break;
    const slug = toSlug(keyword);
    if (globalSeen.has(slug)) continue;
    globalSeen.add(slug);
    entries.push({ keyword, slug, cluster, entity: extractEntityV3(keyword, cluster), seed: seed++ });
  }
  return entries;
}

function extractEntityV3(k: string, cluster: ClusterV3): string {
  // Detectors
  if (k.includes('turnitin')) return 'Turnitin';
  if (k.includes('gptzero')) return 'GPTZero';
  if (k.includes('originality')) return 'Originality.AI';
  if (k.includes('zerogpt')) return 'ZeroGPT';
  if (k.includes('copyleaks')) return 'Copyleaks';
  if (k.includes('winston')) return 'Winston AI';
  if (k.includes('sapling')) return 'Sapling';
  // Platforms
  if (k.includes('google docs')) return 'Google Docs';
  if (k.includes('microsoft word') || k.includes(' word ')) return 'Microsoft Word';
  if (k.includes('notion')) return 'Notion';
  if (k.includes('grammarly')) return 'Grammarly';
  if (k.includes('quillbot')) return 'QuillBot';
  if (k.includes('chatgpt')) return 'ChatGPT';
  if (k.includes('claude')) return 'Claude';
  if (k.includes('gemini')) return 'Gemini';
  if (k.includes('chrome extension')) return 'Chrome Extension';
  if (k.includes('wordpress')) return 'WordPress';
  if (k.includes('shopify')) return 'Shopify';
  if (k.includes('api')) return 'API';
  // Industries
  if (k.includes('healthcare') || k.includes('medical')) return 'Healthcare';
  if (k.includes('legal') || k.includes('law')) return 'Legal';
  if (k.includes('finance') || k.includes('banking')) return 'Finance';
  if (k.includes('real estate')) return 'Real Estate';
  if (k.includes('pharmaceutical') || k.includes('pharma')) return 'Pharmaceutical';
  if (k.includes('insurance')) return 'Insurance';
  if (k.includes('consulting')) return 'Consulting';
  if (k.includes('education') || k.includes('edtech')) return 'Education';
  if (k.includes('ecommerce') || k.includes('retail')) return 'Ecommerce';
  if (k.includes('cybersecurity')) return 'Cybersecurity';
  if (k.includes('engineering')) return 'Engineering';
  if (k.includes('manufacturing')) return 'Manufacturing';
  if (k.includes('logistics')) return 'Logistics';
  if (k.includes('agriculture')) return 'Agriculture';
  if (k.includes('energy')) return 'Energy';
  if (k.includes('media') || k.includes('publishing')) return 'Media';
  if (k.includes('advertising') || k.includes(' pr ')) return 'Advertising';
  if (k.includes('entertainment')) return 'Entertainment';
  if (k.includes('sports') || k.includes('fitness')) return 'Sports';
  if (k.includes('beauty') || k.includes('fashion')) return 'Fashion';
  if (k.includes('food') || k.includes('restaurant')) return 'Food';
  if (k.includes('automotive')) return 'Automotive';
  if (k.includes('aerospace')) return 'Aerospace';
  if (k.includes('telecommunications')) return 'Telecom';
  // Regions
  if (k.includes(' uk') || k.includes('united kingdom') || k.includes('england') || k.includes('scotland') || k.includes('wales')) return 'UK';
  if (k.includes(' us ') || k.includes('usa') || k.includes('united states') || k.includes('america')) return 'USA';
  if (k.includes('canada') || k.includes('canadian')) return 'Canada';
  if (k.includes('australia') || k.includes('australian')) return 'Australia';
  if (k.includes('india') || k.includes('indian')) return 'India';
  if (k.includes('nigeria') || k.includes('nigerian')) return 'Nigeria';
  if (k.includes('germany') || k.includes('german')) return 'Germany';
  if (k.includes('france') || k.includes('french')) return 'France';
  if (k.includes('singapore')) return 'Singapore';
  if (k.includes('philippines')) return 'Philippines';
  if (k.includes('pakistan')) return 'Pakistan';
  if (k.includes('kenya')) return 'Kenya';
  if (k.includes('south africa')) return 'South Africa';
  if (k.includes('uae') || k.includes('dubai')) return 'UAE';
  if (k.includes('brazil') || k.includes('brazil')) return 'Brazil';
  if (k.includes('mexico')) return 'Mexico';
  if (k.includes('ireland')) return 'Ireland';
  if (k.includes('new zealand')) return 'New Zealand';
  // Formats
  if (k.includes('email')) return 'Email';
  if (k.includes('linkedin')) return 'LinkedIn';
  if (k.includes('resume') || k.includes(' cv ')) return 'Resume';
  if (k.includes('cover letter')) return 'Cover Letter';
  if (k.includes('youtube')) return 'YouTube';
  if (k.includes('podcast')) return 'Podcast';
  if (k.includes('product description')) return 'Product Description';
  if (k.includes('blog post')) return 'Blog Post';
  if (k.includes('press release')) return 'Press Release';
  if (k.includes('white paper')) return 'White Paper';
  if (k.includes('case study')) return 'Case Study';
  if (k.includes('landing page')) return 'Landing Page';
  if (k.includes('ad copy') || k.includes('google ad') || k.includes('facebook ad')) return 'Ad Copy';
  if (k.includes('pitch deck')) return 'Pitch Deck';
  if (k.includes('newsletter')) return 'Newsletter';
  if (k.includes('tweet') || k.includes('twitter')) return 'Twitter';
  if (k.includes('instagram')) return 'Instagram';
  if (k.includes('tiktok')) return 'TikTok';
  // Scores
  if (k.includes('0 percent') || k.includes('zero') || k.includes('0%')) return 'Zero Score';
  // Cluster fallbacks
  if (cluster === 'pricing') return 'Pricing';
  if (cluster === 'speed') return 'Speed';
  if (cluster === 'quality') return 'Quality';
  if (cluster === 'problem') return 'Problem';
  if (cluster === 'workflow') return 'Workflow';
  if (cluster === 'score') return 'Score';
  return 'HumanifyLab';
}

// ─── CLUSTER 1: PRICING (1500) ────────────────────────────────────────────────
function genPricingKeywords(): string[] {
  const priceModifiers = [
    'free', 'free plan', 'free trial', 'free version', 'no credit card',
    'cheap', 'cheapest', 'affordable', 'low cost', 'budget',
    'best value', 'discount', 'coupon', 'promo code', 'deal',
    'subscription', 'monthly plan', 'annual plan', 'yearly plan', 'lifetime deal',
    'enterprise pricing', 'student discount', 'bulk pricing', 'pay per use',
    'pricing', 'cost', 'price', 'how much', 'plans',
  ];
  const tools = [
    'ai humanizer', 'humanifylab', 'bypass ai detection tool', 'text humanizer',
    'chatgpt humanizer', 'ai detector bypass', 'undetectable ai tool',
  ];
  const qualifiers = [
    '', '2026', 'online', 'no sign up', 'comparison', 'review', 'vs paid',
    'per month', 'per year', 'unlimited', 'words', 'characters',
  ];
  const out: string[] = [];
  // Direct pricing queries
  out.push('humanifylab pricing', 'humanifylab free plan', 'humanifylab cost', 'humanifylab subscription');
  out.push('humanifylab monthly price', 'humanifylab annual price', 'humanifylab enterprise plan');
  out.push('humanifylab student discount', 'humanifylab bulk pricing', 'humanifylab lifetime deal');
  out.push('humanifylab free vs paid', 'humanifylab pricing 2026', 'humanifylab promo code');
  out.push('humanifylab coupon code', 'humanifylab discount code', 'humanifylab free trial');
  out.push('is humanifylab free', 'humanifylab free words per day', 'humanifylab word limit free');
  out.push('humanifylab pricing plans', 'humanifylab plan comparison', 'humanifylab upgrade plan');
  out.push('humanifylab cancel subscription', 'humanifylab refund policy', 'humanifylab money back');
  for (const mod of priceModifiers) {
    for (const tool of tools) {
      const kw = `${tool} ${mod}`;
      out.push(kw);
      for (const q of qualifiers) {
        if (q) out.push(`${kw} ${q}`);
      }
    }
  }
  // Additional combos
  const extras = [
    'best free ai humanizer no sign up', 'ai humanizer free unlimited words',
    'ai humanizer free 1000 words', 'ai humanizer free 5000 words',
    'ai humanizer free no watermark', 'ai humanizer free no account',
    'ai humanizer free for students', 'ai humanizer free for essays',
    'ai humanizer free for academic writing', 'ai humanizer free for business',
    'cheapest ai humanizer 2026', 'most affordable ai humanizer',
    'ai humanizer under 10 dollars', 'ai humanizer under 5 dollars',
    'ai humanizer free tier comparison', 'ai humanizer pricing comparison 2026',
    'ai humanizer best deal 2026', 'ai humanizer black friday deal',
    'ai humanizer cyber monday deal', 'ai humanizer annual vs monthly',
    'ai humanizer pay as you go', 'ai humanizer credits pricing',
    'ai humanizer token pricing', 'ai humanizer word count pricing',
    'ai humanizer character limit pricing', 'ai humanizer unlimited plan',
    'ai humanizer premium plan worth it', 'ai humanizer free plan limitations',
    'ai humanizer upgrade worth it', 'ai humanizer enterprise cost',
    'ai humanizer team plan pricing', 'ai humanizer agency pricing',
    'ai humanizer reseller pricing', 'ai humanizer white label pricing',
    'ai humanizer api pricing', 'ai humanizer api cost per call',
    'bypass ai detection free plan', 'bypass ai detection free trial',
    'bypass turnitin free tool', 'bypass gptzero free tool',
    'undetectable ai free alternative', 'free undetectable ai writer',
    'free ai humanizer that works 2026', 'best free bypass ai detection tool',
    'free ai humanizer for turnitin', 'free ai humanizer for gptzero',
    'free ai humanizer no login', 'free ai humanizer unlimited 2026',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 2: INDUSTRY (1500) ───────────────────────────────────────────────
function genIndustryKeywords(): string[] {
  const industries = [
    'healthcare', 'medical', 'legal', 'law', 'finance', 'banking', 'real estate',
    'insurance', 'pharmaceutical', 'consulting', 'accounting', 'hr', 'recruitment',
    'government', 'nonprofit', 'education', 'retail', 'ecommerce', 'hospitality',
    'travel', 'tech', 'software', 'cybersecurity', 'engineering', 'architecture',
    'construction', 'manufacturing', 'logistics', 'supply chain', 'agriculture',
    'energy', 'oil gas', 'mining', 'media', 'publishing', 'journalism',
    'advertising', 'pr', 'entertainment', 'sports', 'fitness', 'beauty',
    'fashion', 'food', 'restaurant', 'automotive', 'aerospace', 'defense',
    'telecommunications',
  ];
  const useTypes = [
    'ai humanizer', 'bypass ai detection', 'humanize ai content',
    'undetectable ai writing', 'ai text humanizer',
  ];
  const qualifiers = ['', 'free', 'professional', '2026', 'online', 'tool'];
  const out: string[] = [];
  for (const ind of industries) {
    for (const use of useTypes) {
      out.push(`${use} for ${ind}`);
      for (const q of qualifiers) {
        if (q) out.push(`${use} for ${ind} ${q}`);
      }
    }
    out.push(`${ind} ai humanizer`, `${ind} content humanizer`, `${ind} bypass ai detection`);
    out.push(`best ai humanizer for ${ind}`, `ai humanizer ${ind} professionals`);
    out.push(`humanize ai ${ind} writing`, `undetectable ai for ${ind} content`);
    out.push(`ai humanizer for ${ind} professionals`, `${ind} ai writing tool`);
    out.push(`${ind} ai content humanizer 2026`, `${ind} undetectable ai tool`);
  }
  const extras = [
    'ai humanizer for b2b content', 'ai humanizer for b2c content',
    'ai humanizer for saas companies', 'ai humanizer for startups',
    'ai humanizer for enterprises', 'ai humanizer for small business',
    'ai humanizer for medium business', 'ai humanizer for large corporations',
    'ai humanizer for regulated industries', 'ai humanizer for compliance content',
    'ai humanizer for technical industries', 'ai humanizer for creative industries',
    'ai humanizer for service industries', 'ai humanizer for product companies',
    'ai humanizer for professional services', 'ai humanizer for knowledge workers',
    'ai humanizer for white collar professionals', 'ai humanizer for blue collar industries',
    'ai humanizer for gig economy workers', 'ai humanizer for remote workers',
    'ai humanizer for content heavy industries', 'ai humanizer for documentation heavy industries',
    'ai humanizer for compliance heavy industries', 'ai humanizer for research heavy industries',
    'ai humanizer for writing intensive professions', 'ai humanizer for report writing industries',
    'ai humanizer for proposal writing industries', 'ai humanizer for grant writing industries',
    'ai humanizer for policy writing industries', 'ai humanizer for technical writing industries',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 3: FORMAT (1500) ─────────────────────────────────────────────────
function genFormatKeywords(): string[] {
  const formats = [
    'email', 'linkedin post', 'resume', 'cv', 'cover letter', 'youtube script',
    'podcast script', 'product description', 'blog post', 'tweet',
    'instagram caption', 'facebook post', 'tiktok script', 'press release',
    'newsletter', 'landing page', 'sales page', 'ad copy', 'google ad',
    'facebook ad', 'pitch deck', 'business proposal', 'executive summary',
    'annual report', 'case study', 'white paper', 'technical documentation',
    'api documentation', 'user manual', 'faq page', 'about page',
    'terms of service', 'privacy policy', 'job description', 'performance review',
    'meeting notes', 'project proposal', 'grant application', 'funding proposal',
    'investor pitch', 'cold email', 'follow up email', 'sales email',
    'onboarding email', 'welcome email', 'announcement email',
  ];
  const actions = [
    'humanize ai', 'bypass detection for', 'make undetectable',
    'ai humanizer for', 'rewrite ai',
  ];
  const qualifiers = ['', 'free', 'online', 'instantly', '2026', 'no sign up', 'tool'];
  const out: string[] = [];
  for (const fmt of formats) {
    for (const act of actions) {
      out.push(`${act} ${fmt}`);
      for (const q of qualifiers) {
        if (q) out.push(`${act} ${fmt} ${q}`);
      }
    }
    out.push(`best ai humanizer for ${fmt}`, `${fmt} ai humanizer`);
    out.push(`humanize ai generated ${fmt}`, `undetectable ai ${fmt}`);
    out.push(`bypass ai detection in ${fmt}`, `ai humanizer ${fmt} 2026`);
  }
  const extras = [
    'humanize ai short form content', 'humanize ai long form content',
    'humanize ai structured content', 'humanize ai unstructured content',
    'humanize ai formal writing', 'humanize ai informal writing',
    'humanize ai persuasive writing', 'humanize ai informational writing',
    'humanize ai narrative writing', 'humanize ai descriptive writing',
    'humanize ai expository writing', 'humanize ai argumentative writing',
    'humanize ai creative writing', 'humanize ai technical writing',
    'humanize ai academic writing format', 'humanize ai business writing format',
    'humanize ai marketing writing', 'humanize ai journalistic writing',
    'humanize ai legal writing format', 'humanize ai medical writing format',
    'humanize ai scientific writing', 'humanize ai research writing',
    'humanize ai report writing', 'humanize ai proposal writing',
    'humanize ai documentation writing', 'humanize ai instructional writing',
    'humanize ai conversational writing', 'humanize ai professional writing',
    'humanize ai casual writing', 'humanize ai social media writing',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 4: SPEED (1500) ──────────────────────────────────────────────────
function genSpeedKeywords(): string[] {
  const speedMods = [
    'instant', 'instantly', 'fast', 'fastest', 'quick', 'quickly',
    'real time', 'in seconds', 'in 5 seconds', 'in 10 seconds',
    'no waiting', 'immediate', 'rapid', 'lightning fast', 'one click',
    'single click', 'automated', 'batch', 'bulk fast', 'in under a minute',
    'in 30 seconds', 'zero delay', 'same day', 'express',
  ];
  const actions = [
    'ai humanizer', 'bypass ai detection', 'humanize ai text',
    'bypass turnitin', 'bypass gptzero', 'make ai undetectable',
    'ai text converter', 'ai content humanizer',
  ];
  const qualifiers = ['', 'free', 'online', '2026', 'no sign up', 'no account', 'tool', 'software'];
  const out: string[] = [];
  for (const spd of speedMods) {
    for (const act of actions) {
      out.push(`${spd} ${act}`);
      for (const q of qualifiers) {
        if (q) out.push(`${spd} ${act} ${q}`);
      }
    }
  }
  const extras = [
    'ai humanizer speed comparison', 'fastest ai humanizer 2026',
    'ai humanizer processing time', 'ai humanizer response time',
    'ai humanizer throughput', 'ai humanizer words per second',
    'ai humanizer bulk speed', 'ai humanizer api speed',
    'ai humanizer no lag', 'ai humanizer no buffering',
    'ai humanizer instant results', 'ai humanizer real time processing',
    'ai humanizer live processing', 'ai humanizer streaming output',
    'ai humanizer fast turnaround', 'ai humanizer quick turnaround',
    'ai humanizer same day results', 'ai humanizer immediate output',
    'ai humanizer zero wait time', 'ai humanizer no queue',
    'bypass ai detection in real time', 'instant bypass turnitin tool',
    'instant bypass gptzero tool', 'instant ai detection remover',
    'fast ai humanizer for deadlines', 'quick ai humanizer for urgent work',
    'ai humanizer for last minute essays', 'ai humanizer for tight deadlines',
    'ai humanizer for rush jobs', 'ai humanizer for emergency use',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 5: QUALITY (1500) ────────────────────────────────────────────────
function genQualityKeywords(): string[] {
  const qualityMods = [
    'most accurate', 'highest quality', 'best quality', 'natural',
    'human-like', 'authentic', 'professional quality', 'meaning preserved',
    'no quality loss', 'sounds human', 'reads naturally', 'undetectable quality',
    'perfect output', 'flawless', 'error free', 'coherent', 'fluent',
    'native speaker quality', 'academic quality', 'professional grade',
    'premium quality', 'top quality', 'superior quality', 'excellent quality',
  ];
  const toolTypes = [
    'ai humanizer', 'bypass tool', 'text humanizer', 'ai rewriter', 'ai paraphraser',
  ];
  const qualifiers = ['', 'free', 'online', '2026', 'for essays', 'for academic writing', 'for business'];
  const out: string[] = [];
  for (const qm of qualityMods) {
    for (const tt of toolTypes) {
      out.push(`${qm} ${tt}`);
      for (const q of qualifiers) {
        if (q) out.push(`${qm} ${tt} ${q}`);
      }
    }
  }
  const extras = [
    'ai humanizer that preserves meaning', 'ai humanizer no quality loss',
    'ai humanizer natural output', 'ai humanizer human-like results',
    'ai humanizer that sounds human', 'ai humanizer coherent output',
    'ai humanizer fluent output', 'ai humanizer readable output',
    'ai humanizer accurate paraphrasing', 'ai humanizer meaning retention',
    'ai humanizer context preservation', 'ai humanizer tone preservation',
    'ai humanizer style preservation', 'ai humanizer voice preservation',
    'ai humanizer grammar quality', 'ai humanizer punctuation quality',
    'ai humanizer sentence structure quality', 'ai humanizer vocabulary quality',
    'ai humanizer readability score', 'ai humanizer flesch kincaid score',
    'ai humanizer gunning fog score', 'ai humanizer smog score',
    'ai humanizer dale chall score', 'ai humanizer reading level',
    'ai humanizer output quality test', 'ai humanizer quality benchmark',
    'ai humanizer quality comparison', 'ai humanizer quality review 2026',
    'best quality ai humanizer for academic writing',
    'best quality ai humanizer for professional writing',
    'best quality ai humanizer for creative writing',
    'best quality ai humanizer for technical writing',
    'ai humanizer that passes quality check',
    'ai humanizer that passes grammar check',
    'ai humanizer that passes plagiarism check',
    'ai humanizer that passes readability check',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 6: TOOL (1500) ───────────────────────────────────────────────────
function genToolKeywords(): string[] {
  const platforms = [
    'google docs', 'microsoft word', 'notion', 'obsidian', 'grammarly',
    'quillbot', 'jasper', 'copy ai', 'writesonic', 'chatgpt', 'claude',
    'gemini', 'google bard', 'bing chat', 'perplexity', 'slack', 'teams',
    'outlook', 'gmail', 'wordpress', 'webflow', 'wix', 'squarespace',
    'shopify', 'hubspot', 'salesforce', 'zapier', 'make', 'n8n',
    'api', 'chrome extension', 'firefox extension', 'safari extension',
    'edge extension', 'mobile app', 'ios app', 'android app',
    'desktop app', 'web app', 'browser plugin',
  ];
  const actions = [
    'ai humanizer for', 'bypass detection in', 'humanize ai text in',
    'integrate ai humanizer with', 'use ai humanizer with',
  ];
  const qualifiers = ['', 'free', '2026', 'online', 'tutorial', 'guide', 'how to'];
  const out: string[] = [];
  for (const plat of platforms) {
    for (const act of actions) {
      out.push(`${act} ${plat}`);
      for (const q of qualifiers) {
        if (q) out.push(`${act} ${plat} ${q}`);
      }
    }
    out.push(`${plat} ai humanizer`, `${plat} bypass ai detection`);
    out.push(`best ai humanizer for ${plat} users`, `ai humanizer ${plat} integration`);
    out.push(`humanize ai text in ${plat}`, `${plat} undetectable ai tool`);
  }
  const extras = [
    'ai humanizer browser extension', 'ai humanizer desktop software',
    'ai humanizer mobile app', 'ai humanizer web app',
    'ai humanizer api integration guide', 'ai humanizer api documentation',
    'ai humanizer api key', 'ai humanizer api endpoint',
    'ai humanizer api rate limit', 'ai humanizer api pricing',
    'ai humanizer plugin', 'ai humanizer add-on', 'ai humanizer widget',
    'ai humanizer embed', 'ai humanizer iframe', 'ai humanizer sdk',
    'ai humanizer npm package', 'ai humanizer python library',
    'ai humanizer javascript library', 'ai humanizer rest api',
    'ai humanizer webhook', 'ai humanizer automation',
    'ai humanizer zapier integration', 'ai humanizer make integration',
    'ai humanizer n8n integration', 'ai humanizer no code integration',
    'ai humanizer low code integration', 'ai humanizer third party integration',
    'ai humanizer cms integration', 'ai humanizer lms integration',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 7: PROBLEM (1500) ────────────────────────────────────────────────
function genProblemKeywords(): string[] {
  const problems = [
    'ai flagged my essay', 'turnitin caught my chatgpt', 'gptzero flagged my paper',
    'originality ai flagged my content', 'ai detection false positive',
    'turnitin says my writing is ai', 'gptzero says my essay is ai',
    'my paper got flagged', 'ai score too high', 'turnitin ai score 100',
    'gptzero score 100', 'failed ai detection', 'ai detection ruined my grade',
    'professor thinks i used ai', 'teacher flagged my essay',
    'ai detector wrong', 'false ai detection', 'unfair ai detection',
    'ai detection appeal', 'dispute ai detection',
  ];
  const solutions = [
    'fix', 'solve', 'bypass', 'remove', 'eliminate',
    'appeal', 'fight', 'dispute', 'correct', 'lower', 'reduce', 'clear',
  ];
  const qualifiers = ['', 'free', 'instantly', '2026', 'guide', 'how to', 'tool', 'method'];
  const out: string[] = [];
  for (const prob of problems) {
    for (const sol of solutions) {
      out.push(`how to ${sol} ${prob}`);
      for (const q of qualifiers) {
        if (q) out.push(`how to ${sol} ${prob} ${q}`);
      }
      out.push(`${prob} ${sol}`);
    }
    out.push(`${prob} solution`, `${prob} help`, `${prob} what to do`);
    out.push(`fix ${prob}`, `solve ${prob}`, `${prob} 2026`);
  }
  const extras = [
    'my essay was flagged by turnitin ai what do i do',
    'turnitin flagged my essay as ai written how to fix',
    'gptzero says my essay is ai written how to fix',
    'how to lower turnitin ai score to zero',
    'how to get 0 percent on turnitin ai detection',
    'how to pass turnitin ai detection 2026',
    'how to pass gptzero 2026', 'how to pass originality ai 2026',
    'how to pass zerogpt 2026', 'how to pass copyleaks ai detection',
    'how to pass winston ai detection', 'how to pass sapling ai detection',
    'ai detection false positive how to appeal',
    'turnitin ai detection false positive fix',
    'gptzero false positive how to fix',
    'originality ai false positive how to fix',
    'ai detector flagged human writing fix',
    'ai detection wrong result how to dispute',
    'professor accused me of using ai how to prove innocent',
    'teacher thinks i used chatgpt how to prove i didnt',
    'academic integrity violation ai writing how to appeal',
    'ai writing accusation how to defend yourself',
    'turnitin ai score appeal process',
    'gptzero score appeal process',
    'how to write an appeal for ai detection',
    'ai detection appeal letter template',
    'how to prove your writing is human not ai',
    'how to show your essay is not ai written',
    'evidence that writing is human not ai generated',
    'how to avoid ai detection in future essays',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 8: WORKFLOW (1500) ───────────────────────────────────────────────
function genWorkflowKeywords(): string[] {
  const workflowTypes = [
    'content team', 'agency workflow', 'freelancer workflow', 'bulk processing',
    'batch humanization', 'api integration', 'automated workflow',
    'content pipeline', 'editorial workflow', 'seo workflow',
    'content marketing workflow', 'publishing workflow', 'content calendar',
    'content strategy', 'content production', 'content operations',
  ];
  const roles = [
    'content teams', 'agencies', 'freelancers', 'copywriters', 'seo specialists',
    'content managers', 'editors', 'writers', 'marketers', 'bloggers',
    'publishers', 'journalists', 'pr teams', 'social media managers',
    'email marketers', 'growth hackers', 'startups', 'enterprises',
    'solopreneurs', 'consultants',
  ];
  const qualifiers = ['ai humanizer', 'bypass tool', '2026', 'free', 'professional', 'enterprise'];
  const out: string[] = [];
  for (const wf of workflowTypes) {
    for (const role of roles) {
      out.push(`ai humanizer for ${role} ${wf}`);
      out.push(`${wf} ai humanizer for ${role}`);
    }
    for (const q of qualifiers) {
      out.push(`${wf} ${q}`);
    }
    out.push(`best ai humanizer for ${wf}`, `${wf} bypass ai detection`);
    out.push(`${wf} undetectable ai tool`, `${wf} ai content tool`);
  }
  for (const role of roles) {
    for (const q of qualifiers) {
      out.push(`${q} for ${role}`);
    }
    out.push(`best ai humanizer for ${role}`, `ai humanizer for ${role} 2026`);
    out.push(`bypass ai detection for ${role}`, `undetectable ai for ${role}`);
    out.push(`${role} ai humanizer tool`, `${role} ai content workflow`);
    out.push(`${role} bulk ai humanizer`, `${role} ai humanizer api`);
  }
  const extras = [
    'ai humanizer for high volume content production',
    'ai humanizer for content at scale',
    'ai humanizer for 100 articles per day',
    'ai humanizer for 1000 articles per month',
    'ai humanizer bulk upload feature',
    'ai humanizer csv upload',
    'ai humanizer batch processing api',
    'ai humanizer team collaboration',
    'ai humanizer shared workspace',
    'ai humanizer team dashboard',
    'ai humanizer admin controls',
    'ai humanizer usage analytics',
    'ai humanizer team billing',
    'ai humanizer white label for agencies',
    'ai humanizer reseller program',
    'ai humanizer client management',
    'ai humanizer project management',
    'ai humanizer content calendar integration',
    'ai humanizer cms integration workflow',
    'ai humanizer automated publishing workflow',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 9: SCORE (1500) ──────────────────────────────────────────────────
function genScoreKeywords(): string[] {
  const scoreActions = [
    'get 0 percent', 'reduce to zero', 'lower', 'eliminate', 'remove',
    'clear', 'fix', 'drop', 'decrease', 'minimize', 'reduce',
    'get 0 on', 'score 0 on', 'pass with 0',
  ];
  const scoreTypes = [
    'ai score', 'turnitin ai score', 'gptzero score', 'originality ai score',
    'zerogpt score', 'copyleaks ai score', 'winston ai score', 'sapling score',
    'ai detection score', 'ai percentage', 'ai probability', 'ai confidence score',
    'ai writing score', 'ai content score', 'ai detection percentage',
  ];
  const qualifiers = ['', 'free', 'instantly', 'online', '2026', 'tool', 'method', 'guide', 'for essays', 'for students', 'for academic writing'];
  const out: string[] = [];
  for (const act of scoreActions) {
    for (const st of scoreTypes) {
      out.push(`${act} ${st}`);
      for (const q of qualifiers) {
        if (q) out.push(`${act} ${st} ${q}`);
      }
    }
  }
  const extras = [
    'ai score reducer tool', 'ai score remover tool', 'ai score eliminator',
    'zero ai score tool', 'zero ai detection tool', 'zero percent ai tool',
    'ai percentage reducer', 'ai probability reducer', 'ai confidence reducer',
    'turnitin ai score reducer', 'gptzero score reducer', 'originality score reducer',
    'zerogpt score reducer', 'copyleaks score reducer', 'winston score reducer',
    'how to get 0 percent ai score on turnitin',
    'how to get 0 percent ai score on gptzero',
    'how to get 0 percent ai score on originality ai',
    'how to get 0 percent ai score on zerogpt',
    'how to get 0 percent ai score on copyleaks',
    'how to reduce turnitin ai score to 0',
    'how to reduce gptzero score to 0',
    'how to reduce originality ai score to 0',
    'how to reduce zerogpt score to 0',
    'how to reduce copyleaks ai score to 0',
    'turnitin ai score 0 method', 'gptzero score 0 method',
    'originality ai score 0 method', 'zerogpt score 0 method',
    'ai score 0 percent guaranteed', 'ai score 0 percent tool 2026',
    'reduce ai detection score free', 'lower ai detection score free',
    'eliminate ai detection score free', 'remove ai detection score free',
    'ai score checker and reducer', 'check and reduce ai score',
    'ai score before and after humanizer', 'ai score improvement tool',
  ];
  out.push(...extras);
  return out;
}

// ─── CLUSTER 10: REGION (1500) ────────────────────────────────────────────────
function genRegionKeywords(): string[] {
  const regions = [
    'uk', 'united kingdom', 'us', 'usa', 'united states', 'canada', 'australia',
    'new zealand', 'india', 'pakistan', 'nigeria', 'ghana', 'kenya', 'south africa',
    'uae', 'saudi arabia', 'qatar', 'singapore', 'malaysia', 'philippines',
    'hong kong', 'china', 'japan', 'south korea', 'germany', 'france', 'spain',
    'italy', 'netherlands', 'sweden', 'norway', 'denmark', 'finland', 'poland',
    'brazil', 'mexico', 'argentina', 'colombia', 'chile', 'peru', 'egypt',
    'turkey', 'israel', 'ireland', 'scotland', 'wales', 'england',
  ];
  const institutions = [
    'universities', 'colleges', 'high schools', 'online courses',
    'distance learning', 'community colleges', 'ivy league', 'russell group',
    'oxbridge', 'coursera', 'udemy', 'edx',
  ];
  const actions = [
    'ai humanizer for', 'bypass turnitin for', 'bypass ai detection for',
    'humanize ai text for', 'undetectable ai for',
  ];
  const qualifiers = ['', 'free', '2026', 'students', 'academics'];
  const out: string[] = [];
  for (const region of regions) {
    for (const act of actions) {
      out.push(`${act} ${region} students`);
      out.push(`${act} ${region} academics`);
      for (const q of qualifiers) {
        if (q) out.push(`${act} ${region} ${q}`);
      }
    }
    for (const inst of institutions) {
      out.push(`ai humanizer for ${region} ${inst}`);
      out.push(`bypass turnitin ${region} ${inst}`);
      out.push(`bypass ai detection ${region} ${inst}`);
    }
    out.push(`best ai humanizer for ${region}`, `${region} ai humanizer 2026`);
    out.push(`${region} bypass turnitin tool`, `${region} bypass gptzero tool`);
    out.push(`${region} undetectable ai tool`, `${region} ai detection bypass`);
    out.push(`turnitin bypass ${region}`, `gptzero bypass ${region}`);
    out.push(`ai humanizer ${region} free`, `ai humanizer ${region} online`);
  }
  const extras = [
    'ai humanizer for international students',
    'ai humanizer for non native english speakers',
    'ai humanizer for esl students',
    'ai humanizer for efl students',
    'ai humanizer for bilingual students',
    'ai humanizer for multilingual students',
    'ai humanizer for exchange students',
    'ai humanizer for overseas students',
    'ai humanizer for foreign students',
    'bypass turnitin international students',
    'bypass gptzero international students',
    'bypass ai detection international students',
    'ai humanizer for global students',
    'ai humanizer for students worldwide',
    'ai humanizer for students in every country',
    'ai humanizer for developing countries students',
    'ai humanizer for english as second language',
    'ai humanizer for non english native writers',
    'ai humanizer for global academic writing',
    'ai humanizer for cross border academic writing',
  ];
  out.push(...extras);
  return out;
}

// ─── BUILD ALL V3 ENTRIES ─────────────────────────────────────────────────────
function buildAllV3Entries(): KeywordEntryV3[] {
  const v1Slugs = new Set(getV1Slugs());
  const v2Slugs = new Set(getAllV2Slugs());
  const globalSeen = new Set<string>([...v1Slugs, ...v2Slugs]);

  const pricing    = buildV3Entries(genPricingKeywords(),  'pricing',  globalSeen);
  const industry   = buildV3Entries(genIndustryKeywords(), 'industry', globalSeen);
  const format     = buildV3Entries(genFormatKeywords(),   'format',   globalSeen);
  const speed      = buildV3Entries(genSpeedKeywords(),    'speed',    globalSeen);
  const quality    = buildV3Entries(genQualityKeywords(),  'quality',  globalSeen);
  const tool       = buildV3Entries(genToolKeywords(),     'tool',     globalSeen);
  const problem    = buildV3Entries(genProblemKeywords(),  'problem',  globalSeen);
  const workflow   = buildV3Entries(genWorkflowKeywords(), 'workflow', globalSeen);
  const score      = buildV3Entries(genScoreKeywords(),    'score',    globalSeen);
  const region     = buildV3Entries(genRegionKeywords(),   'region',   globalSeen);

  return [
    ...pricing, ...industry, ...format, ...speed, ...quality,
    ...tool, ...problem, ...workflow, ...score, ...region,
  ];
}

// ─── CACHED EXPORTS ───────────────────────────────────────────────────────────
let _v3Cache: KeywordEntryV3[] | null = null;

export function getAllV3Keywords(): KeywordEntryV3[] {
  if (_v3Cache) return _v3Cache;
  _v3Cache = buildAllV3Entries();
  return _v3Cache;
}

export function getV3KeywordBySlug(slug: string): KeywordEntryV3 | undefined {
  return getAllV3Keywords().find(e => e.slug === slug);
}

export function getAllV3Slugs(): string[] {
  return getAllV3Keywords().map(e => e.slug);
}

export function getV3ClusterKeywords(cluster: ClusterV3): KeywordEntryV3[] {
  return getAllV3Keywords().filter(e => e.cluster === cluster);
}

