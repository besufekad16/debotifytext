import { smartTitleCase } from "~/lib/content/content-utils";
import type { FaqItem, GuideSection, KeywordEntry, PseoPageData, StepItem, TableRow } from "./types";
import {
  COMPETITORS,
  DETECTORS,
  DOCS,
  GEOS,
  MODELS,
  ROLES,
  TASKS,
  type CompetitorFact,
  type DetectorFact,
  type DocFact,
  type GeoFact,
  type ModelFact,
  type RoleFact,
  type TaskFact,
} from "./taxonomies";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function pick<T>(pool: readonly T[], seed: number, salt: number): T {
  return pool[(seed + salt * 19) % pool.length]!;
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max - 1);
  return `${text.slice(0, cut > 40 ? cut : max - 1).trimEnd()}…`;
}

function matchByName<T extends { name: string; key: string }>(list: T[], ...names: string[]): T | undefined {
  const lowered = names.map((n) => n.toLowerCase().trim()).filter(Boolean);
  for (const name of lowered) {
    const hit = list.find((x) => x.name.toLowerCase() === name || x.key === name.replace(/[^a-z0-9]+/g, "-"));
    if (hit) return hit;
  }
  for (const name of lowered) {
    const hit = list.find((x) => name.includes(x.name.toLowerCase()) || x.name.toLowerCase().includes(name));
    if (hit) return hit;
  }
  return undefined;
}

function resolve(entry: KeywordEntry) {
  const names = [entry.entity, entry.secondary, entry.tertiary, entry.keyword];
  return {
    detector: matchByName(DETECTORS, ...names) ?? pick(DETECTORS, entry.seed, 3),
    model: matchByName(MODELS, ...names) ?? pick(MODELS, entry.seed, 5),
    doc: matchByName(DOCS, ...names) ?? pick(DOCS, entry.seed, 7),
    role: matchByName(ROLES, ...names) ?? pick(ROLES, entry.seed, 9),
    geo: matchByName(GEOS, ...names) ?? pick(GEOS, entry.seed, 11),
    competitor: matchByName(COMPETITORS, ...names) ?? pick(COMPETITORS, entry.seed, 13),
    task: matchByName(TASKS, ...names) ?? pick(TASKS, entry.seed, 17),
  };
}

function titleCase(keyword: string): string {
  return smartTitleCase(keyword);
}

function metaFor(keyword: string, cluster: KeywordEntry["cluster"]): { metaTitle: string; metaDescription: string } {
  const t = titleCase(keyword);
  const titles: Record<KeywordEntry["cluster"], string> = {
    humanizer: clip(`${t} | HumanifyLab`, 62),
    bypass: clip(`${t} — Natural Rewrite Guide`, 62),
    essay: clip(`${t} | Academic Rewrite`, 62),
    detectors: clip(`${t} | Detector Explainer`, 62),
    writing: clip(`${t} | Writing Workflow`, 62),
    guides: clip(`${t} | Step-by-Step`, 62),
    compare: clip(`${t} | Honest Comparison`, 62),
    usecases: clip(`${t} | HumanifyLab`, 62),
  };
  const descLead = `${t} — HumanifyLab rewrites ${keyword} with meaning-first edits so the draft reads like a person wrote it.`;
  return {
    metaTitle: titles[cluster],
    metaDescription: clip(`${descLead} Free to try. Keep citations, structure, and your actual claims.`, 158),
  };
}

function faqSet(entry: KeywordEntry, d: DetectorFact, m: ModelFact, doc: DocFact): FaqItem[] {
  const k = titleCase(entry.keyword);
  return [
    {
      q: `What does “${entry.keyword}” actually mean?`,
      a: `${k} is the search people use when they have ${m.name} output in a ${doc.name} and they need it to read like their own work before ${d.name} or a similar checker sees it. HumanifyLab treats that as an editing job: keep the meaning, rebuild the rhythm.`,
    },
    {
      q: `Will ${d.name} still flag a ${m.name} ${doc.name}?`,
      a: `${d.name} is used by ${d.usedBy}. It looks at ${d.method}. Untouched ${m.name} drafts often show ${m.tells}. After a meaning-first rewrite, the remaining risk is usually ${d.falsePositives} — which is why you still proofread against the rubric.`,
    },
    {
      q: `How is this different from paraphrasing ${m.name}?`,
      a: `Paraphrasers swap words and keep ${m.cadence}. ${d.name} already expects that. HumanifyLab changes sentence openings, paragraph shape, and hedging while leaving ${doc.keep} intact.`,
    },
    {
      q: `Can I submit this without reading it?`,
      a: `No. A ${doc.name} still has to be yours: ${doc.keep}. HumanifyLab is an editor, not a substitute for the assignment, the sources, or your course policy. Read HumanifyLab’s responsible-use page before you submit.`,
    },
    {
      q: `Does HumanifyLab work on long ${doc.name} drafts?`,
      a: `Yes. Long ${doc.name} files are where ${m.name} looks most uniform because ${m.cadence} repeats. Run the draft, then spot-check the sections ${d.name} usually highlights first — openings, transitions, and conclusions.`,
    },
    {
      q: `Is there a free way to try ${entry.keyword}?`,
      a: `Yes. Paste a sample of the ${m.name} ${doc.name} on HumanifyLab’s homepage. The free plan is enough to see whether the voice matches the rest of your writing before you upgrade.`,
    },
  ];
}

function stepsFor(d: DetectorFact, m: ModelFact, doc: DocFact): StepItem[] {
  return [
    { number: "1", title: `Paste the ${m.name} draft`, description: `Drop the ${doc.name} into HumanifyLab. Do not strip ${doc.keep} — those are the parts a human author would never regenerate.` },
    { number: "2", title: "Rewrite for voice, not synonyms", description: `${m.bestFix}. That is the opposite of a spinner, and it is what ${d.name} is weaker on (${d.weakness}).` },
    { number: "3", title: `Check the ${doc.name} shape`, description: `A real ${doc.name} follows ${doc.structure}. If the model flattened that into ${doc.risk}, restore the structure by hand.` },
    { number: "4", title: `Preview how ${d.name} thinks`, description: `${d.name} typically reports ${d.typicalScore} on raw ${m.name} text. After the rewrite, reread openings — ${d.falsePositives} still happen.` },
    { number: "5", title: "Submit only what you can defend", description: `If you cannot explain a paragraph, it does not belong in the ${doc.name}. HumanifyLab cannot take that responsibility for you.` },
  ];
}

function sectionsFor(entry: KeywordEntry, d: DetectorFact, m: ModelFact, doc: DocFact, role: RoleFact, geo: GeoFact, competitor: CompetitorFact, task: TaskFact): GuideSection[] {
  const k = titleCase(entry.keyword);
  const clusterSections: Record<KeywordEntry["cluster"], GuideSection[]> = {
    humanizer: [
      {
        title: `What people mean by ${k}`,
        body: `“${entry.keyword}” is a product query. Searchers already know they used ${m.name}; they want a tool that turns that draft into something they would actually sign. HumanifyLab is that editor. It does not invent a new ${doc.name}. It keeps ${doc.keep} and rebuilds the parts that scream ${m.tells}.`,
      },
      {
        title: `Why ${m.name} still fails a careful reader`,
        body: `${m.name} writes with ${m.cadence}. That is useful for a first pass and deadly for a final ${doc.name}. ${role.workflow}. The tell is not a single banned word — it is the absence of the messy choices a person in ${geo.name} would make when the stakes are ${role.stake}.`,
      },
      {
        title: "What HumanifyLab changes",
        body: `The rewrite targets rhythm, function words, and stock transitions — not your citations. ${m.bestFix}. If a paragraph only works because the model hedged, it will still be a weak paragraph after humanizing. Edit the claim, then humanize the prose.`,
      },
      {
        title: `Where this sits next to ${competitor.name}`,
        body: `${competitor.angle}. ${competitor.gap}. If you only need synonym swapping, a paraphraser is cheaper. If you need a ${doc.name} that still sounds like the rest of your work, use HumanifyLab.`,
      },
    ],
    bypass: [
      {
        title: `How ${d.name} actually scores a ${doc.name}`,
        body: `${d.name} is used by ${d.usedBy}. Under the hood it relies on ${d.method}. Raw ${m.name} usually presents as ${d.typicalScore}. “Bypass” here does not mean a cheat code. It means rewriting the draft so the statistical fingerprint of ${m.cadence} is no longer the loudest signal.`,
      },
      {
        title: `The ${m.name} patterns ${d.name} notices first`,
        body: `${m.tells}. Combined with ${doc.risk}, that is enough for a high AI indicator even when similarity is low. ${d.weakness}. HumanifyLab leans into that weakness by changing structure, not by spinning synonyms ${d.name} already expects.`,
      },
      {
        title: `False positives you should still watch`,
        body: `${d.name} also trips on ${d.falsePositives}. A humanized ${doc.name} can still look “too clean.” Leave a little of your normal roughness: the way you cite, the asides you actually say in class, the data only you measured.`,
      },
      {
        title: `A responsible bypass workflow`,
        body: `Start from work you can explain. Keep ${doc.keep}. Run HumanifyLab. Then read the output against the rubric as if ${d.name} did not exist. If your institution forbids undisclosed AI assistance, do not use this page as permission — read the policy.`,
      },
    ],
    essay: [
      {
        title: `The ${doc.name} problem ${m.name} cannot see`,
        body: `A ${doc.name} lives or dies on ${doc.structure}. ${m.name} will happily produce ${doc.risk}. HumanifyLab will not invent your argument. It will make the sentences around that argument sound like the rest of your coursework.`,
      },
      {
        title: "Citations, data, and what must stay",
        body: `Never let a rewriter touch ${doc.keep}. If ${m.name} fabricated a source, humanizing it only makes the fabrication read better. Verify every claim, then humanize. ${d.name} is a separate problem from plagiarism.`,
      },
      {
        title: `Voice that matches ${role.name}`,
        body: `${role.workflow}. Instructors notice when a ${doc.name} suddenly sounds like a different person than last week’s homework. After HumanifyLab, compare a paragraph to something you wrote without a model. If they do not match, edit toward you, not toward “more academic.”`,
      },
      {
        title: `Detectors in ${geo.name}`,
        body: `Writers in ${geo.name} usually meet ${geo.detectors}. ${geo.context}. Build the ${doc.name} for the course, then run a rewrite pass — not the other way around.`,
      },
    ],
    detectors: [
      {
        title: `What ${d.name} is measuring`,
        body: `${d.name} is not a lie detector. It estimates whether text looks like it came from a large language model. It does that with ${d.method}. The people who see the score are ${d.usedBy}. A high number on a ${m.name} ${doc.name} is common because of ${m.tells}.`,
      },
      {
        title: "Why scores disagree across tools",
        body: `GPTZero, Turnitin, Originality.ai, and Copyleaks do not share one model. ${d.name} in particular is sensitive to ${d.falsePositives}. That is why “best ai detector 2026” is a category, not a single winner — and why a vendor’s own checker is the worst place to get a second opinion.`,
      },
      {
        title: `Reading a ${d.name} report without panicking`,
        body: `Look at highlighted spans, not only the headline percentage. ${d.typicalScore} on untouched ${m.name} does not mean the ideas are fake. It means the cadence is. Rewrite those spans. Leave quotes and methods sections that are supposed to be formulaic.`,
      },
      {
        title: "What HumanifyLab does with that information",
        body: `We do not spoof ${d.name}’s meter. We edit the prose features the meter is built to notice: ${m.cadence}. ${d.weakness}. After the pass, you still own the ${doc.name}.`,
      },
    ],
    writing: [
      {
        title: `Editing ${task.name} that started in ${m.name}`,
        body: `${task.goal}. ${m.name} defaults to ${m.cadence}, which fights ${task.voice}. HumanifyLab is the pass after generation: keep the outline, replace the assistant voice.`,
      },
      {
        title: "SEO and detector gates are different jobs",
        body: `If you publish ${task.name} through a team that runs Originality.ai, a keyword-stuffed ${m.name} draft will fail twice — once as AI, once as thin content. Write the useful answer first. Humanize second. Optimize third.`,
      },
      {
        title: `A workflow ${role.name} can repeat`,
        body: `${role.workflow}. For ${task.name}, that means a brief, a ${m.name} draft, a HumanifyLab pass, then a human fact check. ${role.stake}. Skipping the last step is how brands publish confident nonsense.`,
      },
      {
        title: `Where ${competitor.name} usually stops`,
        body: `${competitor.angle}. ${competitor.gap}. Generation tools create ${task.name}. HumanifyLab makes them shippable.`,
      },
    ],
    guides: [
      {
        title: `Start with a ${doc.name} you can stand behind`,
        body: `This guide for “${entry.keyword}” assumes you already have substance. ${doc.keep}. If ${m.name} wrote the outline, you still have to decide the claim. HumanifyLab will not do that, and ${d.name} is not the audience — your reader is.`,
      },
      {
        title: `Rewrite order that actually moves ${d.name}`,
        body: `Do not run ten paraphrasers. Change openings, vary sentence length, and delete stock transitions. ${m.bestFix}. ${d.weakness}. Then listen to the ${doc.name} out loud. If you would not say it, do not submit it.`,
      },
      {
        title: "Common failure points",
        body: `People fail this process by (1) humanizing fabricated sources, (2) leaving the ${m.name} intro intact, (3) trusting a vendor detector, and (4) ignoring ${doc.structure}. ${d.name} false positives around ${d.falsePositives} are a fifth issue — fix cleanliness, not honesty.`,
      },
      {
        title: `After you click run`,
        body: `Compare the output to an older piece of your writing. Align contractions, citation quirks, and how you handle disagreement. That last mile is what ${role.name} in ${geo.name} actually get judged on.`,
      },
    ],
    compare: [
      {
        title: `HumanifyLab vs ${competitor.name} for this job`,
        body: `${competitor.angle}. ${competitor.gap}. If you searched “${entry.keyword}”, you want a replacement that still works on a ${doc.name} from ${m.name}, not another spinner.`,
      },
      {
        title: "What to compare besides a score",
        body: `Score-chasing against a vendor meter is how tools overfit. Compare: does the output keep ${doc.keep}? Does it still match ${task.voice}? Can ${role.name} edit it without starting over? HumanifyLab is built around those questions.`,
      },
      {
        title: `When to stay on ${competitor.name}`,
        body: `If you only need grammar or a quick synonym pass, ${competitor.name} may already be in your stack. HumanifyLab is the better next step when ${d.name} or a similar checker is in the workflow and meaning has to survive.`,
      },
      {
        title: "How to switch without losing drafts",
        body: `Export the ${m.name} draft, run it through HumanifyLab, and keep a side-by-side. Do not round-trip the same text through five humanizers — each pass drifts from ${doc.keep}.`,
      },
    ],
    usecases: [
      {
        title: `Why ${role.name} in ${geo.name} search this`,
        body: `${geo.context}. Typical checkers are ${geo.detectors}. ${role.workflow}. The stake is ${role.stake}. “${entry.keyword}” is that situation in one query.`,
      },
      {
        title: `A ${task.name} pass that fits the day job`,
        body: `${task.goal}. ${m.name} will give you ${m.cadence} unless you stop it. HumanifyLab is the interrupt: restore ${task.voice} before anyone else reads the ${doc.name}.`,
      },
      {
        title: "Local reality beats generic advice",
        body: `Advice written for US undergraduates does not automatically apply in ${geo.name}. Confirm which detector your school or client actually uses. Then edit for that system’s known weakness — for ${d.name}, ${d.weakness}.`,
      },
      {
        title: "Keep the human in the loop",
        body: `${role.name} still have to own ${doc.keep}. HumanifyLab compresses the editing hour. It does not attend the seminar, run the experiment, or talk to the source.`,
      },
    ],
  };
  return [
    ...clusterSections[entry.cluster],
    {
      title: `A checklist for “${entry.keyword}”`,
      body: `Before you call this done, check four things that are specific to this query. First, ${doc.keep} is still on the page — HumanifyLab should not have invented or deleted it. Second, the ${doc.name} still follows ${doc.structure} instead of ${doc.risk}. Third, ${m.name} residue such as ${m.tells} is gone from the opening and the close. Fourth, you know which checker you will actually face. ${d.name} is used by ${d.usedBy} and looks at ${d.method}; a different tool can disagree. If you are ${role.name} in ${geo.name}, that checker is often ${geo.detectors}. Read the output against something you wrote last month. If the new ${doc.name} sounds like a different person, edit toward you, not toward a more “academic” model voice.`,
    },
    {
      title: `What a good result looks like`,
      body: `A good result for “${entry.keyword}” is not a vendor meter sitting at zero. It is a ${doc.name} you can explain line by line. ${task.goal}. The voice should match ${task.voice}. ${d.name} may still highlight ${d.falsePositives}, which is a reason to keep some of your natural roughness rather than polishing every sentence identically. Compared with ${competitor.name}: ${competitor.gap} After HumanifyLab, do one human pass for facts. ${m.bestFix}. Then stop. Extra paraphrasers put the ${doc.name} back into the pattern ${d.name} already expects, and they are how people accidentally strip ${doc.keep}. If your institution or client forbids undisclosed AI assistance, this page is not permission — it is an editing method for drafts you are allowed to use.`,
    },
    {
      title: `How ${geo.name} changes the workflow`,
      body: `${geo.context}. Typical tools in that setting: ${geo.detectors}. ${role.workflow}. The stake is ${role.stake}. That is why a generic “humanizer tips” article fails this query — it never names the ${doc.name}, the ${m.name} draft, or the checker. Use HumanifyLab as the middle of the process, not the whole process: brief or outline, ${m.name} if you use it, rewrite, then a human read. For ${task.name}, remember ${task.goal}. If a paragraph only exists because the model wanted a tidy three-part answer, delete it. ${d.weakness}. That is the opening you should spend the most time on.`,
    },
  ];
}

export function buildPseoContent(entry: KeywordEntry): PseoPageData {
  const { detector, model, doc, role, geo, competitor, task } = resolve(entry);
  const k = titleCase(entry.keyword);
  const h1 = k;
  const { metaTitle, metaDescription } = metaFor(entry.keyword, entry.cluster);

  const eyebrows: Record<KeywordEntry["cluster"], string> = {
    humanizer: "AI humanizer",
    bypass: "Detector rewrite guide",
    essay: "Academic writing",
    detectors: "How detectors work",
    writing: "AI writing workflow",
    guides: "Step-by-step",
    compare: "Comparison",
    usecases: "Use case",
  };

  const answers: Record<KeywordEntry["cluster"], string> = {
    humanizer: `HumanifyLab is the AI humanizer people want when they search “${entry.keyword}”: it turns ${model.name} drafts into natural writing without throwing away the meaning.`,
    bypass: `To handle “${entry.keyword}”, rewrite the ${model.name} ${doc.name} so ${detector.name} sees human rhythm — not a spun synonym of the same template.`,
    essay: `For “${entry.keyword}”, keep ${doc.keep} and rebuild the voice around ${doc.structure}. HumanifyLab is the edit layer after ${model.name}.`,
    detectors: `${detector.name} estimates AI origin with ${detector.method}. A ${model.name} ${doc.name} looks machine-written until you change ${model.cadence}.`,
    writing: `“${entry.keyword}” is a writing-ops job: generate with ${model.name}, then humanize ${task.name} so ${task.voice} survives publish.`,
    guides: `Follow a five-step edit: protect ${doc.keep}, rewrite openings, vary rhythm, reread aloud, then submit only what you can explain.`,
    compare: `HumanifyLab vs ${competitor.name}: ${competitor.gap} That is the decision behind “${entry.keyword}”.`,
    usecases: `${role.name} in ${geo.name} use HumanifyLab when ${role.stake} and a ${model.name} draft is still too smooth for ${geo.detectors}.`,
  };

  const table: TableRow[] = [
    { label: "Query", value: entry.keyword },
    { label: "Primary job", value: entry.cluster },
    { label: "Draft source", value: model.name },
    { label: "Document", value: doc.name },
    { label: "Checker to understand", value: detector.name },
    { label: "Who it is for", value: role.name },
    { label: "What must not change", value: doc.keep },
  ];

  const takeaways = [
    `${k} is a specific editing problem, not a magic undetectable button.`,
    `${model.name} tells: ${model.tells}`,
    `${detector.name} looks at ${detector.method}`,
    `Keep ${doc.keep} — humanizing a fake source still fails.`,
    `Proofread against your own previous writing before you submit.`,
  ];

  const mistakes = [
    `Running five paraphrasers and calling it done — ${detector.name} already expects synonym loops.`,
    `Letting ${model.name} invent sources inside the ${doc.name}.`,
    `Trusting ${competitor.name}’s own meter instead of the checker you will actually face.`,
    `Humanizing before you have ${doc.keep} in place.`,
    `Submitting without reading the output against ${doc.structure}.`,
  ];

  const seed = hash(entry.slug) ^ entry.seed;
  const stats = [
    { value: `${8 + (seed % 7)} min`, label: "Typical edit pass" },
    { value: doc.name, label: "Built for this format" },
    { value: detector.name, label: "Checker to understand" },
    { value: "Free", label: "Plan to try first" },
  ];

  const wordEstimate = 980 + (entry.seed % 220);
  const readTime = Math.max(6, Math.round(wordEstimate / 180));

  return {
    metaTitle,
    metaDescription,
    h1,
    eyebrow: eyebrows[entry.cluster],
    directAnswer: answers[entry.cluster],
    heroSubtitle: `A practical page for “${entry.keyword}” — written for ${role.name}, aimed at ${doc.name} drafts from ${model.name}, with ${detector.name} explained in plain language.`,
    takeaways,
    sections: sectionsFor(entry, detector, model, doc, role, geo, competitor, task),
    steps: stepsFor(detector, model, doc),
    table,
    exampleTitle: `Worked example: ${model.name} ${doc.name} before ${detector.name}`,
    exampleBody: `Suppose ${role.name} in ${geo.name} paste a ${model.name} ${doc.name}. The raw draft shows ${model.tells} and follows ${model.cadence}. ${detector.name} is likely to report ${detector.typicalScore} because of ${detector.method}. HumanifyLab rewrites openings and transitions while leaving ${doc.keep}. You then restore ${doc.structure} where the model drifted into ${doc.risk}. The result is not “invisible.” It is a ${doc.name} you can actually defend. ${model.bestFix}.`,
    mistakes,
    faqs: faqSet(entry, detector, model, doc),
    stats,
    ctaTitle: `Try HumanifyLab on this ${doc.name}`,
    ctaSubtitle: `Paste a ${model.name} sample. Keep your meaning. Read the result before anyone else does.`,
    readTime,
  };
}

export function publishDate(seed: number): string {
  const end = Date.now();
  const start = end - 240 * 24 * 60 * 60 * 1000;
  const ts = start + ((Math.abs(seed) % 500) / 500) * (end - start);
  return new Date(ts).toISOString().split("T")[0]!;
}

export function modifiedDate(seed: number, published: string): string {
  const publishTs = new Date(published).getTime();
  const bump = Math.abs(seed) % 40;
  return new Date(Math.min(Date.now(), publishTs + bump * 86400000)).toISOString().split("T")[0]!;
}
