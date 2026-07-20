import type { KeywordEntryV5 } from '~/lib/pseo-data-v5';
import type { V4PageData } from '~/components/templates/V4Template';
import { uniqueIdx } from '~/lib/content/content-utils';
import { buildPageStrings, buildFaqs, buildStats, buildSteps } from '~/lib/content/content-combinator';

// Reassurance-first answers — scenario pages target pre-submission anxiety,
// so the lead answer calms the concern before walking through the fix.
const ANSWERS: ((ctx: string) => string)[] = [
  (c) => `Run your text through HumanifyLab before your ${c.toLowerCase()} sees it — it removes the statistical patterns detectors flag, in under 10 seconds.`,
  (c) => `Yes, your ${c.toLowerCase()} can likely detect unmodified AI writing — but HumanifyLab's transformation is verified to pass every major detector.`,
  (c) => `Don't submit yet. Paste your draft into HumanifyLab first — it preserves your meaning while removing the AI signature your ${c.toLowerCase()} would catch.`,
  (c) => `Most AI detectors your ${c.toLowerCase()} might use are beatable — HumanifyLab is tested weekly against all of them.`,
  (c) => `The fix takes under a minute: run it through HumanifyLab before you send it to your ${c.toLowerCase()}.`,
];

export function generateScenarioContent(entry: KeywordEntryV5): V4PageData {
  const { keyword, entity, seed } = entry;
  const combo = buildPageStrings(keyword, seed, entity, 'scenario');
  const ai = uniqueIdx(seed, keyword, ANSWERS.length, 20);

  return {
    metaTitle: combo.metaTitle,
    metaDescription: combo.metaDescription,
    h1: combo.h1,
    heroSubtitle: combo.heroSubtitle,
    badge: combo.badge,
    answer: ANSWERS[ai]!(entity),
    stats: buildStats(keyword, seed),
    steps: buildSteps(keyword, seed, 'scenario'),
    faqs: buildFaqs(keyword, seed, entity, 'scenario'),
    faqTitle: combo.faqTitle,
    finalCtaTitle: combo.finalCtaTitle,
    finalCtaSubtitle: combo.finalCtaSubtitle,
  };
}
