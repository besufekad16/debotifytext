import { smartTitleCase } from "~/lib/content/content-utils";
import { spin, getPainPoint, seededRandom } from "./spintax";
import { buildRelatedLinks } from "./related";
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
  return `${text.slice(0, cut > 40 ? cut : max - 1).trimEnd()}...`;
}

const TITLE_TAG: Record<KeywordEntry["cluster"], string> = {
  humanizer: "HumanifyLab",
  bypass: "Rewrite Guide",
  essay: "Academic Rewrite",
  detectors: "Detector Guide",
  writing: "Writing Workflow",
  guides: "Step-by-Step",
  compare: "Comparison",
  usecases: "HumanifyLab",
};

/** Never clip the query: clipped titles collided across 40k unique keywords. */
function uniqueMetaTitle(entry: KeywordEntry): string {
  return `${titleCase(entry.keyword)} | ${TITLE_TAG[entry.cluster]}`;
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

function metaFor(entry: KeywordEntry): { metaTitle: string; metaDescription: string } {
  const t = titleCase(entry.keyword);
  const descLead = `${t} — HumanifyLab rewrites ${entry.keyword} with meaning-first edits so the draft reads like a person wrote it.`;
  return {
    metaTitle: uniqueMetaTitle(entry),
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
  const pain = getPainPoint(role.name + " " + entry.keyword, entry.seed);
  
  const allSections: GuideSection[] = [
    {
      title: spin(`{What people mean by|Understanding|The truth about|A deep dive into} ${k}`, entry.seed),
      body: spin(`“${entry.keyword}” {is a product query|is what people search|shows intent}. {Searchers|Writers} already know they used ${m.name}; they want a {tool|solution|fix} that turns that draft into something they would {actually sign|proudly publish|submit}. HumanifyLab is that editor. It {does not invent|won't hallucinate} a new ${doc.name}. It {keeps|preserves} ${doc.keep} and {rebuilds|rewrites|fixes} the parts that {scream|look like|resemble} ${m.tells}.`, entry.seed),
    },
    {
      title: spin(`{Why|The reason} ${m.name} {still fails|gets caught by} {a careful reader|detectors}`, entry.seed),
      body: spin(`${m.name} writes with ${m.cadence}. That is {useful|good} for a {first pass|rough draft} and {deadly|dangerous|risky} for a final ${doc.name}. ${role.workflow}. The {tell|dead giveaway|mistake} is not a {single banned word|few keywords} — it is the {absence|lack} of the {messy|human|nuanced} choices a person in ${geo.name} would make when the stakes are ${role.stake}. When facing ${pain}, this matters even more.`, entry.seed + 1),
    },
    {
      title: spin(`{What HumanifyLab changes|How the humanizer works|Behind the scenes of the rewrite}`, entry.seed),
      body: spin(`The {rewrite|edit|process} {targets|focuses on} {rhythm|flow}, function words, and {stock transitions|robotic phrasing} — {not your citations|never your facts}. ${m.bestFix}. If a paragraph only {works|makes sense} because the model {hedged|was vague}, it will still be a {weak|poor} paragraph after humanizing. {Edit the claim|Fix the facts}, then {humanize the prose|rewrite the text}.`, entry.seed + 2),
    },
    {
      title: spin(`{Where this sits next to|Comparing this to|Why not just use} ${competitor.name}`, entry.seed),
      body: spin(`${competitor.angle}. ${competitor.gap}. If you only need {synonym swapping|basic rewriting|grammar fixes}, a {paraphraser|basic tool} is {cheaper|fine}. If you need a ${doc.name} that {still sounds like|matches} the rest of your {work|writing}, use HumanifyLab to {avoid|prevent} ${pain}.`, entry.seed + 3),
    },
    {
      title: spin(`{How|The way} ${d.name} {actually scores|grades|analyzes} a ${doc.name}`, entry.seed),
      body: spin(`${d.name} is used by ${d.usedBy}. {Under the hood|Behind the scenes} it {relies on|uses} ${d.method}. Raw ${m.name} {usually presents|often scores} as ${d.typicalScore}. “Bypass” {here does not mean|isn't} a cheat code. It means {rewriting|fixing} the draft so the {statistical fingerprint|robotic trace} of ${m.cadence} is no longer the {loudest|primary} signal.`, entry.seed + 4),
    },
    {
      title: spin(`{False positives|Errors|Mistakes} you should still {watch|look out for}`, entry.seed),
      body: spin(`${d.name} also trips on ${d.falsePositives}. A humanized ${doc.name} can still {look|appear} “too clean.” {Leave|Keep} a little of your {normal roughness|natural style}: the way you {cite|reference}, the asides you actually {say in class|write naturally}, the data only you measured.`, entry.seed + 5),
    },
    {
      title: spin(`{A responsible bypass workflow|How to use this ethically|The right way to humanize}`, entry.seed),
      body: spin(`Start from {work|research} you can {explain|defend}. Keep ${doc.keep}. {Run|Use} HumanifyLab. Then {read|review} the output {against the rubric|carefully} as if ${d.name} did not exist. {If your institution forbids undisclosed AI assistance, do not use this page as permission — read the policy.|Always follow your organization's AI rules.}`, entry.seed + 6),
    },
    {
      title: spin(`The ${doc.name} {problem|issue} ${m.name} cannot {see|fix}`, entry.seed),
      body: spin(`A ${doc.name} {lives or dies|depends entirely} on ${doc.structure}. ${m.name} will happily produce ${doc.risk}. HumanifyLab {will not|cannot} invent your argument. It will make the sentences {around that argument|supporting it} sound like the rest of your {coursework|writing|work}.`, entry.seed + 7),
    },
    {
      title: spin(`Citations, data, and what {must stay|to protect}`, entry.seed),
      body: spin(`{Never|Don't ever} let a rewriter touch ${doc.keep}. If ${m.name} fabricated a source, humanizing it only makes the {fabrication|lie} read better. {Verify|Check} every claim, then humanize. ${d.name} is a {separate problem|different issue} from plagiarism.`, entry.seed + 8),
    },
    {
      title: spin(`{Voice that matches|Sounding like} ${role.name}`, entry.seed),
      body: spin(`${role.workflow}. {Instructors|Readers|Clients} notice when a ${doc.name} suddenly {sounds like a different person|changes tone}. After HumanifyLab, compare a paragraph to something you wrote without a model. If they do not match, edit toward {you|your voice}, not toward {“more academic.”|being overly complex.}`, entry.seed + 9),
    }
  ];

  for (let i = allSections.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(entry.seed + i) * (i + 1));
    [allSections[i], allSections[j]] = [allSections[j]!, allSections[i]!];
  }

  const sectionCount = 4 + Math.floor(seededRandom(entry.seed) * 4);
  return allSections.slice(0, sectionCount);
}

export function buildPseoContent(entry: KeywordEntry): PseoPageData {
  const { detector, model, doc, role, geo, competitor, task } = resolve(entry);
  const k = titleCase(entry.keyword);
  const h1 = k;
  const { metaTitle, metaDescription } = metaFor(entry);

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
    eyebrow: eyebrows[entry.cluster]!,
    directAnswer: spin(answers[entry.cluster]!, entry.seed),
    heroSubtitle: spin(`{A practical page|An essential guide} for “${entry.keyword}” — {written|created} for ${role.name}, aimed at ${doc.name} drafts from ${model.name}, with ${detector.name} explained in {plain language|clear terms}.`, entry.seed),
    takeaways,
    sections: sectionsFor(entry, detector, model, doc, role, geo, competitor, task),
    steps: stepsFor(detector, model, doc),
    table,
    exampleTitle: spin(`{Worked example|Case study}: ${model.name} ${doc.name} before ${detector.name}`, entry.seed),
    exampleBody: spin(`Suppose ${role.name} in ${geo.name} {paste|submit} a ${model.name} ${doc.name}. The raw draft {shows|contains} ${model.tells} and follows ${model.cadence}. ${detector.name} is {likely|expected} to report ${detector.typicalScore} because of ${detector.method}. HumanifyLab {rewrites|fixes} openings and transitions while leaving ${doc.keep}. You then {restore|fix} ${doc.structure} where the model {drifted into|wandered into} ${doc.risk}. The result is not “invisible.” It is a ${doc.name} you can actually defend. ${model.bestFix}.`, entry.seed),
    mistakes,
    faqs: faqSet(entry, detector, model, doc),
    stats,
    ctaTitle: spin(`{Try|Test} HumanifyLab on this ${doc.name}`, entry.seed),
    ctaSubtitle: spin(`{Paste|Enter} a ${model.name} sample. {Keep|Protect} your meaning. {Read|Review} the result before anyone else does.`, entry.seed),
    readTime,
    updatedDate: modifiedDate(entry.seed, publishDate(entry.seed)),
    relatedLinks: buildRelatedLinks(entry.cluster, entry.keyword),
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
