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
    ["essay humanizer", "essay", "humanizer", "academic"],
    ["undetectable ai writer", "HumanifyLab", "undetectable", "writer"],
    ["unlimited ai humanizer", "HumanifyLab", "unlimited", "tool"],
    ["online ai humanizer", "HumanifyLab", "online", "tool"],
    ["ai humanizer no sign up", "HumanifyLab", "no sign up", "tool"],
    ["academic ai humanizer", "HumanifyLab", "academic", "tool"],
    ["professional ai humanizer", "HumanifyLab", "professional", "tool"],
    ["rewrite ai text to human", "HumanifyLab", "rewrite", "text"],
    ["make ai text undetectable", "HumanifyLab", "undetectable", "text"],
    ["stealth writer alternative", "HumanifyLab", "alternative", "stealth"],
    ["chatgpt 4o humanizer", "ChatGPT 4o", "humanizer", "tool"],
    ["deepseek humanizer", "DeepSeek", "humanizer", "tool"],
    ["perplexity humanizer", "Perplexity", "humanizer", "tool"],
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
    ["chatgpt writing for essays", "ChatGPT", "essay", "writing"],
    ["humanize ai essay", "essay", "humanize", "ai"],
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
  ],
  writing: [
    ["chatgpt writing", "ChatGPT", "writing", "tools"],
    ["ai writing tools", "AI writing", "tools", "2026"],
    ["best ai writing tools 2026", "AI writing", "best", "2026"],
    ["paraphrasing tool", "paraphrase", "tool", "rewrite"],
    ["ai paraphraser", "paraphrase", "ai", "tool"],
    ["rewrite chatgpt content", "ChatGPT", "rewrite", "content"],
    ["seo ai writer humanizer", "SEO article", "humanizer", "seo"],
    ["blog post humanizer", "blog posts", "humanizer", "writing"],
    ["ai writing assistant humanizer", "AI writing", "assistant", "humanizer"],
    ["humanize ai writing", "AI writing", "humanize", "text"],
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
  ],
  usecases: [
    ["ai humanizer for students", "students", "humanizer", "academic"],
    ["ai humanizer usa", "the United States", "humanizer", "geo"],
    ["ai humanizer uk", "the United Kingdom", "humanizer", "geo"],
    ["ai humanizer canada", "Canada", "humanizer", "geo"],
    ["ai humanizer europe", "Europe", "humanizer", "geo"],
    ["ai humanizer australia", "Australia", "humanizer", "geo"],
    ["ai humanizer south africa", "South Africa", "humanizer", "geo"],
    ["ai humanizer asia", "Singapore", "humanizer", "geo"],
    ["ai humanizer for teachers", "teachers", "humanizer", "education"],
    ["ai humanizer for seo writers", "SEO writers", "humanizer", "seo"],
    ["ai humanizer for agencies", "agencies", "humanizer", "teams"],
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

  const essayActions = [
    "humanizer",
    "rewrite guide",
    "academic editor",
    "undetectable rewrite",
    "submission edit",
  ] as const;

  const detectorTemplates = [
    (d: string, m: string) => [`does ${d} detect ${m}`, "detect"],
    (d: string, m: string) => [`how ${d} detects ${m} writing`, "how"],
    (d: string, m: string) => [`${d} accuracy on ${m} text`, "accuracy"],
    (d: string, m: string) => [`${d} false positives on ${m}`, "false positives"],
    (d: string, m: string) => [`${d} ai score for ${m} drafts`, "score"],
  ] as const;

  const writingGoals = [
    "humanize",
    "rewrite",
    "make natural",
    "publish ready edit",
    "seo polish",
    "editor pass",
    "voice pass",
    "undetectable edit",
  ] as const;

  const guideStems = [
    "how to",
    "how do i",
    "what is the best way to",
    "step by step guide to",
    "practical guide to",
  ] as const;

  const compareTemplates = [
    (c: string, u: string) => [`humanifylab vs ${c} for ${u}`, "vs"],
    (c: string, u: string) => [`${c} alternative for ${u}`, "alternative"],
    (c: string, u: string) => [`humanifylab vs ${c} for ${u} in 2026`, "2026"],
    (c: string, u: string) => [`why switch from ${c} for ${u}`, "switch"],
    (c: string, u: string) => [`best ${c} alternative for ${u}`, "best"],
  ] as const;

  // humanizer: model × qualifier × job
  for (const model of MODELS) {
    for (const qualifier of QUALIFIERS) {
      for (const job of JOBS) {
        add(
          "humanizer",
          `${qualifier} ${model.name} humanizer ${job}`,
          model.name,
          qualifier,
          job,
        );
      }
    }
  }

  // bypass: detector × first 10 docs × first 10 models
  const bypassDocs = DOCS.slice(0, 10);
  const bypassModels = MODELS.slice(0, 10);
  for (const detector of DETECTORS) {
    for (const doc of bypassDocs) {
      for (const model of bypassModels) {
        add(
          "bypass",
          `bypass ${detector.name} on ${model.name} ${doc.name}`,
          detector.name,
          model.name,
          doc.name,
        );
      }
    }
  }

  // essay: docs × first 25 models × 5 actions
  const essayModels = MODELS.slice(0, 25);
  for (const doc of DOCS) {
    for (const model of essayModels) {
      for (const action of essayActions) {
        add(
          "essay",
          `${model.name} ${doc.name} ${action}`,
          doc.name,
          model.name,
          action,
        );
      }
    }
  }

  // detectors: 50 × 20 models × 5 templates
  const detectorModels = MODELS.slice(0, 20);
  for (const detector of DETECTORS) {
    for (const model of detectorModels) {
      for (const tmpl of detectorTemplates) {
        const [keyword, tertiary] = tmpl(detector.name, model.name);
        add("detectors", keyword!, detector.name, model.name, tertiary!);
      }
    }
  }

  // writing: tasks × models × goals
  for (const task of TASKS) {
    for (const model of MODELS) {
      for (const goal of writingGoals) {
        add(
          "writing",
          `${goal} ${model.name} ${task.name}`,
          task.name,
          model.name,
          goal,
        );
      }
    }
  }

  // guides: how-to intent — unique (stem, topic) pairs, then model×detector×doc
  const guideTopics: { phrase: string; entity: string; secondary: string }[] = [];
  for (const detector of DETECTORS) {
    guideTopics.push({ phrase: `bypass ${detector.name}`, entity: detector.name, secondary: "bypass" });
    guideTopics.push({ phrase: `pass ${detector.name} with natural writing`, entity: detector.name, secondary: "pass" });
  }
  for (const model of MODELS) {
    guideTopics.push({ phrase: `humanize ${model.name} text`, entity: model.name, secondary: "humanize" });
    guideTopics.push({ phrase: `rewrite ${model.name} essays`, entity: model.name, secondary: "rewrite" });
  }
  for (const doc of DOCS) {
    guideTopics.push({ phrase: `edit an ai ${doc.name}`, entity: doc.name, secondary: "edit" });
  }
  const guideMods = ["in 2026", "without spinning", "and keep your meaning", "before submission", "for beginners"];
  for (const topic of guideTopics) {
    for (const stem of guideStems) {
      for (const mod of guideMods) {
        add("guides", `${stem} ${topic.phrase} ${mod}`, topic.entity, topic.secondary, mod);
      }
    }
  }
  for (const model of MODELS) {
    for (const detector of DETECTORS) {
      for (const doc of DOCS) {
        add(
          "guides",
          `how to prepare a ${model.name} ${doc.name} for ${detector.name}`,
          model.name,
          detector.name,
          doc.name,
        );
      }
    }
  }

  // compare: competitors × documents × templates (25 × 40 × 5 = 5000)
  for (const competitor of COMPETITORS) {
    for (const doc of DOCS) {
      for (const tmpl of compareTemplates) {
        const [keyword, tertiary] = tmpl(competitor.name, doc.name);
        add("compare", keyword!, competitor.name, doc.name, tertiary!);
      }
    }
  }
  for (const competitor of COMPETITORS) {
    for (const role of ROLES) {
      add("compare", `humanifylab vs ${competitor.name} for ${role.name}`, competitor.name, role.name, "vs");
      add("compare", `${competitor.name} alternative for ${role.name}`, competitor.name, role.name, "alternative");
    }
  }

  // usecases: roles × geos × first 10 tasks
  const useTasks = TASKS.slice(0, 10);
  for (const role of ROLES) {
    for (const geo of GEOS) {
      for (const task of useTasks) {
        add(
          "usecases",
          `${role.name} ${task.name} humanizer in ${geo.name}`,
          role.name,
          geo.name,
          task.name,
        );
      }
    }
  }

  // Fill any short cluster with extra unique long-tail (should be rare).
  const fillers: Record<ClusterKey, () => Generator<[string, string, string, string], void, unknown>> = {
    humanizer: function* () {
      for (const model of MODELS) {
        for (const doc of DOCS) {
          yield [`${model.name} ${doc.name} ai humanizer tool`, model.name, doc.name, "tool"];
        }
      }
    },
    bypass: function* () {
      for (const detector of DETECTORS) {
        for (const geo of GEOS) {
          yield [`bypass ${detector.name} for students in ${geo.name}`, detector.name, geo.name, "students"];
        }
      }
    },
    essay: function* () {
      for (const doc of DOCS) {
        for (const geo of GEOS) {
          yield [`${doc.name} humanizer for universities in ${geo.name}`, doc.name, geo.name, "university"];
        }
      }
    },
    detectors: function* () {
      for (const detector of DETECTORS) {
        for (const doc of DOCS) {
          yield [`does ${detector.name} flag ai ${doc.name} drafts`, detector.name, doc.name, "flag"];
        }
      }
    },
    writing: function* () {
      for (const task of TASKS) {
        for (const geo of GEOS) {
          yield [`humanize ${task.name} for teams in ${geo.name}`, task.name, geo.name, "teams"];
        }
      }
    },
    guides: function* () {
      for (const model of MODELS) {
        for (const detector of DETECTORS) {
          yield [`checklist to humanize ${model.name} before ${detector.name}`, model.name, detector.name, "checklist"];
        }
      }
    },
    compare: function* () {
      for (const competitor of COMPETITORS) {
        for (const doc of DOCS) {
          yield [`${competitor.name} vs humanifylab for ${doc.name}`, competitor.name, doc.name, "vs"];
        }
      }
    },
    usecases: function* () {
      for (const role of ROLES) {
        for (const detector of DETECTORS.slice(0, 20)) {
          yield [`${role.name} workflow to pass ${detector.name}`, role.name, detector.name, "workflow"];
        }
      }
    },
  };

  for (const cluster of CLUSTER_KEYS) {
    if (byCluster[cluster].length >= TARGET_PER_CLUSTER) continue;
    for (const row of fillers[cluster]()) {
      if (byCluster[cluster].length >= TARGET_PER_CLUSTER) break;
      add(cluster, row[0], row[1], row[2], row[3]);
    }
  }

  const padAt = (cluster: ClusterKey, i: number): [string, string, string, string] => {
    const d = DETECTORS[i % DETECTORS.length]!;
    const m = MODELS[Math.floor(i / DETECTORS.length) % MODELS.length]!;
    const doc = DOCS[Math.floor(i / (DETECTORS.length * MODELS.length)) % DOCS.length]!;
    const g = GEOS[i % GEOS.length]!;
    const r = ROLES[i % ROLES.length]!;
    const t = TASKS[i % TASKS.length]!;
    const c = COMPETITORS[i % COMPETITORS.length]!;
    switch (cluster) {
      case "humanizer":
        return [`${m.name} humanizer for ${doc.name} in ${g.name}`, m.name, doc.name, g.name];
      case "bypass":
        return [`bypass ${d.name} for ${r.name} writing ${doc.name}`, d.name, r.name, doc.name];
      case "essay":
        return [`${m.name} ${doc.name} humanizer for ${r.name}`, doc.name, m.name, r.name];
      case "detectors":
        return [`can ${d.name} detect ${m.name} ${doc.name} in ${g.name}`, d.name, m.name, doc.name];
      case "writing":
        return [`${m.name} ${t.name} rewrite for ${r.name}`, t.name, m.name, r.name];
      case "guides":
        return [`how ${r.name} humanize ${m.name} ${doc.name} for ${d.name}`, r.name, m.name, d.name];
      case "compare":
        return [`${c.name} vs humanifylab for ${t.name} in ${g.name}`, c.name, t.name, g.name];
      case "usecases":
        return [`${r.name} in ${g.name} using ${m.name} for ${t.name}`, r.name, g.name, t.name];
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
