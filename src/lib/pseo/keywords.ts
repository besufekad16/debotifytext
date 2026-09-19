import { CLUSTER_KEYS, TARGET_PER_CLUSTER, type ClusterKey, type KeywordEntry } from "./types";
import { isUsableSlug, toSlug } from "./reserved";
import {
  COMPETITORS,
  DETECTORS,
  DOCS,
  GEOS,
  JOBS,
  MODELS,
  QUALIFIERS,
  ROLES,
  TASKS,
} from "./taxonomies";

const HEAD: Record<ClusterKey, string[][]> = {
  humanizer: [
    ["free ai humanizer", "HumanifyLab", "free", "tool"],
    ["best ai humanizer", "HumanifyLab", "best", "2026"],
    ["best ai humanizer 2026", "HumanifyLab", "best", "2026"],
    ["best ai humanizer for essays", "HumanifyLab", "essays", "best"],
    ["best ai humanizer for students", "HumanifyLab", "students", "best"],
    ["chatgpt humanizer", "ChatGPT", "humanizer", "tool"],
    ["claude humanizer", "Claude", "humanizer", "tool"],
    ["gemini humanizer", "Gemini", "humanizer", "tool"],
    ["gpt-4 humanizer", "GPT-4", "humanizer", "tool"],
    ["ai text humanizer", "HumanifyLab", "text", "humanizer"],
    ["humanize ai text", "HumanifyLab", "humanize", "text"],
    ["humanize chatgpt", "ChatGPT", "humanize", "text"],
    ["humanize chatgpt text", "ChatGPT", "humanize", "text"],
    ["humanize claude text", "Claude", "humanize", "text"],
    ["ai to human text converter", "HumanifyLab", "converter", "text"],
    ["ai to human converter", "HumanifyLab", "converter", "text"],
    ["undetectable ai writer", "HumanifyLab", "undetectable", "writer"],
    ["unlimited ai humanizer", "HumanifyLab", "unlimited", "tool"],
    ["online ai humanizer", "HumanifyLab", "online", "tool"],
    ["ai humanizer no sign up", "HumanifyLab", "no sign up", "tool"],
    ["academic ai humanizer", "HumanifyLab", "academic", "tool"],
    ["fast ai text humanizer", "HumanifyLab", "fast", "tool"],
    ["humanize ai text in seconds", "HumanifyLab", "instant", "tool"],
    ["ai humanizer with high accuracy", "HumanifyLab", "accuracy", "tool"],
    ["undetectable ai humanizer", "HumanifyLab", "undetectable", "tool"],
    ["ai humanizer that keeps original meaning", "HumanifyLab", "meaning", "tool"],
    ["natural sounding ai humanizer", "HumanifyLab", "natural", "tool"],
    ["ai humanizer for long text", "HumanifyLab", "long text", "tool"],
    ["bulk ai text humanizer", "HumanifyLab", "bulk", "tool"],
    ["free ai humanizer trial", "HumanifyLab", "trial", "free"],
    ["make chatgpt sound human", "ChatGPT", "humanize", "text"],
    ["make claude sound human", "Claude", "humanize", "text"],
    ["make gemini sound human", "Gemini", "humanize", "text"],
    ["make grok sound human", "Grok", "humanize", "text"],
    ["humanize grok text", "Grok", "humanize", "text"],
    ["rewrite ai text to sound human", "HumanifyLab", "rewrite", "text"],
    ["humanize ai generated content", "HumanifyLab", "humanize", "content"],
    ["make ai essay sound human", "HumanifyLab", "essay", "humanize"],
    ["ai humanizer online", "HumanifyLab", "online", "tool"],
    ["free ai text humanizer", "HumanifyLab", "free", "text"],
    ["online ai humanizer tool", "HumanifyLab", "online", "tool"],
    ["ai content humanizer", "HumanifyLab", "content", "humanizer"],
    ["text humanizer for ai", "HumanifyLab", "text", "tool"],
    ["ai writing humanizer", "HumanifyLab", "writing", "humanizer"],
    ["humanize ai generated text online", "HumanifyLab", "online", "generated"],
    ["best online ai humanizer", "HumanifyLab", "online", "best"],
    ["humanize ai text free", "HumanifyLab", "free", "text"],
    ["chatgpt 4o humanizer", "ChatGPT 4o", "humanizer", "tool"],
    ["deepseek humanizer", "DeepSeek", "humanizer", "tool"],
    ["perplexity humanizer", "Perplexity", "humanizer", "tool"],
    ["stealth writer alternative", "HumanifyLab", "alternative", "stealth"],
    ["make ai writing sound natural", "HumanifyLab", "natural", "writing"],
    ["humanize ai blog post", "HumanifyLab", "blog", "humanize"],
    ["humanize ai article", "HumanifyLab", "article", "humanize"],
    ["make chatgpt undetectable", "ChatGPT", "undetectable", "tool"],
    ["make claude undetectable", "Claude", "undetectable", "tool"],
  ],
  bypass: [
    ["bypass turnitin", "Turnitin", "bypass", "detector"],
    ["bypass turnitin ai detection", "Turnitin", "bypass", "ai detection"],
    ["bypass gptzero", "GPTZero", "bypass", "detector"],
    ["bypass originality ai", "Originality.ai", "bypass", "detector"],
    ["bypass copyleaks", "Copyleaks", "bypass", "detector"],
    ["bypass zerogpt", "ZeroGPT", "bypass", "detector"],
    ["bypass winston ai", "Winston AI", "bypass", "detector"],
    ["bypass sapling", "Sapling", "bypass", "detector"],
    ["bypass content at scale", "Content at Scale", "bypass", "detector"],
    ["bypass scribbr ai detector", "Scribbr", "bypass", "detector"],
    ["bypass quillbot ai detector", "QuillBot", "bypass", "detector"],
    ["bypass sapling ai detector", "Sapling", "bypass", "detector"],
    ["bypass crossplag", "Crossplag", "bypass", "detector"],
    ["bypass gpt radar", "GPTRadar", "bypass", "detector"],
    ["bypass ai detection", "AI detectors", "bypass", "detection"],
    ["turnitin ai bypass", "Turnitin", "bypass", "ai"],
    ["gptzero bypass", "GPTZero", "bypass", "tool"],
    ["make chatgpt undetectable turnitin", "Turnitin", "ChatGPT", "undetectable"],
    ["pass turnitin ai detection", "Turnitin", "pass", "detection"],
    ["beat gptzero", "GPTZero", "beat", "detector"],
    ["copyleaks ai bypass", "Copyleaks", "bypass", "ai"],
    ["originality ai bypass", "Originality.ai", "bypass", "tool"],
    ["turnitin bypass for essays", "Turnitin", "essay", "bypass"],
    ["bypass turnitin 2026", "Turnitin", "2026", "bypass"],
    ["gptzero bypass tool", "GPTZero", "bypass", "tool"],
    ["originality ai bypass tool", "Originality.ai", "bypass", "tool"],
    ["copyleaks bypass tool", "Copyleaks", "bypass", "tool"],
    ["winston ai bypass", "Winston AI", "bypass", "tool"],
    ["zerogpt bypass tool", "ZeroGPT", "bypass", "tool"],
    ["humanize text for gptzero", "GPTZero", "humanize", "bypass"],
    ["humanize text for originality ai", "Originality.ai", "humanize", "bypass"],
    ["humanize text for turnitin", "Turnitin", "humanize", "bypass"],
    ["humanize text for copyleaks", "Copyleaks", "humanize", "bypass"],
    ["make ai text undetectable", "HumanifyLab", "undetectable", "text"],
    ["bypass turnitin for students", "Turnitin", "students", "bypass"],
    ["bypass gptzero free", "GPTZero", "free", "bypass"],
  ],
  essay: [
    ["chatgpt essay humanizer", "ChatGPT", "essay", "humanizer"],
    ["humanize chatgpt essay", "ChatGPT", "essay", "humanize"],
    ["ai essay writer undetectable", "essay", "undetectable", "writer"],
    ["research paper humanizer", "research paper", "humanizer", "academic"],
    ["thesis humanizer", "thesis", "humanizer", "academic"],
    ["dissertation humanizer", "dissertation", "humanizer", "academic"],
    ["college essay humanizer", "college assignment", "essay", "humanizer"],
    ["argumentative essay humanizer", "argumentative essay", "humanizer", "academic"],
    ["literature review humanizer", "literature review", "humanizer", "academic"],
    ["lab report humanizer", "lab report", "humanizer", "academic"],
    ["admission essay humanizer", "admission essay", "humanizer", "academic"],
    ["personal statement humanizer", "personal statement", "humanizer", "academic"],
    ["humanize ai essay", "essay", "humanize", "ai"],
    ["ai humanizer for students", "students", "humanizer", "academic"],
    ["make ai essay pass turnitin", "Turnitin", "essay", "pass"],
    ["ai text humanizer for college", "college assignment", "humanizer", "academic"],
    ["humanize ai research paper", "research paper", "humanize", "academic"],
    ["make ai assignment sound human", "college assignment", "humanize", "academic"],
    ["humanize ai homework", "coursework", "humanize", "academic"],
    ["ai humanizer for academic writing", "essay", "humanizer", "academic"],
    ["pass ai detectors for school", "AI detectors", "school", "pass"],
    ["best ai humanizer for college essays", "college assignment", "best", "humanizer"],
    ["make ai essay undetectable", "essay", "undetectable", "humanize"],
    ["humanize ai thesis", "thesis", "humanize", "academic"],
    ["humanize ai dissertation", "dissertation", "humanize", "academic"],
    ["ai humanizer for university papers", "university paper", "humanizer", "academic"],
    ["pass ai detection in school", "AI detectors", "school", "pass"],
    ["humanize ai assignment online", "coursework", "humanize", "online"],
    ["best tool to humanize student essays", "essay", "students", "best"],
    ["ai humanizer trusted by students", "students", "trusted", "humanizer"],
  ],
  detectors: [
    ["how to bypass turnitin with chatgpt", "Turnitin", "ChatGPT", "bypass"],
    ["why does gptzero flag my essay", "GPTZero", "essay", "flag"],
    ["how does originality ai detect ai writing", "Originality.ai", "detect", "ai writing"],
    ["can quillbot bypass turnitin", "QuillBot", "Turnitin", "bypass"],
    ["when do teachers use gptzero", "GPTZero", "teachers", "use"],
    ["does turnitin detect quillbot", "Turnitin", "QuillBot", "detect"],
    ["does zerogpt work", "ZeroGPT", "work", "accuracy"],
    ["what is a plagiarism detector", "plagiarism detector", "what is", "definition"],
    ["does turnitin detect chatgpt", "Turnitin", "ChatGPT", "detect"],
    ["does gptzero detect chatgpt", "GPTZero", "ChatGPT", "detect"],
    ["does turnitin detect claude", "Turnitin", "Claude", "detect"],
    ["best ai detector 2026", "AI detectors", "best", "2026"],
    ["how do ai detectors work", "AI detectors", "how", "work"],
    ["gptzero accuracy", "GPTZero", "accuracy", "score"],
    ["how turnitin ai detection works", "Turnitin", "how", "works"],
    ["does originality ai detect chatgpt", "Originality.ai", "ChatGPT", "detect"],
    ["how to make chatgpt text pass gptzero", "GPTZero", "ChatGPT", "pass"],
    ["how to make claude text pass originality ai", "Originality.ai", "Claude", "pass"],
    ["how to make gemini text pass turnitin", "Turnitin", "Gemini", "pass"],
    ["ai humanizer that works with turnitin", "Turnitin", "humanizer", "works"],
    ["ai humanizer that works with gptzero", "GPTZero", "humanizer", "works"],
    ["ai humanizer that works with originality ai", "Originality.ai", "humanizer", "works"],
    ["make ai content undetectable by universities", "AI detectors", "universities", "undetectable"],
    ["gptzero humanizer", "GPTZero", "humanizer", "detector"],
    ["originality ai humanizer", "Originality.ai", "humanizer", "detector"],
    ["copyleaks humanizer", "Copyleaks", "humanizer", "detector"],
    ["winston ai humanizer", "Winston AI", "humanizer", "detector"],
    ["zerogpt humanizer", "ZeroGPT", "humanizer", "detector"],
  ],
  writing: [
    ["ai humanizer for bloggers", "bloggers", "humanizer", "writing"],
    ["humanize ai blog content", "blog posts", "humanize", "writing"],
    ["make ai content sound human", "AI writing", "humanize", "content"],
    ["ai humanizer for writers", "freelance writers", "humanizer", "writing"],
    ["humanize ai marketing copy", "product description", "humanize", "marketing"],
    ["make ai product description sound human", "product description", "humanize", "marketing"],
    ["humanize ai social media posts", "linkedin posts", "humanize", "social"],
    ["ai humanizer for linkedin", "LinkedIn post", "humanizer", "social"],
    ["humanize ai emails", "emails", "humanize", "writing"],
    ["make ai newsletter sound human", "newsletters", "humanize", "writing"],
    ["humanize ai for seo content", "SEO article", "humanize", "seo"],
    ["humanize ai for affiliate marketing", "blog posts", "humanize", "affiliate"],
    ["humanize ai for client work", "freelance writers", "humanize", "client"],
    ["ai humanizer for freelancers", "freelance writers", "humanizer", "freelance"],
    ["humanize ai for agencies", "agencies", "humanize", "teams"],
    ["ai humanizer for non-native english", "AI writing", "humanizer", "esl"],
    ["make ai english sound natural", "AI writing", "humanize", "esl"],
    ["humanize ai for professional emails", "emails", "humanize", "professional"],
    ["ai humanizer for reports", "white papers", "humanizer", "business"],
    ["humanize ai for presentations", "presentation scripts", "humanize", "business"],
    ["seo ai writer humanizer", "SEO article", "humanizer", "seo"],
    ["blog post humanizer", "blog posts", "humanizer", "writing"],
    ["ai writing assistant humanizer", "AI writing", "assistant", "humanizer"],
    ["humanize ai writing", "AI writing", "humanize", "text"],
    ["ai humanizer for marketers", "content marketers", "humanizer", "marketing"],
    ["ai humanizer for seo", "seo writers", "humanizer", "seo"],
    ["ai humanizer for content teams", "agencies", "humanizer", "teams"],
    ["ai humanizer for educators", "teachers", "humanizer", "education"],
    ["ai humanizer for researchers", "researchers", "humanizer", "academic"],
    ["ai humanizer for business writing", "consultants", "humanizer", "business"],
    ["ai humanizer for technical writing", "technical writers", "humanizer", "technical"],
    ["ai humanizer for creative writing", "bloggers", "humanizer", "creative"],
    ["humanize ai press releases", "press releases", "humanize", "business"],
    ["humanize ai white papers", "white papers", "humanize", "business"],
    ["humanize ai case studies", "case studies", "humanize", "business"],
    ["humanize ai sales emails", "emails", "humanize", "sales"],
    ["humanize ai landing page copy", "landing pages", "humanize", "marketing"],
    ["humanize ai product reviews", "product description", "humanize", "ecommerce"],
    ["humanize ai website content", "seo articles", "humanize", "web"],
    ["humanize ai faq content", "knowledge base articles", "humanize", "web"],
  ],
  guides: [
    ["how to use humanifylab humanizer", "HumanifyLab", "humanizer", "how to use"],
    ["how to rewrite essay to avoid ai detection", "essay", "rewrite", "how to"],
    ["how to humanize essays", "essay", "humanize", "how to"],
    ["what is humanifylab", "HumanifyLab", "definition", "what is"],
    ["how to avoid plagiarism detector", "plagiarism detector", "avoid", "how to"],
    ["how to humanize ai text", "humanize", "ai text", "how to"],
    ["how to bypass turnitin", "Turnitin", "bypass", "how to"],
    ["how to make chatgpt undetectable", "ChatGPT", "undetectable", "how to"],
    ["what is an ai humanizer", "AI humanizer", "definition", "what is"],
    ["how to pass gptzero", "GPTZero", "pass", "how to"],
    ["step by step ai humanizer guide", "AI humanizer", "guide", "steps"],
    ["how to beat ai detectors 2026", "AI detectors", "beat", "2026"],
    ["how to make ai text undetectable", "AI writing", "undetectable", "how to"],
    ["how to bypass ai detectors 2026", "AI detectors", "bypass", "2026"],
    ["how to humanize chatgpt text", "ChatGPT", "humanize", "how to"],
    ["how to make ai writing pass detectors", "AI detectors", "pass", "how to"],
    ["how to rewrite ai content to sound human", "AI writing", "rewrite", "how to"],
    ["how to bypass gptzero free", "GPTZero", "bypass", "free"],
    ["how to make ai text pass originality ai", "Originality.ai", "pass", "how to"],
    ["how to humanize ai without changing meaning", "AI writing", "humanize", "meaning"],
    ["best way to humanize ai text", "AI writing", "best", "how to"],
    ["how to remove ai detection from text", "AI detectors", "remove", "how to"],
    ["how to make ai text sound more human", "AI writing", "humanize", "how to"],
    ["how to remove ai tone from writing", "AI writing", "tone", "how to"],
    ["how to make chatgpt less robotic", "ChatGPT", "robotic", "how to"],
    ["how to make claude less ai sounding", "Claude", "ai sounding", "how to"],
    ["tools to humanize ai content", "AI writing", "tools", "humanize"],
    ["best way to bypass ai detection", "AI detectors", "bypass", "best"],
    ["reliable ai humanizer 2026", "HumanifyLab", "reliable", "2026"],
    ["ai humanizer that actually works", "HumanifyLab", "works", "trusted"],
    ["humanize ai text without plagiarism", "AI writing", "plagiarism", "humanize"],
    ["make ai content pass all detectors", "AI detectors", "all", "pass"],
  ],
  compare: [
    ["humanifylab vs undetectable ai", "Undetectable.ai", "HumanifyLab", "vs"],
    ["undetectable ai alternative", "Undetectable.ai", "alternative", "humanizer"],
    ["stealthgpt alternative", "StealthGPT", "alternative", "humanizer"],
    ["quillbot vs ai humanizer", "QuillBot", "humanizer", "vs"],
    ["best undetectable ai 2026", "undetectable", "best", "2026"],
    ["bypassgpt alternative", "BypassGPT", "alternative", "humanizer"],
    ["jasper vs ai humanizer", "Jasper", "humanizer", "vs"],
    ["grammarly vs ai humanizer", "Grammarly", "humanizer", "vs"],
    ["humanifylab vs stealthgpt", "StealthGPT", "HumanifyLab", "vs"],
    ["best quillbot alternative for ai detection", "QuillBot", "alternative", "detection"],
    ["best ai humanizer 2026", "HumanifyLab", "best", "2026"],
    ["best free ai humanizer", "HumanifyLab", "free", "best"],
    ["best ai humanizer for turnitin", "Turnitin", "best", "humanizer"],
    ["best ai humanizer for gptzero", "GPTZero", "best", "humanizer"],
    ["ai humanizer alternatives", "HumanifyLab", "alternatives", "compare"],
    ["cheapest ai humanizer", "HumanifyLab", "cheapest", "compare"],
    ["most accurate ai humanizer", "HumanifyLab", "accurate", "compare"],
    ["best ai humanizer for writers", "freelance writers", "best", "humanizer"],
    ["ai humanizer vs paraphrasing tool", "QuillBot", "vs", "compare"],
    ["better than quillbot for ai detection", "QuillBot", "better", "compare"],
    ["better than undetectable ai", "Undetectable.ai", "better", "compare"],
    ["free alternative to paid ai humanizers", "HumanifyLab", "free", "alternative"],
    ["accurate ai humanizer tool", "HumanifyLab", "accurate", "tool"],
    ["fast and accurate ai humanizer", "HumanifyLab", "fast", "accurate"],
    ["ai humanizer with meaning preservation", "HumanifyLab", "meaning", "preserve"],
    ["ai humanizer that doesnt change facts", "HumanifyLab", "facts", "preserve"],
    ["natural ai text rewriter", "HumanifyLab", "natural", "rewriter"],
    ["human like ai content rewriter", "HumanifyLab", "human-like", "rewriter"],
  ],
  usecases: [
    ["ai humanizer for bloggers", "bloggers", "humanizer", "usecase"],
    ["ai humanizer for seo writers", "seo writers", "humanizer", "seo"],
    ["ai humanizer for content creators", "bloggers", "humanizer", "content"],
    ["ai humanizer for college students", "college students", "humanizer", "academic"],
    ["ai humanizer for graduate students", "graduate students", "humanizer", "academic"],
    ["humanize ai for seo", "seo writers", "humanize", "seo"],
    ["humanize ai for affiliate marketing", "bloggers", "humanize", "affiliate"],
    ["ai humanizer for freelancers", "freelance writers", "humanizer", "freelance"],
    ["humanize ai for agencies", "agencies", "humanize", "teams"],
    ["ai humanizer for non-native english speakers", "AI writing", "humanizer", "esl"],
    ["ai humanizer for business writing", "consultants", "humanizer", "business"],
    ["ai humanizer for technical writing", "technical writers", "humanizer", "technical"],
    ["ai humanizer for creative writing", "bloggers", "humanizer", "creative"],
    ["ai humanizer for journalistic content", "journalists", "humanizer", "news"],
    ["how to humanize ai content for seo", "seo writers", "humanize", "seo"],
    ["make ai content rank better", "seo writers", "rank", "seo"],
    ["humanize ai for google ranking", "seo writers", "google", "ranking"],
    ["ai humanizer for content marketing", "content marketers", "humanizer", "marketing"],
    ["humanize ai for affiliate sites", "bloggers", "humanize", "affiliate"],
    ["humanize ai for niche sites", "seo writers", "humanize", "niche"],
    ["bulk humanize ai articles", "agencies", "bulk", "humanize"],
    ["humanize multiple ai texts at once", "agencies", "bulk", "humanize"],
    ["best ai humanizer for agencies", "agencies", "best", "humanizer"],
    ["ai humanizer for long form content", "bloggers", "long form", "humanizer"],
    ["ai humanizer for short form content", "social media managers", "short form", "humanizer"],
    ["ai humanizer usa", "the United States", "humanizer", "geo"],
    ["ai humanizer uk", "the United Kingdom", "humanizer", "geo"],
    ["ai humanizer canada", "Canada", "humanizer", "geo"],
    ["ai humanizer europe", "Europe", "humanizer", "geo"],
    ["ai humanizer australia", "Australia", "humanizer", "geo"],
    ["ai humanizer for teachers", "teachers", "humanizer", "education"],
    ["ai humanizer for journalists", "journalists", "humanizer", "news"],
  ],
};

function normalizeKeyword(keyword: string): string {
  return keyword.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function buildCatalog(): { byCluster: Record<ClusterKey, KeywordEntry[]>; bySlug: Map<string, KeywordEntry> } {
  const byCluster = Object.fromEntries(CLUSTER_KEYS.map((k) => [k, [] as KeywordEntry[]])) as Record<ClusterKey, KeywordEntry[]>;
  const bySlug = new Map<string, KeywordEntry>();
  const usedKeywords = new Set<string>();

  const add = (
    cluster: ClusterKey,
    keyword: string,
    entity: string,
    secondary: string,
    tertiary: string,
    priority = false,
  ): boolean => {
    const bucket = byCluster[cluster];
    if (bucket.length >= TARGET_PER_CLUSTER) return false;
    const cleaned = keyword.replace(/\s+/g, " ").trim();
    if (cleaned.length < 8) return false;
    const slug = toSlug(cleaned);
    if (!isUsableSlug(slug) || bySlug.has(slug)) return false;
    const nk = normalizeKeyword(cleaned);
    if (usedKeywords.has(nk)) return false;
    usedKeywords.add(nk);
    const seed = bucket.length;
    const entry: KeywordEntry = {
      keyword: cleaned,
      slug,
      cluster,
      entity,
      secondary,
      tertiary,
      seed,
      priority: priority || bucket.length < 1250,
    };
    bucket.push(entry);
    bySlug.set(slug, entry);
    return true;
  };

  for (const cluster of CLUSTER_KEYS) {
    for (const row of HEAD[cluster]) {
      add(cluster, row[0]!, row[1]!, row[2]!, row[3]!, true);
    }
  }

  // ── HUMANIZER cluster ─────────────────────────────────────────────────────
  // Template 1: "{qualifier} {model} humanizer"
  for (const model of MODELS) {
    for (const qualifier of QUALIFIERS) {
      add("humanizer", `${qualifier} ${model.name} humanizer`, model.name, qualifier, "tool");
    }
  }
  // Template 2: "{qualifier} ai humanizer for {doc}"
  for (const qualifier of QUALIFIERS) {
    for (const doc of DOCS) {
      add("humanizer", `${qualifier} ai humanizer for ${doc.name}`, doc.name, qualifier, "tool");
    }
  }
  // Template 3: "humanize {model} text for {role}"
  for (const model of MODELS) {
    for (const role of ROLES) {
      add("humanizer", `humanize ${model.name} text for ${role.name}`, model.name, role.name, "humanize");
    }
  }
  // Template 4: "{model} humanizer for {doc}"
  for (const model of MODELS) {
    for (const doc of DOCS) {
      add("humanizer", `${model.name} humanizer for ${doc.name}`, model.name, doc.name, "tool");
    }
  }
  // Template 5: "make {model} sound human for {doc}"
  for (const model of MODELS) {
    for (const doc of DOCS) {
      add("humanizer", `make ${model.name} sound human for ${doc.name}`, model.name, doc.name, "humanize");
    }
  }
  // Template 6: "{qualifier} ai humanizer {job}"
  for (const qualifier of QUALIFIERS) {
    for (const job of JOBS) {
      add("humanizer", `${qualifier} ai humanizer ${job}`, "HumanifyLab", qualifier, job);
    }
  }
  // Template 7: "rewrite {model} {doc} to sound human"
  for (const model of MODELS) {
    for (const doc of DOCS) {
      add("humanizer", `rewrite ${model.name} ${doc.name} to sound human`, model.name, doc.name, "rewrite");
    }
  }

  // ── BYPASS cluster ────────────────────────────────────────────────────────
  // Template 1: "bypass {detector} for {role}"
  for (const detector of DETECTORS) {
    for (const role of ROLES) {
      add("bypass", `bypass ${detector.name} for ${role.name}`, detector.name, role.name, "bypass");
    }
  }
  // Template 2: "make {model} text pass {detector}"
  for (const model of MODELS) {
    for (const detector of DETECTORS) {
      add("bypass", `make ${model.name} text pass ${detector.name}`, model.name, detector.name, "pass");
    }
  }
  // Template 3: "{detector} bypass for {doc}"
  for (const detector of DETECTORS) {
    for (const doc of DOCS) {
      add("bypass", `${detector.name} bypass for ${doc.name}`, detector.name, doc.name, "bypass");
    }
  }
  // Template 4: "{model} bypass {detector}"
  for (const model of MODELS) {
    for (const detector of DETECTORS) {
      add("bypass", `${model.name} bypass ${detector.name}`, model.name, detector.name, "bypass");
    }
  }
  // Template 5: "{detector} bypass tool for {role}"
  for (const detector of DETECTORS) {
    for (const role of ROLES) {
      add("bypass", `${detector.name} bypass tool for ${role.name}`, detector.name, role.name, "tool");
    }
  }

  // ── ESSAY cluster ─────────────────────────────────────────────────────────
  // Template 1: "humanize {model} {doc}"
  for (const model of MODELS) {
    for (const doc of DOCS) {
      add("essay", `humanize ${model.name} ${doc.name}`, model.name, doc.name, "humanize");
    }
  }
  // Template 2: "make {model} {doc} undetectable"
  for (const model of MODELS) {
    for (const doc of DOCS) {
      add("essay", `make ${model.name} ${doc.name} undetectable`, model.name, doc.name, "undetectable");
    }
  }
  // Template 3: "{doc} humanizer for {role}"
  for (const doc of DOCS) {
    for (const role of ROLES) {
      add("essay", `${doc.name} humanizer for ${role.name}`, doc.name, role.name, "humanizer");
    }
  }
  // Template 4: "ai humanizer for {doc} in {geo}"
  for (const doc of DOCS) {
    for (const geo of GEOS) {
      add("essay", `ai humanizer for ${doc.name} in ${geo.name}`, doc.name, geo.name, "humanizer");
    }
  }
  // Template 5: "{qualifier} {doc} humanizer"
  for (const qualifier of QUALIFIERS) {
    for (const doc of DOCS) {
      add("essay", `${qualifier} ${doc.name} humanizer`, doc.name, qualifier, "humanizer");
    }
  }
  // Template 6: "{model} {doc} humanizer for {role}"
  for (const model of MODELS) {
    for (const doc of DOCS) {
      add("essay", `${model.name} ${doc.name} humanizer for ${ROLES[0]!.name}`, model.name, doc.name, "humanizer");
    }
  }

  // ── DETECTORS cluster ─────────────────────────────────────────────────────
  // Template 1: "does {detector} detect {model}"
  for (const detector of DETECTORS) {
    for (const model of MODELS) {
      add("detectors", `does ${detector.name} detect ${model.name}`, detector.name, model.name, "detect");
    }
  }
  // Template 2: "why does {detector} flag my {doc}"
  for (const detector of DETECTORS) {
    for (const doc of DOCS) {
      add("detectors", `why does ${detector.name} flag my ${doc.name}`, detector.name, doc.name, "flag");
    }
  }
  // Template 3: "how does {detector} work for {role}"
  for (const detector of DETECTORS) {
    for (const role of ROLES) {
      add("detectors", `how does ${detector.name} work for ${role.name}`, detector.name, role.name, "how");
    }
  }
  // Template 4: "is {detector} accurate for {doc}"
  for (const detector of DETECTORS) {
    for (const doc of DOCS) {
      add("detectors", `is ${detector.name} accurate for ${doc.name}`, detector.name, doc.name, "accuracy");
    }
  }
  // Template 5: "can {detector} detect {model} {doc}"
  for (const detector of DETECTORS) {
    for (const model of MODELS) {
      add("detectors", `can ${detector.name} detect ${model.name} ${DOCS[0]!.name}`, detector.name, model.name, "detect");
    }
  }

  // ── WRITING cluster ───────────────────────────────────────────────────────
  // Template 1: "ai humanizer for {task}"
  for (const task of TASKS) {
    add("writing", `ai humanizer for ${task.name}`, task.name, "humanizer", "tool");
  }
  // Template 2: "humanize ai {task}"
  for (const task of TASKS) {
    add("writing", `humanize ai ${task.name}`, task.name, "humanize", "writing");
  }
  // Template 3: "make ai {task} sound human"
  for (const task of TASKS) {
    add("writing", `make ai ${task.name} sound human`, task.name, "humanize", "writing");
  }
  // Template 4: "{qualifier} ai humanizer for {task}"
  for (const qualifier of QUALIFIERS) {
    for (const task of TASKS) {
      add("writing", `${qualifier} ai humanizer for ${task.name}`, task.name, qualifier, "tool");
    }
  }
  // Template 5: "rewrite {model} {task} to sound human"
  for (const model of MODELS) {
    for (const task of TASKS) {
      add("writing", `rewrite ${model.name} ${task.name} to sound human`, model.name, task.name, "rewrite");
    }
  }
  // Template 6: "humanize {model} {task}"
  for (const model of MODELS) {
    for (const task of TASKS) {
      add("writing", `humanize ${model.name} ${task.name}`, model.name, task.name, "humanize");
    }
  }
  // Template 7: "{model} {task} humanizer"
  for (const model of MODELS) {
    for (const task of TASKS) {
      add("writing", `${model.name} ${task.name} humanizer`, model.name, task.name, "humanizer");
    }
  }
  // Template 8: "humanize ai {task} for {role}"
  for (const task of TASKS) {
    for (const role of ROLES) {
      add("writing", `humanize ai ${task.name} for ${role.name}`, task.name, role.name, "humanize");
    }
  }

  // ── GUIDES cluster ────────────────────────────────────────────────────────
  // Template 1: "how to bypass {detector} with {model}"
  for (const detector of DETECTORS) {
    for (const model of MODELS) {
      add("guides", `how to bypass ${detector.name} with ${model.name}`, detector.name, model.name, "bypass");
    }
  }
  // Template 2: "how to humanize {model} {doc}"
  for (const model of MODELS) {
    for (const doc of DOCS) {
      add("guides", `how to humanize ${model.name} ${doc.name}`, model.name, doc.name, "humanize");
    }
  }
  // Template 3: "how to make {model} text pass {detector}"
  for (const model of MODELS) {
    for (const detector of DETECTORS) {
      add("guides", `how to make ${model.name} text pass ${detector.name}`, model.name, detector.name, "pass");
    }
  }
  // Template 4: "guide to humanize {model} for {detector}"
  for (const model of MODELS) {
    for (const detector of DETECTORS) {
      add("guides", `guide to humanize ${model.name} for ${detector.name}`, model.name, detector.name, "guide");
    }
  }
  // Template 5: "how to make {model} {doc} undetectable"
  for (const model of MODELS) {
    for (const doc of DOCS) {
      add("guides", `how to make ${model.name} ${doc.name} undetectable`, model.name, doc.name, "undetectable");
    }
  }

  // ── COMPARE cluster ───────────────────────────────────────────────────────
  // Template 1: "humanifylab vs {competitor} for {role}"
  for (const competitor of COMPETITORS) {
    for (const role of ROLES) {
      add("compare", `humanifylab vs ${competitor.name} for ${role.name}`, competitor.name, role.name, "vs");
    }
  }
  // Template 2: "{competitor} alternative for {role}"
  for (const competitor of COMPETITORS) {
    for (const role of ROLES) {
      add("compare", `${competitor.name} alternative for ${role.name}`, competitor.name, role.name, "alternative");
    }
  }
  // Template 3: "{competitor} vs humanifylab for {doc}"
  for (const competitor of COMPETITORS) {
    for (const doc of DOCS) {
      add("compare", `${competitor.name} vs humanifylab for ${doc.name}`, competitor.name, doc.name, "vs");
    }
  }
  // Template 4: "best {competitor} alternative for {doc}"
  for (const competitor of COMPETITORS) {
    for (const doc of DOCS) {
      add("compare", `best ${competitor.name} alternative for ${doc.name}`, competitor.name, doc.name, "best");
    }
  }
  // Template 5: "is humanifylab better than {competitor} for {role}"
  for (const competitor of COMPETITORS) {
    for (const role of ROLES) {
      add("compare", `is humanifylab better than ${competitor.name} for ${role.name}`, competitor.name, role.name, "better");
    }
  }
  // Template 6: "humanifylab vs {competitor} for {task}"
  for (const competitor of COMPETITORS) {
    for (const task of TASKS) {
      add("compare", `humanifylab vs ${competitor.name} for ${task.name}`, competitor.name, task.name, "vs");
    }
  }

  // ── USECASES cluster ──────────────────────────────────────────────────────
  // Template 1: "ai humanizer for {role} in {geo}"
  for (const role of ROLES) {
    for (const geo of GEOS) {
      add("usecases", `ai humanizer for ${role.name} in ${geo.name}`, role.name, geo.name, "geo");
    }
  }
  // Template 2: "best ai humanizer for {role}"
  for (const role of ROLES) {
    add("usecases", `best ai humanizer for ${role.name}`, role.name, "best", "humanizer");
  }
  // Template 3: "humanize ai content for {role}"
  for (const role of ROLES) {
    add("usecases", `humanize ai content for ${role.name}`, role.name, "humanize", "content");
  }
  // Template 4: "{role} humanize {model} text"
  for (const role of ROLES) {
    for (const model of MODELS) {
      add("usecases", `${role.name} humanize ${model.name} text`, role.name, model.name, "humanize");
    }
  }
  // Template 5: "ai humanizer for {role} {task}"
  for (const role of ROLES) {
    for (const task of TASKS) {
      add("usecases", `ai humanizer for ${role.name} ${task.name}`, role.name, task.name, "tool");
    }
  }
  // Template 6: "{role} {doc} humanizer"
  for (const role of ROLES) {
    for (const doc of DOCS) {
      add("usecases", `${role.name} ${doc.name} humanizer`, role.name, doc.name, "humanizer");
    }
  }
  // Template 7: "best humanizer for {role} in {geo}"
  for (const role of ROLES) {
    for (const geo of GEOS) {
      add("usecases", `best humanizer for ${role.name} in ${geo.name}`, role.name, geo.name, "best");
    }
  }
  // Template 8: "{role} ai humanizer tool"
  for (const role of ROLES) {
    add("usecases", `${role.name} ai humanizer tool`, role.name, "tool", "humanizer");
  }

  // Template 9: "how {role} can pass {detector}"
  for (const role of ROLES) {
    for (const detector of DETECTORS) {
      add("usecases", `how ${role.name} can pass ${detector.name}`, role.name, detector.name, "pass");
    }
  }
  // Template 10: "{role} workflow to humanize {model}"
  for (const role of ROLES) {
    for (const model of MODELS) {
      add("usecases", `${role.name} workflow to humanize ${model.name}`, role.name, model.name, "workflow");
    }
  }
  // Template 11: "{doc} humanizer for {role} in {geo}"
  for (const doc of DOCS) {
    for (const role of ROLES) {
      for (const geo of GEOS) {
        add("usecases", `${doc.name} humanizer for ${role.name} in ${geo.name}`, doc.name, role.name, geo.name);
      }
    }
  }

  // ── PAD any under-filled cluster ─────────────────────────────────────────
  const padAt = (cluster: ClusterKey, i: number): [string, string, string, string] => {
    switch (cluster) {
      case "humanizer": {
        const m = MODELS[i % MODELS.length]!;
        const doc = DOCS[Math.floor(i / MODELS.length) % DOCS.length]!;
        const g = GEOS[Math.floor(i / (MODELS.length * DOCS.length)) % GEOS.length]!;
        return [`${m.name} humanizer for ${doc.name} in ${g.name}`, m.name, doc.name, g.name];
      }
      case "bypass": {
        const d = DETECTORS[i % DETECTORS.length]!;
        const r = ROLES[Math.floor(i / DETECTORS.length) % ROLES.length]!;
        const doc = DOCS[Math.floor(i / (DETECTORS.length * ROLES.length)) % DOCS.length]!;
        return [`bypass ${d.name} for ${r.name} writing ${doc.name}`, d.name, r.name, doc.name];
      }
      case "essay": {
        const doc = DOCS[i % DOCS.length]!;
        const m = MODELS[Math.floor(i / DOCS.length) % MODELS.length]!;
        const r = ROLES[Math.floor(i / (DOCS.length * MODELS.length)) % ROLES.length]!;
        return [`${m.name} ${doc.name} humanizer for ${r.name}`, doc.name, m.name, r.name];
      }
      case "detectors": {
        const d = DETECTORS[i % DETECTORS.length]!;
        const m = MODELS[Math.floor(i / DETECTORS.length) % MODELS.length]!;
        const doc = DOCS[Math.floor(i / (DETECTORS.length * MODELS.length)) % DOCS.length]!;
        return [`can ${d.name} detect ${m.name} ${doc.name}`, d.name, m.name, doc.name];
      }
      case "writing": {
        const t = TASKS[i % TASKS.length]!;
        const m = MODELS[Math.floor(i / TASKS.length) % MODELS.length]!;
        const r = ROLES[Math.floor(i / (TASKS.length * MODELS.length)) % ROLES.length]!;
        return [`${m.name} ${t.name} humanizer for ${r.name}`, t.name, m.name, r.name];
      }
      case "guides": {
        const r = ROLES[i % ROLES.length]!;
        const m = MODELS[Math.floor(i / ROLES.length) % MODELS.length]!;
        const d = DETECTORS[Math.floor(i / (ROLES.length * MODELS.length)) % DETECTORS.length]!;
        return [`how ${r.name} humanize ${m.name} for ${d.name}`, r.name, m.name, d.name];
      }
      case "compare": {
        const c = COMPETITORS[i % COMPETITORS.length]!;
        const t = TASKS[Math.floor(i / COMPETITORS.length) % TASKS.length]!;
        const g = GEOS[Math.floor(i / (COMPETITORS.length * TASKS.length)) % GEOS.length]!;
        return [`${c.name} vs humanifylab for ${t.name} in ${g.name}`, c.name, t.name, g.name];
      }
      case "usecases": {
        const r = ROLES[i % ROLES.length]!;
        const g = GEOS[Math.floor(i / ROLES.length) % GEOS.length]!;
        const t = TASKS[Math.floor(i / (ROLES.length * GEOS.length)) % TASKS.length]!;
        return [`${r.name} in ${g.name} using humanifylab for ${t.name}`, r.name, g.name, t.name];
      }
    }
  };

  for (const cluster of CLUSTER_KEYS) {
    let i = 0;
    while (byCluster[cluster].length < TARGET_PER_CLUSTER && i < 250000) {
      const row = padAt(cluster, i++);
      add(cluster, row[0], row[1], row[2], row[3]);
    }
  }


  return { byCluster, bySlug };
}

const CATALOG = buildCatalog();

export function getClusterEntries(cluster: ClusterKey): KeywordEntry[] {
  return CATALOG.byCluster[cluster] ?? [];
}

export function getAllEntries(): KeywordEntry[] {
  return CLUSTER_KEYS.flatMap((k) => CATALOG.byCluster[k]);
}

export function getKeywordBySlug(slug: string): KeywordEntry | undefined {
  return CATALOG.bySlug.get(slug);
}

export function getAllSlugs(): string[] {
  return Array.from(CATALOG.bySlug.keys());
}

export function getPrioritySlugs(): string[] {
  return getAllEntries().filter((e) => e.priority).map((e) => e.slug);
}

export function assertCatalogOrThrow(): void {
  for (const cluster of CLUSTER_KEYS) {
    const n = CATALOG.byCluster[cluster].length;
    if (n !== TARGET_PER_CLUSTER) {
      throw new Error(`PSEO cluster ${cluster} has ${n} pages, expected ${TARGET_PER_CLUSTER}`);
    }
  }
  if (CATALOG.bySlug.size !== TARGET_PER_CLUSTER * CLUSTER_KEYS.length) {
    throw new Error(`PSEO slug map size ${CATALOG.bySlug.size} is not 40000`);
  }
}

assertCatalogOrThrow();
