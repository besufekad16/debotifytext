import type { ClusterKey } from "./types";
import { getClusterEntries } from "./keywords";
import type { KeywordEntry } from "./types";

export interface ClusterMeta {
  key: ClusterKey;
  label: string;
  description: string;
  group: "Detection" | "Writing" | "People";
}

export const CLUSTER_META: Record<ClusterKey, ClusterMeta> = {
  humanizer: {
    key: "humanizer",
    label: "AI Humanizer Tools",
    group: "Writing",
    description: "Product pages for AI humanizer queries — free, best-of, ChatGPT, Claude, Gemini, and HumanifyLab brand searches.",
  },
  bypass: {
    key: "bypass",
    label: "Detector Bypass Guides",
    group: "Detection",
    description: "How to rewrite AI drafts so Turnitin, GPTZero, Originality.ai, Copyleaks and related checkers see human rhythm — not spun synonyms.",
  },
  essay: {
    key: "essay",
    label: "Essays & Academic Writing",
    group: "Writing",
    description: "Essay, thesis, lab report, and admissions writing that started in a model and still has to sound like the student who submits it.",
  },
  detectors: {
    key: "detectors",
    label: "AI Detectors Explained",
    group: "Detection",
    description: "Plain-language explainers of how AI detectors score text, why tools disagree, and what a flag actually means in 2026.",
  },
  writing: {
    key: "writing",
    label: "AI Writing & Rewriting",
    group: "Writing",
    description: "Workflows for blogs, SEO articles, scripts, emails, and other AI writing tasks that need a human edit before they publish.",
  },
  guides: {
    key: "guides",
    label: "How-To Guides",
    group: "Writing",
    description: "Step-by-step tutorials for humanizing AI text, preparing a submission, and avoiding the mistakes detectors already expect.",
  },
  compare: {
    key: "compare",
    label: "Comparisons & Alternatives",
    group: "People",
    description: "Honest HumanifyLab vs other humanizers, paraphrasers, and generators — compared on meaning, voice, and detector reality.",
  },
  usecases: {
    key: "usecases",
    label: "Use Cases & Regions",
    group: "People",
    description: "Audience and country pages for students, teams, and professionals who need a humanizer that matches local checkers.",
  },
};

export const CLUSTER_ORDER: ClusterKey[] = [
  "humanizer",
  "bypass",
  "essay",
  "detectors",
  "writing",
  "guides",
  "compare",
  "usecases",
];

export const CLUSTER_REGISTRY = CLUSTER_META;

export type AnyClusterKey = ClusterKey;
export type LiteEntry = Pick<KeywordEntry, "keyword" | "slug" | "entity" | "seed">;

export function getClusterSize(key: ClusterKey): number {
  return getClusterEntries(key).length;
}

export function getTotalPseoCount(): number {
  return CLUSTER_ORDER.reduce((sum, key) => sum + getClusterSize(key), 0);
}
